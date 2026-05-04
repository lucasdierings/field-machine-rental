import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Send, MessageCircle, Clock, CheckCircle, AlertCircle, HelpCircle, Lightbulb, Bug } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const CATEGORIES = [
    { value: "duvida", label: "Dúvida", icon: HelpCircle, color: "text-blue-600" },
    { value: "reclamacao", label: "Reclamação", icon: AlertCircle, color: "text-red-600" },
    { value: "sugestao", label: "Sugestão", icon: Lightbulb, color: "text-yellow-600" },
    { value: "bug", label: "Problema Técnico", icon: Bug, color: "text-orange-600" },
    { value: "outro", label: "Outro", icon: MessageCircle, color: "text-gray-600" },
];

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    open: { label: "Aberto", color: "bg-yellow-100 text-yellow-800" },
    in_progress: { label: "Em Andamento", color: "bg-blue-100 text-blue-800" },
    resolved: { label: "Resolvido", color: "bg-green-100 text-green-800" },
    closed: { label: "Fechado", color: "bg-gray-100 text-gray-800" },
};

export default function Support() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { userId, profile, isAuthenticated } = useAuth();
    const queryClient = useQueryClient();

    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [category, setCategory] = useState("");
    const [sending, setSending] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // Load user's tickets
    const { data: tickets = [], isLoading } = useQuery({
        queryKey: ["support-tickets", userId],
        queryFn: async () => {
            const { data, error } = await (supabase as any)
                .from("support_tickets")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false });
            if (error) throw error;
            return data || [];
        },
        enabled: !!userId,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!subject.trim() || !message.trim() || !category) {
            toast({ title: "Preencha todos os campos", variant: "destructive" });
            return;
        }

        if (!isAuthenticated) {
            toast({ title: "Faça login para enviar", description: "Você precisa estar logado para abrir um chamado.", variant: "destructive" });
            navigate("/login");
            return;
        }

        setSending(true);
        try {
            const { error } = await (supabase as any)
                .from("support_tickets")
                .insert({
                    user_id: userId,
                    user_name: profile?.full_name || "Usuário",
                    user_email: profile?.email || "",
                    subject: subject.trim(),
                    message: message.trim(),
                    category,
                    status: "open",
                    priority: "normal",
                });

            if (error) throw error;

            toast({ title: "Chamado enviado!", description: "Nossa equipe responderá em breve." });
            setSubject("");
            setMessage("");
            setCategory("");
            setShowForm(false);
            queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
        } catch (error: any) {
            toast({ title: "Erro ao enviar", description: error.message, variant: "destructive" });
        } finally {
            setSending(false);
        }
    };

    const getCategoryIcon = (cat: string) => {
        const found = CATEGORIES.find(c => c.value === cat);
        if (!found) return <MessageCircle className="h-4 w-4" />;
        const Icon = found.icon;
        return <Icon className={`h-4 w-4 ${found.color}`} />;
    };

    return (
        <div className="min-h-screen bg-background pb-20 md:pb-0">
            <Header />
            <main className="pt-16 pb-8">
                <div className="container mx-auto px-4 max-w-3xl py-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold">Central de Suporte</h1>
                        <p className="text-muted-foreground text-sm">
                            Envie dúvidas, reclamações ou sugestões. Nossa equipe responderá o mais rápido possível.
                        </p>
                    </div>

                    {/* New Ticket Button */}
                    {!showForm && (
                        <Button onClick={() => setShowForm(true)} className="mb-6 w-full sm:w-auto">
                            <Send className="h-4 w-4 mr-2" />
                            Novo Chamado
                        </Button>
                    )}

                    {/* New Ticket Form */}
                    {showForm && (
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle className="text-lg">Novo Chamado</CardTitle>
                                <CardDescription>Descreva sua dúvida, reclamação ou sugestão.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Tipo *</Label>
                                        <Select value={category} onValueChange={setCategory}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o tipo..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {CATEGORIES.map((cat) => (
                                                    <SelectItem key={cat.value} value={cat.value}>
                                                        <span className="flex items-center gap-2">
                                                            <cat.icon className={`h-4 w-4 ${cat.color}`} />
                                                            {cat.label}
                                                        </span>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Assunto *</Label>
                                        <Input
                                            id="subject"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            placeholder="Resumo do seu chamado"
                                            maxLength={120}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message">Mensagem *</Label>
                                        <Textarea
                                            id="message"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Descreva em detalhes..."
                                            rows={5}
                                            maxLength={2000}
                                        />
                                        <p className="text-xs text-muted-foreground text-right">{message.length}/2000</p>
                                    </div>

                                    <div className="flex gap-2 justify-end">
                                        <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                            Cancelar
                                        </Button>
                                        <Button type="submit" disabled={sending}>
                                            {sending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                                            Enviar
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {/* Tickets List */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Meus Chamados</h2>

                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        ) : !isAuthenticated ? (
                            <Card className="border-dashed">
                                <CardContent className="text-center py-8">
                                    <MessageCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                                    <p className="text-muted-foreground text-sm mb-3">Faça login para ver seus chamados.</p>
                                    <Button variant="outline" onClick={() => navigate("/login")}>Entrar</Button>
                                </CardContent>
                            </Card>
                        ) : tickets.length === 0 ? (
                            <Card className="border-dashed">
                                <CardContent className="text-center py-8">
                                    <MessageCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                                    <p className="text-muted-foreground text-sm">Nenhum chamado enviado ainda.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-3">
                                {tickets.map((ticket: any) => {
                                    const status = STATUS_LABELS[ticket.status] || STATUS_LABELS.open;
                                    return (
                                        <Card key={ticket.id} className="hover:shadow-sm transition-shadow">
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-start gap-3 min-w-0">
                                                        {getCategoryIcon(ticket.category)}
                                                        <div className="min-w-0">
                                                            <p className="font-medium text-sm truncate">{ticket.subject}</p>
                                                            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{ticket.message}</p>
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <Clock className="h-3 w-3 text-muted-foreground" />
                                                                <span className="text-xs text-muted-foreground">
                                                                    {format(new Date(ticket.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Badge className={`shrink-0 text-xs ${status.color}`}>
                                                        {status.label}
                                                    </Badge>
                                                </div>

                                                {ticket.admin_notes && (
                                                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                                        <p className="text-xs font-medium text-blue-700 mb-1">Resposta da equipe:</p>
                                                        <p className="text-sm text-blue-900">{ticket.admin_notes}</p>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
