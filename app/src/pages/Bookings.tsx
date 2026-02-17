import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, FileText, Calendar, Clock } from "lucide-react";
import { BookingRequestsList } from "@/components/booking/BookingRequestsList";

const Bookings = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [bookings, setBookings] = useState<any[]>([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        loadUserAndBookings();
    }, [refreshTrigger]);

    const loadUserAndBookings = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                navigate("/login");
                return;
            }

            setUser(user);

            // Fetch bookings where user is either renter or owner
            const { data: bookingsData, error } = await supabase
                .from('bookings')
                .select(`
          *,
          machines (
            name,
            category,
            brand
          ),
          renter:user_profiles!renter_id (
            full_name,
            phone,
            avatar_url
          )
        `)
                .or(`renter_id.eq.${user.id},owner_id.eq.${user.id}`)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setBookings(bookingsData || []);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            // Don't redirect on error, just log it
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    // Filter bookings based on active tab logic passed to components
    const getFilteredBookings = (status?: string) => {
        if (!status || status === 'all') return bookings;
        if (status === 'pending') return bookings.filter(b => b.status === 'pending');
        if (status === 'confirmed') return bookings.filter(b => b.status === 'confirmed');
        if (status === 'completed') return bookings.filter(b => b.status === 'completed');
        return bookings;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-20 pb-16">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <FileText className="h-8 w-8 text-primary" />
                            Minhas Solicitações
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Gerencie suas solicitações de serviço como proprietário e locatário
                        </p>
                    </div>

                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="grid w-full grid-cols-4 mb-6">
                            <TabsTrigger value="all" className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Todas
                            </TabsTrigger>
                            <TabsTrigger value="pending" className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Pendentes
                            </TabsTrigger>
                            <TabsTrigger value="confirmed" className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Confirmadas
                            </TabsTrigger>
                            <TabsTrigger value="completed" className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Concluídas
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="all">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Todas as Solicitações</CardTitle>
                                    <CardDescription>
                                        Visualize todas as suas solicitações de serviço
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <BookingRequestsList
                                        bookings={bookings}
                                        onUpdate={handleUpdate}
                                        currentUserId={user?.id}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="pending">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Solicitações Pendentes</CardTitle>
                                    <CardDescription>
                                        Solicitações aguardando aprovação ou resposta
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <BookingRequestsList
                                        bookings={getFilteredBookings('pending')}
                                        onUpdate={handleUpdate}
                                        currentUserId={user?.id}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="confirmed">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Solicitações Confirmadas</CardTitle>
                                    <CardDescription>
                                        Serviços agendados e confirmados
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <BookingRequestsList
                                        bookings={getFilteredBookings('confirmed')}
                                        onUpdate={handleUpdate}
                                        currentUserId={user?.id}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="completed">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Solicitações Concluídas</CardTitle>
                                    <CardDescription>
                                        Histórico de serviços realizados
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <BookingRequestsList
                                        bookings={getFilteredBookings('completed')}
                                        onUpdate={handleUpdate}
                                        currentUserId={user?.id}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Bookings;
