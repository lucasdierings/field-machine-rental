import { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Tractor, ShoppingCart, Calendar } from "lucide-react";
import { BookingRequestsList } from "@/components/booking/BookingRequestsList";
import { RenterBookingsList } from "@/components/booking/RenterBookingsList";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { DashboardMachineCard } from "@/components/dashboard/DashboardMachineCard";

export default function Dashboard() {
  const navigate = useNavigate();
  const { userId } = useAuth();

  // Load user machines
  const { data: userMachines = [], refetch: refetchMachines } = useQuery({
    queryKey: ['dashboard-machines', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("machines")
        .select("*, machine_images(image_url)")
        .eq("owner_id", userId!);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!userId,
  });

  // Load bookings
  const { data: bookings = [], refetch: refetchBookings } = useQuery({
    queryKey: ['dashboard-bookings', userId],
    queryFn: async () => {
      // Step 1: Load bookings
      const { data: rawBookings, error } = await supabase
        .from("bookings" as any)
        .select("*, machines(name, category, brand)")
        .or(`renter_id.eq.${userId},owner_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      const bookingsList = rawBookings || [];

      // Step 2: Fetch profiles for all unique user IDs
      const userIds = [...new Set([
        ...bookingsList.map((b: any) => b.renter_id),
        ...bookingsList.map((b: any) => b.owner_id),
      ].filter(Boolean))];

      let profileMap: Record<string, { full_name: string; phone?: string; verified?: boolean }> = {};
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from("user_profiles")
          .select("auth_user_id, full_name, phone, verified")
          .in("auth_user_id", userIds);
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

  const refetchAll = useCallback(() => {
    refetchMachines();
    refetchBookings();
  }, [refetchMachines, refetchBookings]);

  // Calculate Metrics
  const metrics = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const activeMachinesCount = userMachines.filter((m: any) => m.status === 'available').length;
    const pendingRequestsCount = bookings.filter((b: any) => b.status === 'pending' && b.owner_id === userId).length;

    const monthlyRevenueValue = bookings
      .filter((b: any) => {
        const completedDate = b.completed_at ? new Date(b.completed_at) : new Date(b.created_at);
        return b.owner_id === userId &&
          b.status === 'completed' &&
          completedDate.getMonth() === currentMonth &&
          completedDate.getFullYear() === currentYear;
      })
      .reduce((acc: number, curr: any) => {
        const amount = Number(curr.negotiated_price || curr.total_price || curr.total_amount || 0);
        return acc + amount;
      }, 0);

    const upcomingReservationsCount = bookings.filter((b: any) =>
      (b.owner_id === userId || b.renter_id === userId) &&
      (b.status === 'confirmed') &&
      new Date(b.start_date) > now
    ).length;

    return {
      monthlyRevenue: monthlyRevenueValue,
      revenueChange: 0,
      occupancyRate: 0,
      occupancyChange: 0,
      activeMachines: activeMachinesCount,
      pendingRequests: pendingRequestsCount,
      monthlyEarnings: monthlyRevenueValue,
      upcomingReservations: upcomingReservationsCount
    };
  }, [userMachines, bookings, userId]);

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
                Bem-vindo ao seu painel!
              </p>
            </div>

          </div>

          <DashboardMetrics metrics={metrics} />

          {/* Provider Section: All incoming booking requests */}
          {bookings.some((b: any) => b.owner_id === userId) && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-orange-500" />
                Solicitações Recebidas (Prestador)
              </h2>
              <BookingRequestsList
                bookings={bookings.filter((b: any) => b.owner_id === userId)}
                onUpdate={refetchAll}
                currentUserId={userId}
              />
            </div>
          )}

          {/* Renter Section: My Sent Requests */}
          {bookings.some((b: any) => b.renter_id === userId) && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Minhas Solicitações (Enviadas)
              </h2>
              <RenterBookingsList
                bookings={bookings.filter((b: any) => b.renter_id === userId)}
                currentUserId={userId}
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
              <BookingRequestsList bookings={[]} onUpdate={refetchAll} currentUserId={userId} />
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
                {userMachines.slice(0, 3).map((machine: any) => {
                  const machineBookings = bookings.filter((b: any) => b.machine_id === machine.id);
                  const machineRevenue = machineBookings
                    .filter((b: any) => b.status === 'completed')
                    .reduce((acc: number, curr: any) => {
                      return acc + Number(curr.negotiated_price || curr.total_price || curr.total_amount || 0);
                    }, 0);
                  return (
                    <DashboardMachineCard
                      key={machine.id}
                      machine={machine}
                      revenue={machineRevenue}
                      reservations={machineBookings.length}
                    />
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
