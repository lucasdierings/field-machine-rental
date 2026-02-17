import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, TrendingUp, Tractor, ShoppingCart, BarChart3, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookingRequestsList } from "@/components/booking/BookingRequestsList";
import { RenterBookingsList } from "@/components/booking/RenterBookingsList";

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userMachines, setUserMachines] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [metrics, setMetrics] = useState({
    monthlyRevenue: 0,
    revenueChange: 0,
    occupancyRate: 0,
    occupancyChange: 0,
    activeMachines: 0,
    pendingRequests: 0,
    monthlyEarnings: 0,
    upcomingReservations: 0
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      setUser(user);

      // Load user profile
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("auth_user_id", user.id)
        .single();

      setUserProfile(profile);

      // Load user machines
      const { data: machines } = await supabase
        .from("machines")
        .select("*, machine_images(image_url)")
        .eq("owner_id", user.id);

      const machinesList = machines || [];
      setUserMachines(machinesList);

      // Step 1: Load bookings (no user_profiles join — FK points to auth.users, not user_profiles)
      const { data: userBookings } = await supabase
        .from("bookings" as any)
        .select("*, machines(name, category, brand)")
        .or(`renter_id.eq.${user.id},owner_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      const rawBookings = userBookings || [];

      // Step 2: Fetch profiles for all unique user IDs referenced in bookings
      const userIds = [...new Set([
        ...rawBookings.map((b: any) => b.renter_id),
        ...rawBookings.map((b: any) => b.owner_id),
      ].filter(Boolean))];

      let profileMap: Record<string, { full_name: string; phone?: string }> = {};
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from("user_profiles")
          .select("auth_user_id, full_name, phone")
          .in("auth_user_id", userIds);
        profileMap = Object.fromEntries((profiles || []).map((p: any) => [p.auth_user_id, p]));
      }

      // Step 3: Merge profiles into bookings
      const bookingsList = rawBookings.map((b: any) => ({
        ...b,
        renter: profileMap[b.renter_id] || null,
        owner: profileMap[b.owner_id] || null,
      }));

      setBookings(bookingsList);

      // Calculate Metrics
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const activeMachinesCount = machinesList.filter((m: any) => m.status === 'available').length;
      const pendingRequestsCount = bookingsList.filter((b: any) => b.status === 'pending' && b.owner_id === user.id).length;

      const monthlyRevenueValue = bookingsList
        .filter((b: any) => {
          const bookingDate = new Date(b.created_at);
          return b.owner_id === user.id &&
            (b.status === 'confirmed' || b.status === 'completed') &&
            bookingDate.getMonth() === currentMonth &&
            bookingDate.getFullYear() === currentYear;
        })
        .reduce((acc: number, curr: any) => acc + Number(curr.total_price || 0), 0);

      const upcomingReservationsCount = bookingsList.filter((b: any) =>
        (b.owner_id === user.id || b.renter_id === user.id) &&
        (b.status === 'confirmed') &&
        new Date(b.start_date) > now
      ).length;

      setMetrics({
        monthlyRevenue: monthlyRevenueValue,
        revenueChange: 0, // Requires historical data
        occupancyRate: 0, // Requires complex calculation
        occupancyChange: 0,
        activeMachines: activeMachinesCount,
        pendingRequests: pendingRequestsCount,
        monthlyEarnings: monthlyRevenueValue, // Assuming earnings = revenue for now
        upcomingReservations: upcomingReservationsCount
      });

    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error loading dashboard data:", error);
      }
      toast({
        title: "Erro ao carregar dados",
        description: "Tente recarregar a página",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Carregando seu dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Header />

      <main className="pt-16 pb-24">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Page Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Painel do Proprietário
              </h1>
              <p className="text-muted-foreground text-sm">
                Olá, {userProfile?.full_name || 'Fazenda Santa Rita'}!
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </Button>
              <Button variant="outline" size="icon">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Button>
            </div>
          </div>

          {/* Hero Card - Blue */}
          <Card className="mb-6 bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-white text-xl font-bold mb-6">Painel do Proprietário</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Monthly Revenue */}
                <div>
                  <p className="text-blue-100 text-sm mb-1">Faturamento Mensal</p>
                  <div className="flex items-end gap-3">
                    <h3 className="text-white text-4xl font-bold">
                      R$ {(metrics.monthlyRevenue / 1000).toFixed(1)}k
                    </h3>
                    <div className="flex items-center gap-1 text-white mb-1">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm">+{metrics.revenueChange}%</span>
                    </div>
                  </div>
                </div>

                {/* Occupancy Rate */}
                <div>
                  <p className="text-blue-100 text-sm mb-1">Taxa de Ocupação</p>
                  <div className="flex items-end gap-3">
                    <h3 className="text-white text-4xl font-bold">
                      {metrics.occupancyRate}%
                    </h3>
                    <div className="flex items-center gap-1 text-white mb-1">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm">+{metrics.occupancyChange}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metrics Grid 2x2 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Active Machines */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Tractor className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-muted-foreground text-xs mb-1">Máquinas Ativas</p>
                    <p className="text-2xl font-bold">{metrics.activeMachines}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pending Requests */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <ShoppingCart className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-muted-foreground text-xs mb-1">Solicitações</p>
                    <p className="text-2xl font-bold">{metrics.pendingRequests}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Earnings */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-muted-foreground text-xs mb-1">Ganhos do Mês</p>
                    <p className="text-2xl font-bold">R$ {(metrics.monthlyEarnings / 1000).toFixed(1)}k</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Reservations */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-muted-foreground text-xs mb-1">Próximas Reservas</p>
                    <p className="text-2xl font-bold">{metrics.upcomingReservations}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Provider Section: All incoming booking requests */}
          {bookings.some((b: any) => b.owner_id === user?.id) && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-orange-500" />
                Solicitações Recebidas (Prestador)
              </h2>
              <BookingRequestsList
                bookings={bookings.filter((b: any) => b.owner_id === user?.id)}
                onUpdate={loadUserData}
                currentUserId={user?.id}
              />
            </div>
          )}

          {/* Renter Section: My Sent Requests */}
          {bookings.some((b: any) => b.renter_id === user?.id) && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Minhas Solicitações (Enviadas)
              </h2>
              <RenterBookingsList
                bookings={bookings.filter((b: any) => b.renter_id === user?.id)}
                currentUserId={user?.id}
              />
            </div>
          )}

          {/* Show empty state when no bookings at all */}
          {bookings.length === 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-orange-500" />
                Solicitações de Serviço
              </h2>
              <BookingRequestsList bookings={[]} onUpdate={loadUserData} currentUserId={user?.id} />
            </div>
          )}

          {/* Minhas Máquinas Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Tractor className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">Minhas Máquinas</h2>
              </div>
              <Button
                onClick={() => navigate("/add-machine")}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-1" />
                Adicionar
              </Button>
            </div>

            {userMachines.length > 0 ? (
              <div className="space-y-4">
                {userMachines.slice(0, 3).map((machine) => {
                  // Calculate real metrics for each machine
                  const machineBookings = bookings.filter((b: any) => b.machine_id === machine.id);
                  const machineRevenue = machineBookings
                    .filter((b: any) => b.status === 'completed' || b.status === 'confirmed')
                    .reduce((acc: number, curr: any) => acc + Number(curr.total_price || 0), 0);
                  const machineReservations = machineBookings.length;

                  return (
                    <Card key={machine.id}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          {/* Machine Image */}
                          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex-shrink-0 overflow-hidden">
                            {(machine.machine_images && machine.machine_images[0]?.image_url) ? (
                              <img
                                src={machine.machine_images[0].image_url}
                                alt={machine.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Tractor className="w-10 h-10 text-green-600" />
                              </div>
                            )}
                          </div>

                          {/* Machine Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-base mb-0.5 truncate">
                                  {machine.name || `${machine.brand} ${machine.model}`}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                  {machine.category}
                                </p>
                              </div>
                              <div className="text-right ml-2 flex-shrink-0">
                                <p className="text-green-600 font-bold text-base">
                                  R$ {(machineRevenue / 1000).toFixed(1)}k
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {machineReservations} reservas
                                </p>
                              </div>
                            </div>

                            <Badge
                              variant={machine.status === 'available' ? 'default' : 'secondary'}
                              className={machine.status === 'available'
                                ? 'bg-green-500 hover:bg-green-600'
                                : 'bg-red-500 hover:bg-red-600'
                              }
                            >
                              {machine.status === 'available' ? 'Ativo' : 'Inativo'}
                            </Badge>

                            {/* Occupancy Progress - Placeholder for now */}
                            <div className="mt-3">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-muted-foreground">Taxa de ocupação</span>
                                <span className="text-xs font-medium">0%</span>
                              </div>
                              <Progress value={0} className="h-2" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Tractor className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Nenhuma máquina cadastrada
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Comece cadastrando sua primeira máquina
                  </p>
                  <Button onClick={() => navigate("/add-machine")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Cadastrar Primeira Máquina
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

        </div>
      </main>

      {/* FAB - Floating Action Button */}
      <button
        onClick={() => navigate("/add-machine")}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center z-50"
        aria-label="Adicionar Máquina"
      >
        <Plus className="w-6 h-6" />
      </button>

      <Footer />
    </div>
  );
}