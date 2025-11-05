import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileCheck, Clock, XCircle, Upload, Download, Trash2, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Documents = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocType, setSelectedDocType] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      outro: "Outro"
    };
    return types[type] || type;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedDocType) {
      if (!selectedDocType) {
        toast({
          title: "Selecione o tipo de documento",
          description: "Escolha o tipo antes de fazer upload",
          variant: "destructive"
        });
      }
      return;
    }

    // Validar tipo de arquivo
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Use PDF, JPG, PNG ou WEBP",
        variant: "destructive"
      });
      return;
    }

    // Validar tamanho (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 10MB",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      // Upload para o bucket user-documents
      const fileName = `${user.id}/${selectedDocType}_${Date.now()}.${file.name.split('.').pop()}`;
      const { error: uploadError } = await supabase.storage
        .from('user-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('user-documents')
        .getPublicUrl(fileName);

      // Inserir registro na tabela
      const { error: dbError } = await supabase
        .from('user_documents')
        .insert({
          user_id: user.id,
          document_type: selectedDocType,
          document_url: fileName
        });

      if (dbError) throw dbError;

      toast({
        title: "Upload realizado!",
        description: "Documento enviado para análise"
      });

      setSelectedDocType("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      loadDocuments();
    } catch (error: any) {
      toast({
        title: "Erro no upload",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (doc: any) => {
    try {
      const { data, error } = await supabase.storage
        .from('user-documents')
        .download(doc.document_url);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${getDocumentTypeName(doc.document_type)}_${new Date(doc.created_at).toLocaleDateString('pt-BR')}.${doc.document_url.split('.').pop()}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download iniciado",
        description: "Documento baixado com sucesso"
      });
    } catch (error: any) {
      toast({
        title: "Erro no download",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (doc: any) => {
    if (!confirm("Deseja realmente excluir este documento?")) return;

    try {
      // Deletar do storage
      const { error: storageError } = await supabase.storage
        .from('user-documents')
        .remove([doc.document_url]);

      if (storageError) throw storageError;

      // Deletar do banco
      const { error: dbError } = await supabase
        .from('user_documents')
        .delete()
        .eq('id', doc.id);

      if (dbError) throw dbError;

      toast({
        title: "Documento excluído",
        description: "Documento removido com sucesso"
      });

      loadDocuments();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive"
      });
    }
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
              <div className="border-2 border-dashed border-border rounded-lg p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Enviar Novo Documento
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Tipo de Documento *
                    </label>
                    <Select value={selectedDocType} onValueChange={setSelectedDocType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de documento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cpf">CPF</SelectItem>
                        <SelectItem value="cnpj">CNPJ</SelectItem>
                        <SelectItem value="rg">RG</SelectItem>
                        <SelectItem value="cnh">CNH</SelectItem>
                        <SelectItem value="proof_of_address">Comprovante de Residência</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading || !selectedDocType}
                      className="w-full"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Selecionar e Enviar Arquivo
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Formatos aceitos: PDF, JPG, PNG, WEBP (máx. 10MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* Documents List */}
              {documents.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-4">Documentos Enviados</h3>
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <FileText className="h-5 w-5 text-muted-foreground mt-1" />
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
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(doc.verified)}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(doc)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(doc)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
