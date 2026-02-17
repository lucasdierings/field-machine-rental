import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MapPin, Star, Calendar, Ruler, Fuel, Settings, User, CheckCircle2, Share2, Heart, Handshake, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SEO } from "@/components/SEO";
import { MachineImageGallery } from "@/components/machines/MachineImageGallery";
import { MachineBookingForm } from "@/components/machines/MachineBookingForm";
import { MachineReviewsSection } from "@/components/machines/MachineReviewsSection";


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
        isVerified?: boolean;
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
    const { userId } = useAuth();
    const [selectedImage, setSelectedImage] = useState(0);
    const [startDate, setStartDate] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(1);
    const [notes, setNotes] = useState("");
    const [bookingLoading, setBookingLoading] = useState(false);

    // Load machine with useQuery
    const { data: machine, isLoading: machineLoading } = useQuery({
        queryKey: ['machine-details', id],
        queryFn: async () => {
            if (!id) return null;

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
                    .select('full_name, verified')
                    .eq('auth_user_id', machineData.owner_id)
                    .maybeSingle();

                if (profile) {
                    ownerData = {
                        full_name: profile.full_name,
                        avatar_url: "",
                        isVerified: profile.verified === true
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

            return {
                ...machineData,
                images: images.length > 0 ? images : [],
                owner: ownerData
            } as unknown as Machine;
        },
        enabled: !!id,
    });

    // Load reviews with useQuery
    const { data: reviews = [] } = useQuery({
        queryKey: ['machine-reviews', id],
        queryFn: async () => {
            if (!id) return [];

            const { data: reviewsData } = await supabase
                .from('reviews')
                .select(`
                    *,
                    booking:bookings!reviews_booking_id_fkey(machine_id)
                `)
                .order('created_at', { ascending: false })
                .limit(10);

            if (reviewsData) {
                return reviewsData.filter(
                    (r: any) => r.booking?.machine_id === id
                ) as unknown as Review[];
            }
            return [];
        },
        enabled: !!id,
    });

    if (machineLoading) {
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

        if (!userId) {
            toast({
                title: "Login necessário",
                description: "Faça login para solicitar.",
                variant: "destructive"
            });
            navigate('/login');
            return;
        }

        try {
            setBookingLoading(true);

            if (!machine.owner_id) {
                toast({
                    title: "Erro na máquina",
                    description: "Esta máquina não possui um proprietário vinculado corretamente. Entre em contato com o suporte.",
                    variant: "destructive"
                });
                return;
            }

            const { error } = await supabase
                .from('bookings')
                .insert({
                    machine_id: machine.id,
                    owner_id: machine.owner_id,
                    renter_id: userId,
                    start_date: startDate,
                    end_date: startDate,
                    quantity: quantity,
                    total_amount: total,
                    platform_fee: 0,
                    notes: notes,
                    status: 'pending',
                    payment_status: 'peer_to_peer',
                    price_type: unit,
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

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": machine.name,
        "image": machine.images && machine.images.length > 0 ? machine.images : ["https://fieldmachine.com.br/placeholder.jpg"],
        "description": machine.description || `Aluguel de ${machine.name} - ${machine.brand} ${machine.model}.`,
        "brand": {
            "@type": "Brand",
            "name": machine.brand
        },
        "model": machine.model,
        "offers": {
            "@type": "Offer",
            "url": window.location.href,
            "priceCurrency": "BRL",
            "price": price,
            "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
            "itemCondition": "https://schema.org/UsedCondition",
            "availability": "https://schema.org/InStock",
            "seller": {
                "@type": "Person",
                "name": machine.owner?.full_name || "Proprietário"
            }
        },
        "aggregateRating": reviews.length > 0 ? {
            "@type": "AggregateRating",
            "ratingValue": avgRating.toFixed(1),
            "reviewCount": reviews.length
        } : undefined
    };

    return (
        <div className="min-h-screen bg-background pb-16 md:pb-0">
            <SEO
                title={`${machine.name} - ${machine.location?.city || 'Brasil'}`}
                description={`${machine.category} ${machine.brand} ${machine.model} disponível para serviços. ${machine.description?.substring(0, 120)}...`}
                canonical={`/prestador/${machine.id}`}
                structuredData={jsonLd}
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

                <MachineImageGallery
                    images={machine.images}
                    machineName={machine.name}
                    selectedImage={selectedImage}
                    onSelectImage={setSelectedImage}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-12">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-6 md:space-y-8">
                        {/* Owner Info */}
                        <div className="flex items-center justify-between pb-6 border-b">
                            <div>
                                <h2 className="text-lg md:text-xl font-semibold mb-1 flex items-center gap-2">
                                    Oferecido por {machine.owner?.full_name || 'Proprietário'}
                                    {machine.owner?.isVerified ? (
                                        <Badge variant="default" className="gap-1 bg-green-600 hover:bg-green-700 text-xs">
                                            <CheckCircle2 className="h-3 w-3" />
                                            Verificado
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="gap-1 text-xs border-amber-300 text-amber-700 bg-amber-50">
                                            <AlertCircle className="h-3 w-3" />
                                            Não Verificado
                                        </Badge>
                                    )}
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
                                <CheckCircle2 className={`h-6 w-6 shrink-0 ${machine.owner?.isVerified ? 'text-green-600' : 'text-amber-500'}`} />
                                <div>
                                    <h3 className="font-medium">
                                        {machine.owner?.isVerified ? 'Prestador Verificado' : 'Prestador Não Verificado'}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {machine.owner?.isVerified
                                            ? 'Este prestador teve seus documentos verificados pela equipe FieldMachine.'
                                            : 'Este prestador ainda não enviou documentos para verificação. Proceda com cautela.'}
                                    </p>
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

                        <MachineReviewsSection reviews={reviews} avgRating={avgRating} />
                    </div>

                    {/* Right Column: Booking Card */}
                    <MachineBookingForm
                        price={price}
                        unit={unit}
                        startDate={startDate}
                        quantity={quantity}
                        notes={notes}
                        bookingLoading={bookingLoading}
                        onStartDateChange={setStartDate}
                        onQuantityChange={setQuantity}
                        onNotesChange={setNotes}
                        onBooking={handleBooking}
                    />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default MachineDetails;
