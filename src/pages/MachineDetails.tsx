import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MapPin, Star, Calendar, Ruler, Fuel, Settings, User, CheckCircle2, Share2, Heart, Handshake, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ReviewCard } from "@/components/ui/review-card";
import { SEO } from "@/components/SEO";

interface Machine {
    id: string;
    name: string;
    category: string;
    brand: string;
    model: string;
    year: number;
    price_day: number | null;
    price_hour: number | null;
    price_hectare: number | null;
    location: any;
    images: string[];
    description: string;
    specifications: any;
    owner_id: string;
    operator_type?: string;
    owner?: {
        full_name: string;
        avatar_url: string;
    };
}

interface Review {
    id: string;
    rating: number;
    service_rating: number | null;
    operator_rating: number | null;
    machine_rating: number | null;
    client_rating: number | null;
    comment: string | null;
    observations: string | null;
    review_type: string;
    created_at: string;
    reviewer?: {
        full_name: string;
    };
}

const MachineDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [machine, setMachine] = useState<Machine | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [startDate, setStartDate] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(1);
    const [notes, setNotes] = useState("");
    const [bookingLoading, setBookingLoading] = useState(false);


    useEffect(() => {
        loadMachine();
        loadReviews();
    }, [id]);

    const loadMachine = async () => {
        try {
            if (!id) return;

            const { data: machineData, error: machineError } = await supabase
                .from('machines')
                .select('*')
                .eq('id', id)
                .single();

            if (machineError) throw machineError;

            let ownerData = null;
            if (machineData.owner_id) {
                const { data: profile } = await supabase
                    .from('user_profiles')
                    .select('full_name')
                    .eq('auth_user_id', machineData.owner_id)
                    .maybeSingle();

                if (profile) {
                    ownerData = {
                        full_name: profile.full_name,
                        avatar_url: ""
                    };
                }
            }

            // Load images from machine_images table
            const { data: machineImages } = await supabase
                .from('machine_images')
                .select('image_url')
                .eq('machine_id', id)
                .order('order_index');

            const images = machineImages?.map(img => img.image_url) || [];

            // Retrieve operator info if needed or just use what we have
            // ...

            setMachine({
                ...machineData,
                images: images.length > 0 ? images : [],
                owner: ownerData
            } as any);
        } catch (error: any) {
            console.error("Erro ao carregar máquina:", error);
            toast({
                title: "Erro ao carregar",
                description: "Não foi possível carregar os detalhes da máquina.",
                variant: "destructive"
            });
            navigate('/servicos-agricolas');
        } finally {
            setLoading(false);
        }
    };

    const loadReviews = async () => {
        try {
            if (!id) return;

            // Load reviews for bookings related to this machine
            const { data: reviewsData } = await supabase
                .from('reviews')
                .select(`
                    *,
                    booking:bookings!reviews_booking_id_fkey(machine_id)
                `)
                .order('created_at', { ascending: false })
                .limit(10);

            if (reviewsData) {
                // Filter reviews for this machine's bookings
                const machineReviews = reviewsData.filter(
                    (r: any) => r.booking?.machine_id === id
                );
                setReviews(machineReviews as any[]);
            }
        } catch (error) {
            console.error("Erro ao carregar avaliações:", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!machine) return null;

    const price = machine.price_hour || machine.price_hectare || machine.price_day || 0;
    const unit = machine.price_hour ? 'hora' : machine.price_hectare ? 'hectare' : 'dia';
    const total = price * quantity;

    const avgRating = reviews.length > 0
        ? reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length
        : 0;
    const handleBooking = async () => {
        if (!startDate) {
            toast({
                title: "Data obrigatória",
                description: "Selecione uma data de início.",
                variant: "destructive"
            });
            return;
        }

        try {
            setBookingLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast({
                    title: "Login necessário",
                    description: "Faça login para solicitar.",
                    variant: "destructive"
                });
                navigate('/login');
                return;
            }

            const { error } = await supabase
                .from('bookings')
                .insert({
                    machine_id: machine.id,
                    owner_id: machine.owner_id, // Add owner_id
                    renter_id: user.id,
                    start_date: startDate,
                    end_date: startDate,
                    quantity: quantity,
                    total_amount: total,
                    platform_fee: 0,
                    notes: notes,
                    status: 'pending',
                    payment_status: 'peer_to_peer'
                });

            if (error) throw error;

            toast({
                title: "Solicitação enviada!",
                description: "O proprietário será notificado. Vocês combinarão os detalhes e o pagamento diretamente.",
            });

            navigate('/dashboard');

        } catch (error: any) {
            toast({
                title: "Erro na solicitação",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setBookingLoading(false);
        }
    };

    const mainImage = machine.images && machine.images.length > 0
        ? machine.images[selectedImage]
        : "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=600&fit=crop";

    return (
        <div className="min-h-screen bg-background pb-16 md:pb-0">
            <SEO
                title={`${machine.name} - ${machine.location?.city || 'Brasil'}`}
                description={`${machine.category} ${machine.brand} ${machine.model} disponível para serviços. ${machine.description?.substring(0, 120)}...`}
                canonical={`/prestador/${machine.id}`}
            />
            <Header />

            <main className="pt-20 md:pt-24 pb-16 container mx-auto px-4">
                {/* Header Section */}
                <div className="mb-4 md:mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">{machine.name}</h1>
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-primary text-primary" />
                            <span className="font-medium text-foreground">
                                {avgRating > 0 ? avgRating.toFixed(1) : 'Novo'}
                            </span>
                            <span>({reviews.length} avaliações)</span>
                        </div>
                        <span className="hidden sm:inline">•</span>
                        <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {typeof machine.location === 'object' && machine.location?.city
                                ? `${machine.location.city}, ${machine.location.state}`
                                : 'Localização não informada'}
                        </div>
                        <div className="ml-auto flex gap-2">
                            <Button variant="ghost" size="sm" className="gap-1 md:gap-2 h-8 md:h-9">
                                <Share2 className="h-4 w-4" />
                                <span className="hidden sm:inline">Compartilhar</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-1 md:gap-2 h-8 md:h-9">
                                <Heart className="h-4 w-4" />
                                <span className="hidden sm:inline">Salvar</span>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Image Gallery */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 mb-6 md:mb-8 h-[250px] sm:h-[350px] md:h-[500px]">
                    <div className="md:col-span-3 h-full relative group">
                        <img
                            src={mainImage}
                            alt={machine.name}
                            className="w-full h-full object-cover rounded-xl md:rounded-l-xl md:rounded-r-none cursor-pointer"
                        />
                    </div>
                    <div className="hidden md:flex flex-col gap-4 h-full">
                        {machine.images && machine.images.slice(0, 2).map((img, idx) => (
                            <div key={idx} className="flex-1 relative cursor-pointer" onClick={() => setSelectedImage(idx)}>
                                <img
                                    src={img}
                                    alt={`${machine.name} ${idx + 1}`}
                                    className={`w-full h-full object-cover ${idx === 0 ? 'rounded-tr-xl' : 'rounded-br-xl'} hover:opacity-90 transition-opacity`}
                                />
                            </div>
                        ))}
                        {(!machine.images || machine.images.length < 2) && (
                            <div className="flex-1 bg-muted rounded-r-xl flex items-center justify-center text-muted-foreground">
                                <span className="text-sm">Sem mais fotos</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile image thumbnails */}
                {machine.images && machine.images.length > 1 && (
                    <div className="flex md:hidden gap-2 mb-6 overflow-x-auto pb-2">
                        {machine.images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedImage(idx)}
                                className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${selectedImage === idx ? 'border-primary' : 'border-transparent'
                                    }`}
                            >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-12">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-6 md:space-y-8">
                        {/* Owner Info */}
                        <div className="flex items-center justify-between pb-6 border-b">
                            <div>
                                <h2 className="text-lg md:text-xl font-semibold mb-1">
                                    Oferecido por {machine.owner?.full_name || 'Proprietário'}
                                </h2>
                                <p className="text-sm md:text-base text-muted-foreground">
                                    {machine.brand} • {machine.model} • {machine.year}
                                </p>
                            </div>
                            <Avatar className="h-10 w-10 md:h-12 md:w-12">
                                <AvatarImage src={machine.owner?.avatar_url} />
                                <AvatarFallback>{machine.owner?.full_name?.[0] || 'U'}</AvatarFallback>
                            </Avatar>
                        </div>

                        {/* Highlights */}
                        <div className="space-y-4 pb-6 border-b">
                            <div className="flex gap-4">
                                <Handshake className="h-6 w-6 text-primary shrink-0" />
                                <div>
                                    <h3 className="font-medium">Pagamento Direto</h3>
                                    <p className="text-sm text-muted-foreground">
                                        O valor é combinado entre vocês. Sem intermediários, sem taxas da plataforma.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                                <div>
                                    <h3 className="font-medium">Máquina Verificada</h3>
                                    <p className="text-sm text-muted-foreground">Este equipamento passou pela verificação de qualidade da plataforma.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <User className="h-6 w-6 text-primary shrink-0" />
                                <div>
                                    <h3 className="font-medium">Operador {machine.operator_type === 'hired' ? 'Contratado' : 'Próprio'}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {machine.operator_type === 'hired'
                                            ? 'O serviço é realizado por um operador contratado pelo proprietário.'
                                            : 'O próprio dono ou sua equipe realiza o serviço.'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Star className="h-6 w-6 text-primary shrink-0" />
                                <div>
                                    <h3 className="font-medium">Avaliações Completas</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Após o serviço, ambas as partes avaliam: serviço, operador, máquina e cliente.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="pb-6 border-b">
                            <h2 className="text-lg md:text-xl font-semibold mb-4">Sobre este equipamento</h2>
                            <p className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                                {machine.description || "Sem descrição detalhada."}
                            </p>
                        </div>

                        {/* Specifications */}
                        <div className="pb-6 border-b">
                            <h2 className="text-lg md:text-xl font-semibold mb-4">Especificações Técnicas</h2>
                            <div className="grid grid-cols-2 gap-3 md:gap-4">
                                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                    <Settings className="h-5 w-5 text-primary shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-xs text-muted-foreground">Potência</p>
                                        <p className="font-medium text-sm md:text-base truncate">{(machine.specifications as any)?.power || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                    <Ruler className="h-5 w-5 text-primary shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-xs text-muted-foreground">Largura de Trabalho</p>
                                        <p className="font-medium text-sm md:text-base truncate">{(machine.specifications as any)?.workWidth || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                    <Fuel className="h-5 w-5 text-primary shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-xs text-muted-foreground">Combustível</p>
                                        <p className="font-medium text-sm md:text-base">Diesel</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                    <Calendar className="h-5 w-5 text-primary shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-xs text-muted-foreground">Ano</p>
                                        <p className="font-medium text-sm md:text-base">{machine.year}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="pb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                                    <Star className="h-5 w-5 text-primary" />
                                    Avaliações
                                    {reviews.length > 0 && (
                                        <Badge variant="secondary" className="ml-2">
                                            {avgRating.toFixed(1)} ({reviews.length})
                                        </Badge>
                                    )}
                                </h2>
                            </div>

                            {reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {reviews.map((review) => (
                                        <ReviewCard key={review.id} review={review} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-muted/20 rounded-xl">
                                    <Star className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                                    <p className="text-muted-foreground font-medium">Ainda sem avaliações</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        As avaliações aparecerão após os primeiros serviços realizados.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Booking Card */}
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
                                            onChange={(e) => setStartDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="border rounded-lg p-3">
                                        <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Qtd ({unit}s)</p>
                                        <input
                                            type="number"
                                            min="1"
                                            className="w-full text-sm bg-transparent outline-none"
                                            value={quantity}
                                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                        />
                                    </div>
                                </div>

                                <div className="border rounded-lg p-3">
                                    <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Detalhes do Serviço / Proposta</p>
                                    <textarea
                                        className="w-full text-sm bg-transparent outline-none resize-none h-20"
                                        placeholder="Descreva o local, tipo de serviço ou faça uma proposta de valor..."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </div>

                                <Button
                                    className="w-full bg-gradient-primary h-12 text-base md:text-lg font-semibold"
                                    onClick={handleBooking}
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
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default MachineDetails;
