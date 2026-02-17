import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, MessageCircle, Clock, CheckCircle2, XCircle, Star, AlertCircle, CheckCircle } from "lucide-react";

interface Booking {
    id: string;
    created_at: string;
    start_date: string;
    end_date?: string;
    status: string;
    total_amount: number;
    total_price?: number;
    quantity: number;
    owner_id: string;
    machines?: {
        name: string;
        category: string;
    };
    machine?: {
        name: string;
        category: string;
    };
    owner?: {
        full_name: string;
        phone?: string;
    };
}

interface RenterBookingsListProps {
    bookings: Booking[];
    currentUserId?: string;
}

const STATUS_TABS = [
    { key: 'pending', label: 'Pendentes', icon: Clock },
    { key: 'confirmed', label: 'Aprovadas', icon: CheckCircle2 },
    { key: 'completed', label: 'Concluídas', icon: CheckCircle },
    { key: 'rejected', label: 'Rejeitadas', icon: XCircle },
];

export const RenterBookingsList = ({ bookings }: RenterBookingsListProps) => {
    const navigate = useNavigate();

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'pending':   return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'completed': return 'bg-green-100 text-green-700 border-green-200';
            case 'rejected':  return 'bg-red-100 text-red-700 border-red-200';
            default:          return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending':   return 'Aguardando Aprovação';
            case 'confirmed': return 'Aprovado';
            case 'completed': return 'Concluído';
            case 'rejected':  return 'Recusado';
            default:          return status;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':   return Clock;
            case 'confirmed': return CheckCircle2;
            case 'completed': return CheckCircle;
            case 'rejected':  return XCircle;
            default:          return Clock;
        }
    };

    const getMachineName = (b: Booking) => b.machines?.name || b.machine?.name || 'Máquina';
    const getAmount = (b: Booking) => b.total_amount || b.total_price || 0;

    // Group bookings by status for the tab counts
    const countByStatus = STATUS_TABS.reduce((acc, tab) => {
        acc[tab.key] = bookings.filter(b => b.status === tab.key).length;
        return acc;
    }, {} as Record<string, number>);

    if (bookings.length === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                    <h3 className="font-semibold text-lg mb-1">Nenhuma solicitação encontrada</h3>
                    <p className="text-muted-foreground text-sm">
                        Suas solicitações de serviço aparecerão aqui.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* Status summary chips */}
            <div className="flex gap-2 flex-wrap">
                {STATUS_TABS.filter(t => countByStatus[t.key] > 0).map(tab => {
                    const Icon = tab.icon;
                    return (
                        <span key={tab.key} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-muted border border-border">
                            <Icon className="w-3 h-3" />
                            {tab.label}: <strong>{countByStatus[tab.key]}</strong>
                        </span>
                    );
                })}
            </div>

            {/* Booking Cards - sorted by newest first, grouped visually by status priority */}
            {bookings.map((booking) => {
                const StatusIcon = getStatusIcon(booking.status);
                return (
                    <Card key={booking.id} className="overflow-hidden">
                        <CardHeader className="bg-muted/30 pb-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="outline" className={`font-medium flex items-center gap-1 text-xs ${getStatusBadgeClass(booking.status)}`}>
                                            <StatusIcon className="w-3 h-3" />
                                            {getStatusLabel(booking.status)}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                            #{booking.id.slice(0, 8)}
                                        </span>
                                    </div>
                                    <CardTitle className="text-base font-semibold">
                                        {getMachineName(booking)}
                                    </CardTitle>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Solicitado em {format(new Date(booking.created_at), "d 'de' MMMM, HH:mm", { locale: ptBR })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg text-primary">
                                        R$ {getAmount(booking).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 grid md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <User className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Prestador</p>
                                        <p className="text-sm text-foreground">{booking.owner?.full_name || 'Prestador'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Data do Serviço</p>
                                        <p className="text-sm text-foreground">
                                            {format(new Date(booking.start_date), "dd/MM/yyyy", { locale: ptBR })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col justify-end gap-2">
                                {/* Chat button */}
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => navigate(`/chat/${booking.owner_id}?booking=${booking.id}`)}
                                >
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Chat com Prestador
                                </Button>

                                {/* WhatsApp fallback */}
                                {booking.owner?.phone && (
                                    <Button
                                        variant="outline"
                                        className="w-full text-green-600 border-green-200 hover:bg-green-50"
                                        onClick={() => window.open(`https://wa.me/55${booking.owner!.phone!.replace(/\D/g, '')}`, '_blank')}
                                    >
                                        <span className="mr-2 text-base">📱</span>
                                        WhatsApp do Prestador
                                    </Button>
                                )}

                                {/* Pending info */}
                                {booking.status === 'pending' && (
                                    <div className="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md text-xs text-yellow-700">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        Aguardando resposta do prestador
                                    </div>
                                )}

                                {/* Confirmed info */}
                                {booking.status === 'confirmed' && (
                                    <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-700">
                                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                                        Serviço aprovado — aguardando execução
                                    </div>
                                )}

                                {/* Completed: Avaliar button */}
                                {booking.status === 'completed' && (
                                    <Button
                                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                                        onClick={() => navigate(`/avaliar/${booking.id}`)}
                                    >
                                        <Star className="w-4 h-4 mr-2" />
                                        Avaliar Serviço
                                    </Button>
                                )}

                                {/* Rejected info */}
                                {booking.status === 'rejected' && (
                                    <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-md text-xs text-red-700">
                                        <XCircle className="w-4 h-4 shrink-0" />
                                        Solicitação recusada pelo prestador
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};
