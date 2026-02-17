import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, MessageCircle, Clock, CheckCircle2, XCircle } from "lucide-react";

interface Booking {
    id: string;
    created_at: string;
    start_date: string;
    end_date: string;
    status: string;
    total_amount: number;
    quantity: number;
    machine: {
        name: string;
        category: string;
    };
    owner: {
        full_name: string;
        phone?: string;
    };
}

interface RenterBookingsListProps {
    bookings: Booking[];
}

export const RenterBookingsList = ({ bookings }: RenterBookingsListProps) => {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'pending':
                return { label: 'Aguardando Aprovação', class: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock };
            case 'confirmed':
                return { label: 'Aprovado', class: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle2 };
            case 'rejected':
                return { label: 'Recusado', class: 'bg-red-100 text-red-700 border-red-200', icon: XCircle };
            default:
                return { label: status, class: 'bg-gray-100 text-gray-700 border-gray-200', icon: Clock };
        }
    };

    if (bookings.length === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                    <h3 className="font-semibold text-lg mb-1">Nenhuma solicitação encontrada</h3>
                    <p className="text-muted-foreground text-sm">
                        Suas solicitações de aluguel aparecerão aqui.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {bookings.map((booking) => {
                const status = getStatusConfig(booking.status);
                const StatusIcon = status.icon;
                return (
                    <Card key={booking.id} className="overflow-hidden">
                        <CardHeader className="bg-muted/30 pb-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="outline" className={`font-medium flex items-center gap-1 ${status.class}`}>
                                            <StatusIcon className="w-3 h-3" />
                                            {status.label}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                            #{booking.id.slice(0, 8)}
                                        </span>
                                    </div>
                                    <CardTitle className="text-base font-semibold">
                                        {booking.machine.name}
                                    </CardTitle>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg text-primary">
                                        R$ {booking.total_amount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 grid md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <User className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Proprietário</p>
                                        <p className="text-sm text-foreground">{booking.owner?.full_name || 'Proprietário'}</p>
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
                                {booking.owner?.phone && (
                                    <Button
                                        variant="outline"
                                        className="w-full text-green-600 border-green-200 hover:bg-green-50"
                                        onClick={() => window.open(`https://wa.me/55${booking.owner.phone?.replace(/\D/g, '')}`, '_blank')}
                                    >
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        Conversar com Proprietário
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};
