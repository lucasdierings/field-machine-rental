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
    document_url: string;
    verified: boolean | null;
    rejection_reason?: string | null;
    verified_at?: string | null;
    created_at: string | null;
    signedUrl?: string;
    user?: { full_name: string | null; email: string | null };
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

    // Carrega documentos pendentes e gera URLs assinadas
    const loadDocuments = async () => {
        setLoading(true);
        try {
            // Step 1: Busca documentos pendentes (sem join — FK aponta para auth.users)
            const { data: docs, error } = await supabase
                .from("user_documents")
                .select("*")
                .eq("verified", false)
                .is("rejection_reason", null)
                .order("created_at", { ascending: true });

            if (error) throw error;

            const docList = docs || [];

            // Step 2: Busca perfis dos usuários
            const userIds = [...new Set(docList.map((d: any) => d.user_id).filter(Boolean))];
            let profileMap: Record<string, { full_name: string | null; email: string | null }> = {};
            if (userIds.length > 0) {
                const { data: profiles } = await supabase
                    .from("user_profiles")
                    .select("auth_user_id, full_name, email")
                    .in("auth_user_id", userIds);
                profileMap = Object.fromEntries(
                    (profiles || []).map((p: any) => [p.auth_user_id, { full_name: p.full_name, email: p.email }])
                );
            }

            // Step 3: Gera URLs assinadas e mescla perfis
            const docsWithUrl = await Promise.all(
                docList.map(async (doc: any) => {
                    let signedUrl = "";
                    if (doc.document_url) {
                        const { data: signedData } = await supabase.storage
                            .from("user-documents")
                            .createSignedUrl(doc.document_url, 3600);

                        if (signedData?.signedUrl) {
                            signedUrl = signedData.signedUrl;
                        } else {
                            const { data: publicData } = supabase.storage
                                .from("user-documents")
                                .getPublicUrl(doc.document_url);
                            signedUrl = publicData?.publicUrl || "";
                        }
                    }

                    return {
                        ...doc,
                        signedUrl,
                        user: profileMap[doc.user_id] || { full_name: null, email: null },
                    };
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

    const handleApprove = async (docId: string) => {
        setProcessing(docId);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const { error } = await supabase
                .from("user_documents")
                .update({
                    verified: true,
                    verified_at: new Date().toISOString(),
                    verified_by: user?.id,
                })
                .eq("id", docId);

            if (error) throw error;

            toast({
                title: "Documento aprovado!",
                description: "O usuário será notificado.",
            });

            setDocuments(prev => prev.filter(d => d.id !== docId));
        } catch (error: any) {
            toast({
                title: "Erro ao aprovar",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setProcessing(null);
        }
    };

    const handleReject = async (docId: string) => {
        if (!rejectReason.trim()) {
            toast({
                title: "Informe o motivo",
                description: "Digite o motivo da rejeição antes de confirmar.",
                variant: "destructive",
            });
            return;
        }

        setProcessing(docId);
        try {
            const { error } = await supabase
                .from("user_documents")
                .update({ rejection_reason: rejectReason.trim() })
                .eq("id", docId);

            if (error) throw error;

            toast({
                title: "Documento rejeitado",
                description: "O motivo foi registrado para o usuário.",
            });

            setRejectReason("");
            setDocuments(prev => prev.filter(d => d.id !== docId));
        } catch (error: any) {
            toast({
                title: "Erro ao rejeitar",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setProcessing(null);
        }
    };

    const handleDownload = async (doc: UserDocument) => {
        try {
            if (!doc.document_url) throw new Error("Caminho do documento não encontrado");

            const { data, error } = await supabase.storage
                .from("user-documents")
                .download(doc.document_url);

            if (error) throw error;

            const url = URL.createObjectURL(data);
            const a = document.createElement("a");
            a.href = url;
            a.download = doc.document_url.split("/").pop() || "documento";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error: any) {
            toast({
                title: "Erro ao baixar",
                description: error.message || "Falha ao baixar documento",
                variant: "destructive",
            });
        }
    };

    const getDocTypeName = (type: string) => {
        const map: Record<string, string> = {
            cpf: "CPF", cnpj: "CNPJ", rg: "RG", cnh: "CNH",
            proof_of_address: "Comp. Residência", outro: "Outro",
        };
        return map[type] || type;
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
            <p className="text-sm text-muted-foreground">{documents.length} documento(s) aguardando análise</p>
            {documents.map((doc) => (
                <Card key={doc.id}>
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-lg">{doc.user?.full_name || "Usuário Desconhecido"}</CardTitle>
                                <p className="text-sm text-muted-foreground">{doc.user?.email || "—"}</p>
                            </div>
                            <Badge variant="outline">{getDocTypeName(doc.document_type)}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <FileText className="h-4 w-4" />
                                Enviado em {new Date(doc.created_at || "").toLocaleDateString("pt-BR")}
                            </div>
                            <div className="flex gap-2 flex-wrap justify-end">
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
                                            <DialogTitle>Documento — {doc.user?.full_name || "Usuário"}</DialogTitle>
                                        </DialogHeader>
                                        <div className="flex-1 h-full bg-muted rounded-md overflow-hidden">
                                            {doc.signedUrl ? (
                                                /\.(png|jpg|jpeg|webp)(\?|$)/i.test(doc.signedUrl) ? (
                                                    <img src={doc.signedUrl} alt="Documento" className="w-full h-full object-contain" />
                                                ) : (
                                                    <iframe src={doc.signedUrl} className="w-full h-full" title="Documento" />
                                                )
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                                    URL não disponível
                                                </div>
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
                                        <Button variant="destructive" size="sm" disabled={processing === doc.id}>
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
                                            <Textarea
                                                placeholder="Ex: Documento ilegível, data expirada..."
                                                value={rejectReason}
                                                onChange={(e) => setRejectReason(e.target.value)}
                                            />
                                            <Button
                                                variant="destructive"
                                                className="w-full"
                                                onClick={() => handleReject(doc.id)}
                                                disabled={processing === doc.id}
                                            >
                                                {processing === doc.id ? <Loader2 className="animate-spin" /> : "Confirmar Rejeição"}
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                {/* Aprovar */}
                                <Button
                                    className="bg-green-600 hover:bg-green-700"
                                    size="sm"
                                    onClick={() => handleApprove(doc.id)}
                                    disabled={processing === doc.id}
                                >
                                    {processing === doc.id ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        <>
                                            <Check className="h-4 w-4 mr-2" />
                                            Aprovar
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
