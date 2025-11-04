import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, FileText, User, Mail, Phone, Calendar, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PendingDocument {
  id: string;
  user_id: string;
  document_type: string;
  document_url: string;
  created_at: string;
  user_name: string;
  user_phone: string;
  user_email: string;
  cpf_cnpj: string;
}

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  cpf: 'CPF',
  cnpj: 'CNPJ',
  cnh: 'CNH',
  rg: 'RG',
  proof_of_address: 'Comprovante de Endereço',
  machine_ownership: 'Comprovante de Propriedade de Máquina'
};

const DocumentApprovalComponent = () => {
  const [documents, setDocuments] = useState<PendingDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<PendingDocument | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadPendingDocuments();
  }, []);

  const loadPendingDocuments = async () => {
    try {
      setLoading(true);
      // Usar função RPC ao invés da view
      const { data, error } = await supabase
        .rpc('get_admin_pending_documents');

      if (error) throw error;

      setDocuments(data || []);
    } catch (error) {
      console.error('Erro ao carregar documentos:', error);
      toast({
        title: "Erro ao carregar documentos",
        description: "Não foi possível carregar os documentos pendentes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (documentId: string) => {
    try {
      setProcessingId(documentId);
      
      const { error } = await supabase.rpc('admin_approve_document', {
        document_id: documentId
      });

      if (error) throw error;

      toast({
        title: "Documento aprovado",
        description: "O documento foi aprovado com sucesso",
      });

      // Recarregar a lista
      await loadPendingDocuments();
    } catch (error) {
      console.error('Erro ao aprovar documento:', error);
      toast({
        title: "Erro ao aprovar",
        description: "Não foi possível aprovar o documento",
        variant: "destructive"
      });
    } finally {
      setProcessingId(null);
    }
  };

  const openRejectDialog = (document: PendingDocument) => {
    setSelectedDocument(document);
    setRejectionReason('');
    setRejectDialogOpen(true);
  };

  const handleReject = async () => {
    if (!selectedDocument || !rejectionReason.trim()) {
      toast({
        title: "Motivo obrigatório",
        description: "Por favor, informe o motivo da rejeição",
        variant: "destructive"
      });
      return;
    }

    try {
      setProcessingId(selectedDocument.id);
      
      const { error } = await supabase.rpc('admin_reject_document', {
        document_id: selectedDocument.id,
        reason: rejectionReason.trim()
      });

      if (error) throw error;

      toast({
        title: "Documento rejeitado",
        description: "O documento foi rejeitado e o usuário foi notificado",
      });

      setRejectDialogOpen(false);
      setSelectedDocument(null);
      setRejectionReason('');

      // Recarregar a lista
      await loadPendingDocuments();
    } catch (error) {
      console.error('Erro ao rejeitar documento:', error);
      toast({
        title: "Erro ao rejeitar",
        description: "Não foi possível rejeitar o documento",
        variant: "destructive"
      });
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            Nenhum documento pendente de aprovação
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => (
          <Card key={doc.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{doc.user_name}</CardTitle>
                  <CardDescription className="mt-1">
                    <Badge variant="outline" className="mt-1">
                      {DOCUMENT_TYPE_LABELS[doc.document_type] || doc.document_type}
                    </Badge>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Informações do Usuário */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{doc.cpf_cnpj}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{doc.user_email}</span>
                </div>
                {doc.user_phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{doc.user_phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDistanceToNow(new Date(doc.created_at), {
                      addSuffix: true,
                      locale: ptBR
                    })}
                  </span>
                </div>
              </div>

              {/* Preview do Documento */}
              <div className="border rounded-lg overflow-hidden bg-muted/50">
                <a
                  href={doc.document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block aspect-video relative group"
                >
                  {doc.document_url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                    <img
                      src={doc.document_url}
                      alt="Documento"
                      className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                      Abrir documento
                    </span>
                  </div>
                </a>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => handleApprove(doc.id)}
                  disabled={processingId !== null}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  {processingId === doc.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Aprovar
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => openRejectDialog(doc)}
                  disabled={processingId !== null}
                  variant="destructive"
                  className="flex-1"
                  size="sm"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Rejeitar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog de Rejeição */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar Documento</DialogTitle>
            <DialogDescription>
              Informe o motivo da rejeição. O usuário será notificado.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedDocument && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <strong>Usuário:</strong> {selectedDocument.user_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Documento:</strong>{' '}
                  {DOCUMENT_TYPE_LABELS[selectedDocument.document_type] || selectedDocument.document_type}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Motivo da Rejeição *</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Ex: Documento ilegível, informações incompletas, foto de má qualidade..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
              disabled={processingId !== null}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={processingId !== null || !rejectionReason.trim()}
            >
              {processingId ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              Confirmar Rejeição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentApprovalComponent;
