import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle, Calendar, User, Truck, DollarSign } from "lucide-react";

interface Booking {
    id: string;
    created_at: string;
    start_date: string;
    end_date: string;
    status: string;
    total_amount: number;
    quantity: number;
    notes?: string;
    machine: {
        name: string;
        category: string;
        images?: string[];
    };
    renter: {
        full_name: string;
        phone?: string;
        avatar_url?: string;
    };
}

interface BookingRequestsListProps {
    bookings: Booking[];
    onUpdate: () => void;
}

export const BookingRequestsList = ({ bookings, onUpdate }: BookingRequestsListProps) => {
    const { toast } = useToast();
    const [processingId, setProcessingId] = useState<string | null>(null);

    const handleAction = async (bookingId: string, action: 'confirm' | 'reject') => {
        setProcessingId(bookingId);
        try {
            const status = action === 'confirm' ? 'confirmed' : 'rejected';

            const { error } = await supabase
                .from('bookings')
                .update({ status })
                .eq('id', bookingId);

            if (error) throw error;

            toast({
                title: action === 'confirm' ? "Solicitação Aceita!" : "Solicitação Rejeitada",
                description: action === 'confirm'
                    ? "Entre em contato com o locatário para combinar os detalhes."
                    : "O locatário será notificado.",
                variant: action === 'confirm' ? "default" : "destructive"
            });

            onUpdate();
        } catch (error: any) {
            toast({
                title: "Erro ao processar",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setProcessingId(null);
        }
    };

    if (bookings.length === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                    <h3 className="font-semibold text-lg mb-1">Nenhuma solicitação pendente</h3>
                    <p className="text-muted-foreground text-sm">
                        Quando alguém solicitar suas máquinas, os pedidos aparecerão aqui.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {bookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    {booking.machine.name}
                                    <Badge variant="outline" className="font-normal text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                                        Pendente
                                    </Badge>
                                </CardTitle>
                                <CardDescription className="text-xs mt-1">
                                    Solicitado em {format(new Date(booking.created_at), "d 'de' MMMM, HH:mm", { locale: ptBR })}
                                </CardDescription>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-lg text-primary">
                                    R$ {booking.total_amount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                                        {booking.start_date !== booking.end_date &&
                                            ` até ${format(new Date(booking.end_date), "dd/MM/yyyy", { locale: ptBR })}`
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Truck className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Qtd / Área</p>
                                    <p className="text-sm text-foreground">{booking.quantity} (unidades/hectares/dias)</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-between gap-4">
                            {booking.notes && (
                                <div className="bg-muted/50 p-3 rounded-md text-sm italic text-muted-foreground">
                                    "{booking.notes}"
                                </div>
                            )}

                            <div className="flex gap-3 justify-end mt-auto pt-2">
                                <Button
                                    variant="outline"
                                    className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                                    onClick={() => handleAction(booking.id, 'reject')}
                                    disabled={!!processingId}
                                >
                                    {processingId === booking.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
                                    Rejeitar
                                </Button>
                                <Button
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => handleAction(booking.id, 'confirm')}
                                    disabled={!!processingId}
                                >
                                    {processingId === booking.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                                    Aceitar Proposta
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
