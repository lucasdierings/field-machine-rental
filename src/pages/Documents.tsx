import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KYCUpload } from "@/components/kyc/KYCUpload";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileCheck, Clock, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Documents = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("user_documents")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setDocuments(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar documentos",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (verified: boolean) => {
    if (verified) {
      return (
        <Badge className="bg-success text-success-foreground">
          <FileCheck className="mr-1 h-3 w-3" />
          Verificado
        </Badge>
      );
    }
    return (
      <Badge variant="outline">
        <Clock className="mr-1 h-3 w-3" />
        Aguardando Análise
      </Badge>
    );
  };

  const getDocumentTypeName = (type: string) => {
    const types: Record<string, string> = {
      cpf: "CPF",
      cnpj: "CNPJ",
      rg: "RG",
      cnh: "CNH",
      proof_of_address: "Comprovante de Residência",
      outros: "Outros"
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Meus Documentos</CardTitle>
              <CardDescription>
                Envie seus documentos para verificação e liberar todas as funcionalidades
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Section */}
              <div>
                <h3 className="font-semibold mb-4">Enviar Novo Documento</h3>
                <KYCUpload 
                  userId="" 
                  documents={[]} 
                  onDocumentsChange={() => loadDocuments()} 
                />
              </div>

              {/* Documents List */}
              {documents.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-4">Documentos Enviados</h3>
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium">
                            {getDocumentTypeName(doc.document_type)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Enviado em {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                          </p>
                          {doc.rejection_reason && (
                            <div className="mt-2 flex items-start gap-2 text-sm text-destructive">
                              <XCircle className="h-4 w-4 mt-0.5" />
                              <span>{doc.rejection_reason}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          {getStatusBadge(doc.verified)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {documents.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhum documento enviado ainda.</p>
                  <p className="text-sm">Envie seus documentos para verificação.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Documents;
