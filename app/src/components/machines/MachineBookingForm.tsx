import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, MessageCircle, Handshake } from "lucide-react";

interface MachineBookingFormProps {
    price: number;
    unit: string;
    startDate: string;
    quantity: number;
    notes: string;
    bookingLoading: boolean;
    onStartDateChange: (date: string) => void;
    onQuantityChange: (qty: number) => void;
    onNotesChange: (notes: string) => void;
    onBooking: () => void;
}

export function MachineBookingForm({
    price,
    unit,
    startDate,
    quantity,
    notes,
    bookingLoading,
    onStartDateChange,
    onQuantityChange,
    onNotesChange,
    onBooking,
}: MachineBookingFormProps) {
    const total = price * quantity;

    return (
        <div className="relative">
            <Card className="sticky top-24 shadow-lg border-primary/20">
                <CardHeader className="pb-3">
                    <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-bold">
                            R$ {price.toLocaleString('pt-BR')}
                        </span>
                        <span className="text-muted-foreground">
                            / {unit}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs gap-1 border-green-200 text-green-700 bg-green-50">
                            <Handshake className="h-3 w-3" />
                            Pagamento direto
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="border rounded-lg p-3">
                            <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Início</p>
                            <input
                                type="date"
                                className="w-full text-sm bg-transparent outline-none"
                                value={startDate}
                                onChange={(e) => onStartDateChange(e.target.value)}
                            />
                        </div>
                        <div className="border rounded-lg p-3">
                            <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Qtd ({unit}s)</p>
                            <input
                                type="number"
                                min="1"
                                className="w-full text-sm bg-transparent outline-none"
                                value={quantity}
                                onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
                            />
                        </div>
                    </div>

                    <div className="border rounded-lg p-3">
                        <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Detalhes do Serviço / Proposta</p>
                        <textarea
                            className="w-full text-sm bg-transparent outline-none resize-none h-20"
                            placeholder="Descreva o local, tipo de serviço ou faça uma proposta de valor..."
                            value={notes}
                            onChange={(e) => onNotesChange(e.target.value)}
                        />
                    </div>

                    <Button
                        className="w-full bg-gradient-primary h-12 text-base md:text-lg font-semibold"
                        onClick={onBooking}
                        disabled={bookingLoading}
                    >
                        {bookingLoading ? (
                            <Loader2 className="animate-spin mr-2" />
                        ) : (
                            <MessageCircle className="mr-2 h-5 w-5" />
                        )}
                        Solicitar Serviço
                    </Button>

                    <div className="bg-muted/30 rounded-lg p-3 text-center">
                        <p className="text-xs text-muted-foreground">
                            <Handshake className="h-3.5 w-3.5 inline mr-1" />
                            O valor é referência. Vocês combinarão o preço final
                            e a forma de pagamento diretamente.
                        </p>
                    </div>

                    <div className="space-y-2 pt-2">
                        <div className="flex justify-between text-sm">
                            <span className="underline">R$ {price.toLocaleString('pt-BR')} x {quantity} {unit}s</span>
                            <span>R$ {(price * quantity).toLocaleString('pt-BR')}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold pt-2">
                            <span>Valor de Referência</span>
                            <span>R$ {total.toLocaleString('pt-BR')}</span>
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                            Sem taxas da plataforma
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
