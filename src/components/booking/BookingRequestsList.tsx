import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
    Loader2, CheckCircle, XCircle, Calendar, User, Truck,
    Clock, Star, MessageCircle, CheckCircle2, AlertCircle
} from "lucide-react";

interface Booking {
    id: string;
    created_at: string;
    start_date: string;
    end_date?: string;
    status: string;
    total_amount?: number;
    total_price?: number;
    quantity: number;
    notes?: string;
    renter_id: string;
    owner_id: string;
    machines?: { name: string; category: string; brand?: string };
    machine?: { name: string; category: string };
    renter?: { full_name: string; phone?: string; avatar_url?: string };
}

interface BookingRequestsListProps {
    bookings: Booking[];
    onUpdate: () => void;
    currentUserId?: string;
}

const STATUS_TABS = [
    { key: 'pending',   label: 'Pendentes',   icon: Clock,         color: 'text-yellow-600' },
    { key: 'confirmed', label: 'Confirmadas',  icon: CheckCircle2,  color: 'text-blue-600'   },
    { key: 'completed', label: 'Concluídas',   icon: CheckCircle,   color: 'text-green-600'  },
    { key: 'rejected',  label: 'Rejeitadas',   icon: XCircle,       color: 'text-red-600'    },
];

export const BookingRequestsList = ({ bookings, onUpdate }: BookingRequestsListProps) => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>('pending');

    const handleAction = async (bookingId: string, action: 'confirm' | 'reject' | 'complete') => {
        setProcessingId(bookingId);
        try {
            const statusMap: Record<string, string> = {
                confirm: 'confirmed',
                reject: 'rejected',
                complete: 'completed',
            };
            const { error } = await supabase
                .from('bookings')
                .update({ status: statusMap[action] })
                .eq('id', bookingId);

            if (error) throw error;

            const messages: Record<string, string> = {
                confirm:  "Solicitação aceita! Entre em contato com o solicitante para combinar os detalhes.",
                reject:   "Solicitação rejeitada. O solicitante será notificado.",
                complete: "Serviço marcado como concluído! Agora você pode avaliar o cliente.",
            };

            toast({
                title: action === 'reject' ? "Solicitação Rejeitada" :
                       action === 'complete' ? "Serviço Concluído!" : "Solicitação Aceita!",
                description: messages[action],
                variant: action === 'reject' ? "destructive" : "default"
            });

            if (action === 'complete') {
                navigate(`/avaliar/${bookingId}`);
            } else {
                onUpdate();
            }
        } catch (error: any) {
            toast({ title: "Erro ao processar", description: error.message, variant: "destructive" });
        } finally {
            setProcessingId(null);
        }
    };

    const getMachineName = (b: Booking) => b.machines?.name || b.machine?.name || 'Máquina';
    const getAmount = (b: Booking) => b.total_amount || b.total_price || 0;

    const countByStatus = STATUS_TABS.reduce((acc, tab) => {
        acc[tab.key] = bookings.filter(b => b.status === tab.key).length;
        return acc;
    }, {} as Record<string, number>);

    const filtered = bookings.filter(b => b.status === activeTab);

    const statusBadgeClass = (status: string) => {
        if (status === 'pending')   return 'bg-yellow-50 text-yellow-700 border-yellow-200';
        if (status === 'confirmed') return 'bg-blue-50 text-blue-700 border-blue-200';
        if (status === 'completed') return 'bg-green-50 text-green-700 border-green-200';
        return 'bg-red-50 text-red-700 border-red-200';
    };

    const statusLabel = (status: string) => {
        if (status === 'pending')   return 'Pendente';
        if (status === 'confirmed') return 'Confirmada';
        if (status === 'completed') return 'Concluída';
        return 'Rejeitada';
    };

    if (bookings.length === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                    <h3 className="font-semibold text-lg mb-1">Nenhuma solicitação ainda</h3>
                    <p className="text-muted-foreground text-sm">
                        Quando alguém solicitar suas máquinas, os pedidos aparecerão aqui.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* Status Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
                {STATUS_TABS.map(tab => {
                    const Icon = tab.icon;
                    const count = countByStatus[tab.key];
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-colors ${
                                activeTab === tab.key
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-background border-border hover:bg-muted'
                            }`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            {tab.label}
                            {count > 0 && (
                                <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold ${
                                    activeTab === tab.key ? 'bg-white/20' : 'bg-muted-foreground/20'
                                }`}>
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Empty tab state */}
            {filtered.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                        <AlertCircle className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
                        <p className="text-muted-foreground text-sm">
                            Nenhuma solicitação "{STATUS_TABS.find(t => t.key === activeTab)?.label}".
                        </p>
                    </CardContent>
                </Card>
            ) : (
                filtered.map((booking) => (
                    <Card key={booking.id} className="overflow-hidden">
                        <CardHeader className="bg-muted/30 pb-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                                        {getMachineName(booking)}
                                        <Badge variant="outline" className={`font-normal text-xs ${statusBadgeClass(booking.status)}`}>
                                            {statusLabel(booking.status)}
                                        </Badge>
                                    </CardTitle>
                                    <CardDescription className="text-xs mt-1">
                                        Solicitado em {format(new Date(booking.created_at), "d 'de' MMMM, HH:mm", { locale: ptBR })}
                                    </CardDescription>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg text-primary">
                                        R$ {getAmount(booking).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Valor Estimado</p>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-4 grid md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <User className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Solicitante</p>
                                        <p className="text-sm text-foreground">{booking.renter?.full_name || 'Usuário do FieldMachine'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Data do Serviço</p>
                                        <p className="text-sm text-foreground">
                                            {format(new Date(booking.start_date), "dd/MM/yyyy", { locale: ptBR })}
                                            {booking.end_date && booking.start_date !== booking.end_date &&
                                                ` até ${format(new Date(booking.end_date), "dd/MM/yyyy", { locale: ptBR })}`}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Truck className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Qtd / Área</p>
                                        <p className="text-sm text-foreground">{booking.quantity} (unid./ha/dias)</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                {booking.notes && (
                                    <div className="bg-muted/50 p-3 rounded-md text-sm italic text-muted-foreground">
                                        "{booking.notes}"
                                    </div>
                                )}

                                {/* Chat */}
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => navigate(`/chat/${booking.renter_id}?booking=${booking.id}`)}
                                >
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Chat com Solicitante
                                </Button>

                                {/* WhatsApp */}
                                {booking.renter?.phone && (
                                    <Button
                                        variant="outline"
                                        className="w-full text-green-600 border-green-200 hover:bg-green-50"
                                        onClick={() => window.open(`https://wa.me/55${booking.renter!.phone!.replace(/\D/g, '')}`, '_blank')}
                                    >
                                        <span className="mr-2">📱</span>
                                        WhatsApp do Solicitante
                                    </Button>
                                )}

                                {/* Pending actions */}
                                {booking.status === 'pending' && (
                                    <div className="flex gap-2 mt-1">
                                        <Button
                                            variant="outline"
                                            className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
                                            onClick={() => handleAction(booking.id, 'reject')}
                                            disabled={!!processingId}
                                        >
                                            {processingId === booking.id
                                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                                : <XCircle className="w-4 h-4 mr-1" />}
                                            Rejeitar
                                        </Button>
                                        <Button
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                            onClick={() => handleAction(booking.id, 'confirm')}
                                            disabled={!!processingId}
                                        >
                                            {processingId === booking.id
                                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                                : <CheckCircle className="w-4 h-4 mr-1" />}
                                            Aceitar
                                        </Button>
                                    </div>
                                )}

                                {/* Confirmed: mark complete */}
                                {booking.status === 'confirmed' && (
                                    <Button
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-1"
                                        onClick={() => handleAction(booking.id, 'complete')}
                                        disabled={!!processingId}
                                    >
                                        {processingId === booking.id
                                            ? <Loader2 className="w-4 h-4 animate-spin" />
                                            : <CheckCircle2 className="w-4 h-4 mr-2" />}
                                        Marcar como Concluído
                                    </Button>
                                )}

                                {/* Completed: review */}
                                {booking.status === 'completed' && (
                                    <Button
                                        variant="outline"
                                        className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-50 mt-1"
                                        onClick={() => navigate(`/avaliar/${booking.id}`)}
                                    >
                                        <Star className="w-4 h-4 mr-2" />
                                        Avaliar Cliente
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
};
