import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, FileText, Calendar, Clock } from "lucide-react";
import { BookingRequestsList } from "@/components/booking/BookingRequestsList";

const Bookings = () => {
    const queryClient = useQueryClient();
    const { userId } = useAuth();

    const { data: bookings = [], isLoading } = useQuery({
        queryKey: ['bookings', userId],
        queryFn: async () => {
            // Step 1: Fetch bookings
            const { data: rawBookings, error } = await supabase
                .from('bookings')
                .select(`
          *,
          machines (
            name,
            category,
            brand
          )
        `)
                .or(`renter_id.eq.${userId},owner_id.eq.${userId}`)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Step 2: Fetch profiles for all unique user IDs
            const bookingsList = rawBookings || [];
            const userIds = [...new Set([
                ...bookingsList.map((b: any) => b.renter_id),
                ...bookingsList.map((b: any) => b.owner_id),
            ].filter(Boolean))];

            let profileMap: Record<string, { full_name: string; phone?: string; avatar_url?: string; verified?: boolean }> = {};
            if (userIds.length > 0) {
                const { data: profiles } = await supabase
                    .from('user_profiles')
                    .select('auth_user_id, full_name, phone, avatar_url, verified')
                    .in('auth_user_id', userIds);
                profileMap = Object.fromEntries((profiles || []).map((p: any) => [p.auth_user_id, p]));
            }

            // Step 3: Merge profiles into bookings
            return bookingsList.map((b: any) => ({
                ...b,
                renter: profileMap[b.renter_id] || null,
                owner: profileMap[b.owner_id] || null,
            }));
        },
        enabled: !!userId,
    });

    const handleUpdate = () => {
        queryClient.invalidateQueries({ queryKey: ['bookings', userId] });
    };

    // Filter bookings based on active tab logic passed to components
    const filteredBookings = useMemo(() => ({
        all: bookings,
        pending: bookings.filter((b: any) => b.status === 'pending'),
        confirmed: bookings.filter((b: any) => b.status === 'confirmed'),
        completed: bookings.filter((b: any) => b.status === 'completed'),
    }), [bookings]);

    if (isLoading) {
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
                                        bookings={filteredBookings.all}
                                        onUpdate={handleUpdate}
                                        currentUserId={userId}
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
                                        bookings={filteredBookings.pending}
                                        onUpdate={handleUpdate}
                                        currentUserId={userId}
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
                                        bookings={filteredBookings.confirmed}
                                        onUpdate={handleUpdate}
                                        currentUserId={userId}
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
                                        bookings={filteredBookings.completed}
                                        onUpdate={handleUpdate}
                                        currentUserId={userId}
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
