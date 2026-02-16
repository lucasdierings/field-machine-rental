import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { ReviewForm } from "@/components/ui/review-form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Tractor, Calendar, Star } from "lucide-react";

interface Booking {
    id: string;
    machine_id: string;
    renter_id: string;
    owner_id: string;
    start_date: string;
    end_date: string;
    total_amount: number;
    status: string;
    machine?: {
        name: string;
        category: string;
        brand: string;
    };
    renter?: {
        full_name: string;
    };
    owner?: {
        full_name: string;
    };
}

const ReviewBooking = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [alreadyReviewed, setAlreadyReviewed] = useState(false);

    useEffect(() => {
        loadBooking();
    }, [bookingId]);

    const loadBooking = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/login');
                return;
            }
            setCurrentUserId(user.id);

            if (!bookingId) return;

            const { data: bookingData, error } = await supabase
                .from('bookings' as any)
                .select(`
                    *,
                    machines(name, category, brand),
                    renter:user_profiles!bookings_renter_id_fkey(full_name),
                    owner:user_profiles!bookings_owner_id_fkey(full_name)
                `)
                .eq('id', bookingId)
                .single();

            if (error) throw error;

            setBooking(bookingData as any);

            // Check if user already reviewed this booking
            const { data: existingReview } = await supabase
                .from('reviews')
                .select('id')
                .eq('booking_id', bookingId)
                .eq('reviewer_id', user.id)
                .maybeSingle();

            if (existingReview) {
                setAlreadyReviewed(true);
            }
        } catch (error: any) {
            console.error("Erro ao carregar reserva:", error);
            toast({
                title: "Erro",
                description: "Não foi possível carregar os detalhes da reserva.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!booking || !currentUserId) return null;

    const isRenter = currentUserId === booking.renter_id;
    const isOwner = currentUserId === booking.owner_id;
    const reviewType = isOwner ? "owner_reviews_client" as const : "client_reviews_owner" as const;
    const reviewedId = isOwner ? booking.renter_id : booking.owner_id;

    const machineName = (booking as any).machines?.name || "Máquina";
    const machineCategory = (booking as any).machines?.category || "";

    return (
        <div className="min-h-screen bg-background pb-16 md:pb-0">
            <Header />

            <main className="pt-20 md:pt-24 pb-16 container mx-auto px-4 max-w-2xl">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                    Avaliar {isOwner ? "Cliente" : "Serviço"}
                </h1>

                {/* Booking Summary */}
                <Card className="mb-6">
                    <CardContent className="p-4 md:p-5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <Tractor className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm md:text-base truncate">{machineName}</h3>
                                <p className="text-xs text-muted-foreground">{machineCategory}</p>
                                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {new Date(booking.start_date).toLocaleDateString('pt-BR')}
                                    </span>
                                    <Badge variant="outline" className="text-xs">
                                        {booking.status === 'completed' ? 'Concluído' : booking.status}
                                    </Badge>
                                </div>
                            </div>
                            {booking.total_amount > 0 && (
                                <div className="text-right shrink-0">
                                    <p className="font-bold text-sm">
                                        R$ {Number(booking.total_amount).toLocaleString('pt-BR')}
                                    </p>
                                    <p className="text-xs text-muted-foreground">valor ref.</p>
                                </div>
                            )}
                        </div>

                        {/* Who are you reviewing */}
                        <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
                            {isOwner ? (
                                <p>Avaliando o cliente: <strong className="text-foreground">{(booking as any).renter?.full_name || "Cliente"}</strong></p>
                            ) : (
                                <p>Avaliando o prestador: <strong className="text-foreground">{(booking as any).owner?.full_name || "Prestador"}</strong></p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Review Form or Already Reviewed */}
                {alreadyReviewed ? (
                    <Card>
                        <CardContent className="p-6 md:p-8 text-center">
                            <Star className="h-12 w-12 text-primary mx-auto mb-4" />
                            <h2 className="text-xl font-semibold mb-2">Avaliação já enviada</h2>
                            <p className="text-muted-foreground mb-4">
                                Você já avaliou esta reserva. Obrigado pelo seu feedback!
                            </p>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="text-primary hover:underline text-sm font-medium"
                            >
                                Voltar ao Dashboard
                            </button>
                        </CardContent>
                    </Card>
                ) : (
                    <ReviewForm
                        bookingId={booking.id}
                        reviewedId={reviewedId}
                        reviewType={reviewType}
                        onSuccess={() => {
                            setTimeout(() => navigate('/dashboard'), 1500);
                        }}
                    />
                )}
            </main>
            <Footer />
        </div>
    );
};

export default ReviewBooking;
