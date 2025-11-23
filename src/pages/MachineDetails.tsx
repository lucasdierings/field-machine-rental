import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MapPin, Star, Calendar, Ruler, Fuel, Settings, User, CheckCircle2, Share2, Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    owner?: {
        full_name: string;
        avatar_url: string;
    };
}

const MachineDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [machine, setMachine] = useState<Machine | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [startDate, setStartDate] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(1);
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        loadMachine();
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
                        avatar_url: "" // user_profiles doesn't have avatar_url yet
                    };
                }
            }

            setMachine({
                ...machineData,
                owner: ownerData
            } as any);
        } catch (error: any) {
            console.error("Erro ao carregar máquina:", error);
            toast({
                title: "Erro ao carregar",
                description: "Não foi possível carregar os detalhes da máquina.",
                variant: "destructive"
            });
            navigate('/buscar');
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

    if (!machine) return null;

    // Calcular total
    const price = machine.price_hour || machine.price_hectare || machine.price_day || 0;
    const unit = machine.price_hour ? 'hora' : machine.price_hectare ? 'hectare' : 'dia';
    const total = price * quantity;
    const platformFee = total * 0.01; // 1% taxa (interno)

    const [notes, setNotes] = useState("");

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
                    description: "Faça login para reservar.",
                    variant: "destructive"
                });
                navigate('/login');
                return;
            }

            const { error } = await supabase
                .from('bookings')
                .insert({
                    machine_id: machine.id,
                    renter_id: user.id,
                    start_date: startDate,
                    end_date: startDate,
                    quantity: quantity,
                    total_amount: total,
                    platform_fee: platformFee,
                    notes: notes,
                    status: 'pending'
                });

            if (error) throw error;

            toast({
                title: "Reserva solicitada!",
                description: "O proprietário será notificado.",
            });

            navigate('/dashboard');

        } catch (error: any) {
            toast({
                title: "Erro na reserva",
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
        <div className="min-h-screen bg-background">
            <Header />

            <main className="pt-24 pb-16 container mx-auto px-4">
                {/* ... (Header and Gallery remain same) ... */}
                {/* Header Section */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">{machine.name}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-primary text-primary" />
                            <span className="font-medium text-foreground">Novo</span>
                            <span>(0 avaliações)</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {typeof machine.location === 'object' && machine.location?.city
                                ? `${machine.location.city}, ${machine.location.state}`
                                : 'Localização não informada'}
                        </div>
                        <div className="ml-auto flex gap-2">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <Share2 className="h-4 w-4" />
                                Compartilhar
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-2">
                                <Heart className="h-4 w-4" />
                                Salvar
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Image Gallery */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 h-[400px] md:h-[500px]">
                    <div className="md:col-span-3 h-full relative group">
                        <img
                            src={mainImage}
                            alt={machine.name}
                            className="w-full h-full object-cover rounded-l-xl cursor-pointer"
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Left Column: Details */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Owner Info */}
                        <div className="flex items-center justify-between pb-6 border-b">
                            <div>
                                <h2 className="text-xl font-semibold mb-1">
                                    Oferecido por {machine.owner?.full_name || 'Proprietário'}
                                </h2>
                                <p className="text-muted-foreground">
                                    {machine.brand} • {machine.model} • {machine.year}
                                </p>
                            </div>
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={machine.owner?.avatar_url} />
                                <AvatarFallback>{machine.owner?.full_name?.[0] || 'U'}</AvatarFallback>
                            </Avatar>
                        </div>

                        {/* Highlights */}
                        <div className="space-y-4 pb-6 border-b">
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
                                    <h3 className="font-medium">Operador Incluso</h3>
                                    <p className="text-sm text-muted-foreground">O proprietário disponibiliza operador para o serviço.</p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="pb-6 border-b">
                            <h2 className="text-xl font-semibold mb-4">Sobre este equipamento</h2>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                {machine.description || "Sem descrição detalhada."}
                            </p>
                        </div>

                        {/* Specifications */}
                        <div className="pb-6 border-b">
                            <h2 className="text-xl font-semibold mb-4">Especificações Técnicas</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                    <Settings className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Potência</p>
                                        <p className="font-medium">{(machine.specifications as any)?.power || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                    <Ruler className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Largura de Trabalho</p>
                                        <p className="font-medium">{(machine.specifications as any)?.workWidth || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                    <Fuel className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Combustível</p>
                                        <p className="font-medium">Diesel</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Ano</p>
                                        <p className="font-medium">{machine.year}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Booking Card */}
                    <div className="relative">
                        <Card className="sticky top-24 shadow-lg border-primary/20">
                            <CardHeader>
                                <div className="flex items-baseline justify-between">
                                    <span className="text-2xl font-bold">
                                        R$ {price.toLocaleString('pt-BR')}
                                    </span>
                                    <span className="text-muted-foreground">
                                        / {unit}
                                    </span>
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
                                        placeholder="Descreva o local, tipo de serviço ou faça uma proposta..."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </div>

                                <Button
                                    className="w-full bg-gradient-primary h-12 text-lg font-semibold"
                                    onClick={handleBooking}
                                    disabled={bookingLoading}
                                >
                                    {bookingLoading ? <Loader2 className="animate-spin mr-2" /> : "Solicitar Reserva"}
                                </Button>

                                <p className="text-center text-xs text-muted-foreground">
                                    Você não será cobrado ainda. O proprietário confirmará a disponibilidade e valores finais.
                                </p>

                                <div className="space-y-2 pt-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="underline">R$ {price.toLocaleString('pt-BR')} x {quantity} {unit}s</span>
                                        <span>R$ {(price * quantity).toLocaleString('pt-BR')}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-bold pt-2">
                                        <span>Total Estimado</span>
                                        <span>R$ {total.toLocaleString('pt-BR')}</span>
                                    </div>
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
