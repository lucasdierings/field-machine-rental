import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
    Inbox, Clock, CheckCircle, AlertCircle, HelpCircle, Lightbulb, Bug,
    MessageCircle, Loader2, ChevronDown, ChevronUp, Send, X
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Ticket {
    id: string;
    user_id: string;
    user_name: string;
    user_email: string;
    subject: string;
    message: string;
    category: string;
    status: string;
    priority: string;
    admin_notes: string | null;
    created_at: string;
    updated_at: string;
    closed_at: string | null;
}

const STATUS_OPTIONS = [
    { value: "all", label: "Todos" },
    { value: "open", label: "Abertos" },
    { value: "in_progress", label: "Em Andamento" },
    { value: "resolved", label: "Resolvidos" },
    { value: "closed", label: "Fechados" },
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
    open: { label: "Aberto", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    in_progress: { label: "Em Andamento", color: "bg-blue-100 text-blue-800 border-blue-200" },
    resolved: { label: "Resolvido", color: "bg-green-100 text-green-800 border-green-200" },
    closed: { label: "Fechado", color: "bg-gray-100 text-gray-800 border-gray-200" },
};

const CATEGORY_ICONS: Record<string, { icon: typeof HelpCircle; label: string; color: string }> = {
    duvida: { icon: HelpCircle, label: "Dúvida", color: "text-blue-600" },
    reclamacao: { icon: AlertCircle, label: "Reclamação", color: "text-red-600" },
    sugestao: { icon: Lightbulb, label: "Sugestão", color: "text-yellow-600" },
    bug: { icon: Bug, label: "Bug", color: "text-orange-600" },
    outro: { icon: MessageCircle, label: "Outro", color: "text-gray-600" },
};

const AdminSupportTab = () => {
    const { toast } = useToast();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("all");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [adminReply, setAdminReply] = useState("");
    const [replyingId, setReplyingId] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const loadTickets = useCallback(async () => {
        try {
            setLoading(true);
            let query = (supabase as any)
                .from("support_tickets")
                .select("*")
                .order("created_at", { ascending: false });

            if (filterStatus !== "all") {
                query = query.eq("status", filterStatus);
            }

            const { data, error } = await query;
            if (error) throw error;
            setTickets(data || []);
        } catch (error: any) {
            toast({ title: "Erro ao carregar chamados", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }, [filterStatus, toast]);

    useEffect(() => {
        loadTickets();
    }, [loadTickets]);

    const handleUpdateStatus = async (ticketId: string, newStatus: string) => {
        setUpdatingId(ticketId);
        try {
            const updateData: any = {
                status: newStatus,
                updated_at: new Date().toISOString(),
            };
            if (newStatus === "closed" || newStatus === "resolved") {
                updateData.closed_at = new Date().toISOString();
            }

            const { error } = await (supabase as any)
                .from("support_tickets")
                .update(updateData)
                .eq("id", ticketId);

            if (error) throw error;

            toast({ title: "Status atualizado" });
            loadTickets();
        } catch (error: any) {
            toast({ title: "Erro", description: error.message, variant: "destructive" });
        } finally {
            setUpdatingId(null);
        }
    };

    const handleSendReply = async (ticketId: string) => {
        if (!adminReply.trim()) return;

        setReplyingId(ticketId);
        try {
            // Save admin notes on the ticket
            const { error } = await (supabase as any)
                .from("support_tickets")
                .update({
                    admin_notes: adminReply.trim(),
                    status: "in_progress",
                    updated_at: new Date().toISOString(),
                })
                .eq("id", ticketId);

            if (error) throw error;

            toast({ title: "Resposta enviada!" });
            setAdminReply("");
            setExpandedId(null);
            loadTickets();
        } catch (error: any) {
            toast({ title: "Erro ao responder", description: error.message, variant: "destructive" });
        } finally {
            setReplyingId(null);
        }
    };

    const counts = {
        open: tickets.filter(t => t.status === "open").length,
        in_progress: tickets.filter(t => t.status === "in_progress").length,
        resolved: tickets.filter(t => t.status === "resolved").length,
        total: tickets.length,
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Inbox className="h-5 w-5" />
                    Caixa de Entrada — Suporte
                    {counts.open > 0 && (
                        <Badge className="bg-red-500 text-white ml-2">{counts.open} novo{counts.open > 1 ? "s" : ""}</Badge>
                    )}
                </CardTitle>
                <CardDescription>
                    Gerencie chamados de dúvidas, reclamações e sugestões dos usuários
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Summary cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-yellow-700">{counts.open}</p>
                        <p className="text-xs text-yellow-600">Abertos</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-blue-700">{counts.in_progress}</p>
                        <p className="text-xs text-blue-600">Em Andamento</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-green-700">{counts.resolved}</p>
                        <p className="text-xs text-green-600">Resolvidos</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-gray-700">{counts.total}</p>
                        <p className="text-xs text-gray-600">Total</p>
                    </div>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-3">
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filtrar status" />
                        </SelectTrigger>
                        <SelectContent>
                            {STATUS_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" onClick={loadTickets}>
                        Atualizar
                    </Button>
                </div>

                {/* Tickets Table */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <Inbox className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p>Nenhum chamado encontrado.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {tickets.map((ticket) => {
                            const statusInfo = STATUS_BADGES[ticket.status] || STATUS_BADGES.open;
                            const catInfo = CATEGORY_ICONS[ticket.category] || CATEGORY_ICONS.outro;
                            const CatIcon = catInfo.icon;
                            const isExpanded = expandedId === ticket.id;

                            return (
                                <div key={ticket.id} className="border rounded-lg overflow-hidden">
                                    {/* Ticket Header */}
                                    <div
                                        className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                                        onClick={() => setExpandedId(isExpanded ? null : ticket.id)}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-start gap-3 min-w-0">
                                                <CatIcon className={`h-5 w-5 mt-0.5 shrink-0 ${catInfo.color}`} />
                                                <div className="min-w-0">
                                                    <p className="font-medium text-sm">{ticket.subject}</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        {ticket.user_name} ({ticket.user_email})
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {format(new Date(ticket.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                                        </span>
                                                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${catInfo.color}`}>
                                                            {catInfo.label}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <Badge className={`text-xs ${statusInfo.color}`}>{statusInfo.label}</Badge>
                                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Content */}
                                    {isExpanded && (
                                        <div className="border-t p-4 bg-muted/10 space-y-4">
                                            {/* User message */}
                                            <div className="bg-white rounded-lg p-3 border">
                                                <p className="text-xs font-medium text-muted-foreground mb-1">Mensagem do usuário:</p>
                                                <p className="text-sm whitespace-pre-wrap">{ticket.message}</p>
                                            </div>

                                            {/* Existing admin notes */}
                                            {ticket.admin_notes && (
                                                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                                                    <p className="text-xs font-medium text-blue-700 mb-1">Resposta anterior:</p>
                                                    <p className="text-sm text-blue-900 whitespace-pre-wrap">{ticket.admin_notes}</p>
                                                </div>
                                            )}

                                            {/* Reply */}
                                            <div className="space-y-2">
                                                <Textarea
                                                    placeholder="Escreva sua resposta ao usuário..."
                                                    value={expandedId === ticket.id ? adminReply : ""}
                                                    onChange={(e) => setAdminReply(e.target.value)}
                                                    rows={3}
                                                />
                                                <div className="flex items-center justify-between">
                                                    {/* Status actions */}
                                                    <div className="flex gap-1">
                                                        {ticket.status !== "resolved" && (
                                                            <Button
                                                                variant="outline" size="sm"
                                                                onClick={() => handleUpdateStatus(ticket.id, "resolved")}
                                                                disabled={updatingId === ticket.id}
                                                                className="text-green-700 border-green-200 hover:bg-green-50"
                                                            >
                                                                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                                                Resolver
                                                            </Button>
                                                        )}
                                                        {ticket.status !== "closed" && (
                                                            <Button
                                                                variant="outline" size="sm"
                                                                onClick={() => handleUpdateStatus(ticket.id, "closed")}
                                                                disabled={updatingId === ticket.id}
                                                                className="text-gray-700 border-gray-200 hover:bg-gray-50"
                                                            >
                                                                <X className="h-3.5 w-3.5 mr-1" />
                                                                Fechar
                                                            </Button>
                                                        )}
                                                    </div>

                                                    {/* Send reply */}
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleSendReply(ticket.id)}
                                                        disabled={!adminReply.trim() || replyingId === ticket.id}
                                                    >
                                                        {replyingId === ticket.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                                        ) : (
                                                            <Send className="h-4 w-4 mr-1" />
                                                        )}
                                                        Responder
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default AdminSupportTab;
