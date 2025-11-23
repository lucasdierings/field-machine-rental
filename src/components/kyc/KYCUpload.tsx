import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  FileText,
  Download,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface KYCDocument {
  id: string;
  fileName: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  type: string;
}

interface KYCUploadProps {
  userId: string;
  documents: KYCDocument[];
  onDocumentsChange: (documents: KYCDocument[]) => void;
}

export const KYCUpload = ({ userId, documents, onDocumentsChange }: KYCUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const documentTypes = [
    { value: 'cpf', label: 'CPF' },
    { value: 'cnpj', label: 'CNPJ' },
    { value: 'rg', label: 'RG' },
    { value: 'comprovante_residencia', label: 'Comprovante de Residência' },
    { value: 'contrato_social', label: 'Contrato Social' },
    { value: 'inscricao_estadual', label: 'Inscrição Estadual' },
  ];

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = async (file: File) => {
    // Validate file types
    const validTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp'
    ];

    if (!validTypes.includes(file.type)) {
      toast({
        title: "Arquivo inválido",
        description: "Apenas arquivos PDF, JPG, PNG e WEBP são permitidos",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 10MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const documentId = crypto.randomUUID();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${documentId}.${fileExtension}`;
      const filePath = `users/${userId}/${fileName}`;

      // Upload to private bucket
      const { error: uploadError } = await supabase.storage
        .from('private-kyc')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const newDocument: KYCDocument = {
        id: documentId,
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
        status: 'pending',
        type: 'generic' // Could be enhanced with document type detection
      };

      onDocumentsChange([...documents, newDocument]);

      toast({
        title: "Documento enviado",
        description: "Seu documento foi enviado para análise",
      });

    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('Upload error:', error);
      }
      toast({
        title: "Erro no upload",
        description: error.message || "Falha ao enviar documento",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (document: KYCDocument) => {
    setDownloadingId(document.id);

    try {
      const filePath = `users/${userId}/${document.id}.${document.fileName.split('.').pop()}`;

      // Create signed URL for download
      const { data, error } = await supabase.storage
        .from('private-kyc')
        .createSignedUrl(filePath, 300); // 5 minutes

      if (error) {
        throw error;
      }

      // Download file
      const link = window.document.createElement('a');
      link.href = data.signedUrl;
      link.download = document.fileName;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);

    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('Download error:', error);
      }
      toast({
        title: "Erro no download",
        description: error.message || "Falha ao baixar documento",
        variant: "destructive",
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Loader2 className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprovado';
      case 'rejected':
        return 'Rejeitado';
      default:
        return 'Pendente';
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentos KYC</CardTitle>
        <CardDescription>
          Envie seus documentos para verificação de identidade
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            onChange={handleFileInput}
            className="hidden"
          />

          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">
                Enviando documento...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="h-8 w-8 text-muted-foreground mb-4" />
              <p className="text-sm font-medium mb-2">
                Envie seus documentos de identificação
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                PDF, JPG, PNG, WEBP até 10MB
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Selecionar Arquivo
              </Button>
            </div>
          )}
        </div>

        {/* Required Documents Info */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium mb-2">Documentos necessários:</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• CPF ou CNPJ</li>
            <li>• RG ou CNH</li>
            <li>• Comprovante de residência</li>
            <li>• Contrato social (pessoa jurídica)</li>
          </ul>
        </div>

        {/* Documents List */}
        {documents.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Documentos enviados:</h4>
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{doc.fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(doc.uploadedAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusVariant(doc.status)}>
                    {getStatusIcon(doc.status)}
                    <span className="ml-1">{getStatusText(doc.status)}</span>
                  </Badge>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(doc)}
                    disabled={downloadingId === doc.id}
                  >
                    {downloadingId === doc.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};