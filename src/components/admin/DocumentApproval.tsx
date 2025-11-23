import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check, X, FileText, Eye, Download } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface UserDocument {
    id: string;
    user_id: string;
    document_type: string;
    document_path: string; // caminho no bucket (ex.: "doc123.pdf")
    document_url?: string; // URL pública ou assinada (preenchido dinamicamente)
    verified: boolean;
    created_at: string;
    user?: { full_name: string; email: string };
}

export const DocumentApproval = () => {
    const [documents, setDocuments] = useState<UserDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        loadDocuments();
    }, []);

    // Carrega documentos pendentes e gera URLs públicas/assinadas
    const loadDocuments = async () => {
        try {
            const { data, error } = await supabase
                .from("user_documents")
                .select(`*, user:users(full_name, email)`)
                .eq("verified", false)
                .order("created_at", { ascending: true });

            if (error) throw error;

            const docsWithUrl = await Promise.all(
                data.map(async (doc: any) => {
                    const path = doc.document_path || doc.document_url;
                    if (path) {
                        const { data: publicData } = supabase.storage
                            .from("user-documents")
                            .getPublicUrl(path);
                        const url = publicData?.publicUrl || "";
                        return { ...doc, document_url: url };
                    }
                    return doc;
                })
            );

            setDocuments(docsWithUrl);
        } catch (error: any) {
            console.error("Erro ao carregar documentos:", error);
            toast({
                title: "Erro ao carregar",
                description: "Não foi possível buscar os documentos pendentes.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // Aprovar documento
    const handleApprove = async (docId: string) => {
        try {
            setProcessing(docId);
            const { error } = await supabase
                .from("user_documents")
                .update({ verified: true })
                .eq("id", docId);
            if (error) throw error;
            setDocuments((prev) => prev.filter((d) => d.id !== docId));
            toast({ title: "Documento aprovado", description: "O usuário foi notificado." });
        } catch (error: any) {
            toast({ title: "Erro ao aprovar", description: error.message, variant: "destructive" });
        } finally {
            setProcessing(null);
        }
    };

    // Rejeitar documento
    const handleReject = async (docId: string) => {
        if (!rejectReason) {
            toast({ title: "Motivo obrigatório", description: "Informe o motivo da rejeição.", variant: "destructive" });
            return;
        }
        try {
            setProcessing(docId);
            const { error } = await supabase.from("user_documents").delete().eq("id", docId);
            if (error) throw error;
            setDocuments((prev) => prev.filter((d) => d.id !== docId));
            setRejectReason("");
            toast({ title: "Documento rejeitado", description: "O documento foi removido." });
        } catch (error: any) {
            toast({ title: "Erro ao rejeitar", description: error.message, variant: "destructive" });
        } finally {
            setProcessing(null);
        }
    };

    // Baixar documento
    const handleDownload = async (doc: UserDocument) => {
        try {
            const { data, error } = await supabase.storage
                .from("user-documents")
                .download(doc.document_path);
            if (error) throw error;
            const url = URL.createObjectURL(data);
            const a = document.createElement("a");
            a.href = url;
            a.download = doc.document_path.split("/").pop() || "documento";
            a.click();
            URL.revokeObjectURL(url);
        } catch (error: any) {
            toast({ title: "Erro ao baixar", description: error.message, variant: "destructive" });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="animate-spin" />
            </div>
        );
    }

    if (documents.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Check className="h-12 w-12 mb-4 text-green-500" />
                    <p>Todos os documentos foram verificados!</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {documents.map((doc) => (
                <Card key={doc.id}>
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-lg">{doc.user?.full_name || "Usuário Desconhecido"}</CardTitle>
                                <p className="text-sm text-muted-foreground">{doc.user?.email}</p>
                            </div>
                            <Badge variant="outline">{doc.document_type}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <FileText className="h-4 w-4" />
                                Enviado em {new Date(doc.created_at).toLocaleDateString()}
                            </div>
                            <div className="flex gap-2">
                                {/* Visualizar */}
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <Eye className="h-4 w-4 mr-2" />
                                            Visualizar
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl h-[80vh]">
                                        <DialogHeader>
                                            <DialogTitle>Visualizar Documento</DialogTitle>
                                        </DialogHeader>
                                        <div className="flex-1 h-full bg-muted rounded-md overflow-hidden">
                                            {doc.document_url?.endsWith('.png') || doc.document_url?.endsWith('.jpg') || doc.document_url?.endsWith('.jpeg') ? (
                                                <img src={doc.document_url} alt="Documento" className="w-full h-full object-contain" />
                                            ) : (
                                                <iframe src={doc.document_url} className="w-full h-full" title="Documento" />
                                            )}
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                {/* Baixar */}
                                <Button variant="secondary" size="sm" onClick={() => handleDownload(doc)}>
                                    <Download className="h-4 w-4 mr-2" />
                                    Baixar
                                </Button>
                                {/* Rejeitar */}
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="destructive" size="sm">
                                            <X className="h-4 w-4 mr-2" />
                                            Rejeitar
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Rejeitar Documento</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <p className="text-sm text-muted-foreground">Informe o motivo da rejeição para o usuário.</p>
                                            <Textarea placeholder="Ex: Documento ilegível, data expirada..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
                                            <Button variant="destructive" className="w-full" onClick={() => handleReject(doc.id)} disabled={processing === doc.id}>
                                                {processing === doc.id ? <Loader2 className="animate-spin" /> : "Confirmar Rejeição"}
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                {/* Aprovar */}
                                <Button className="bg-green-600 hover:bg-green-700" size="sm" onClick={() => handleApprove(doc.id)} disabled={processing === doc.id}>
                                    {processing === doc.id ? <Loader2 className="animate-spin" /> : (<>
                                        <Check className="h-4 w-4 mr-2" />
                                        Aprovar
                                    </>)}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
