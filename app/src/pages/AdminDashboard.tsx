import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, FileCheck, Tractor, TrendingUp, Users, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/hooks/useUserRole';
import AdminUsersTab from '@/components/admin/AdminUsersTab';
import AdminAnalyticsTab from '@/components/admin/AdminAnalyticsTab';
import AdminMachinesTab from '@/components/admin/AdminMachinesTab';
import { DocumentApproval } from '@/components/admin/DocumentApproval';
import { AdminOverviewTab } from '@/components/admin/AdminOverviewTab';

interface DashboardStats {
  total_users: number;
  active_users_30d: number;
  new_users_30d: number;
  total_machines: number;
  available_machines: number;
  total_bookings: number;
  pending_bookings: number;
  completed_bookings: number;
  total_negotiations: number;   // value of completed bookings
  negotiations_30d: number;
  search_alerts_count: number;
}

interface CategoryData { name: string; value: number; }
interface CityData { city: string; users: number; }
interface TransactionRow {
  id: string;
  machine_name: string;
  renter_name: string;
  value: number;
  date: string;
  billing_type?: string;
  billing_quantity?: number;
}
interface UserGrowthRow { month: string; users: number; }


const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [cityData, setCityData] = useState<CityData[]>([]);
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [userGrowth, setUserGrowth] = useState<UserGrowthRow[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, loading: roleLoading } = useUserRole();

  useEffect(() => {
    if (!roleLoading && isAdmin()) {
      loadDashboardStats();
      setLoading(false);
    } else if (!roleLoading && !isAdmin()) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão de administrador",
        variant: "destructive"
      });
      navigate('/dashboard');
    }
  }, [roleLoading, isAdmin, navigate, toast]);

  const loadDashboardStats = async () => {
    try {
      // 1. Users Stats
      const { count: totalUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      // Active users in last 30 days (have a booking)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const thirtyDaysAgoISO = thirtyDaysAgo.toISOString();

      const { data: activeUserData } = await supabase
        .from('bookings')
        .select('renter_id, owner_id, created_at')
        .gte('created_at', thirtyDaysAgoISO);

      const activeUserSet = new Set<string>();
      (activeUserData || []).forEach((b: any) => {
        if (b.renter_id) activeUserSet.add(b.renter_id);
        if (b.owner_id) activeUserSet.add(b.owner_id);
      });

      // 2. Machines Stats
      const { count: totalMachines } = await supabase
        .from('machines')
        .select('*', { count: 'exact', head: true });

      const { count: availableMachines } = await supabase
        .from('machines')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'available');

      // Machines by category
      const { data: machinesData } = await supabase
        .from('machines')
        .select('category');

      const catMap: Record<string, number> = {};
      (machinesData || []).forEach((m: any) => {
        const cat = m.category || 'Outros';
        catMap[cat] = (catMap[cat] || 0) + 1;
      });
      setCategoryData(
        Object.entries(catMap)
          .sort((a, b) => b[1] - a[1])
          .map(([name, value]) => ({ name, value }))
      );

      // 3. Bookings Stats
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('id, status, total_price, total_amount, negotiated_price, billing_type, billing_quantity, completed_at, created_at, machine_id, renter_id, machines(name)')
        .order('created_at', { ascending: false });

      const bookings = bookingsData as any[] || [];

      const totalBookings = bookings.length;
      const pendingBookings = bookings.filter(b => b.status === 'pending').length;
      const completedBookings = bookings.filter(b => b.status === 'completed').length;

      const totalNegotiations = bookings
        .filter(b => b.status === 'completed')
        .reduce((acc, curr) => acc + (Number(curr.negotiated_price) || Number(curr.total_price) || Number(curr.total_amount) || 0), 0);

      const negotiations30d = bookings
        .filter(b => b.status === 'completed' && new Date(b.created_at) >= thirtyDaysAgo)
        .reduce((acc, curr) => acc + (Number(curr.negotiated_price) || Number(curr.total_price) || Number(curr.total_amount) || 0), 0);

      // Latest 5 completed transactions
      const completedList = bookings.filter(b => b.status === 'completed').slice(0, 5);
      const renterIds = [...new Set(completedList.map((b: any) => b.renter_id).filter(Boolean))];
      let renterMap: Record<string, string> = {};
      if (renterIds.length > 0) {
        const { data: profiles } = await supabase
          .from('user_profiles')
          .select('auth_user_id, full_name')
          .in('auth_user_id', renterIds);
        renterMap = Object.fromEntries((profiles || []).map((p: any) => [p.auth_user_id, p.full_name]));
      }

      setTransactions(
        completedList.map((b: any) => ({
          id: b.id,
          machine_name: b.machines?.name || 'Máquina',
          renter_name: renterMap[b.renter_id] || 'Usuário',
          value: Number(b.negotiated_price) || Number(b.total_price) || Number(b.total_amount) || 0,
          date: b.completed_at || b.created_at,
          billing_type: b.billing_type || null,
          billing_quantity: b.billing_quantity || null,
        }))
      );

      // 4. Usuários por cidade — apenas do perfil do usuário (address JSON)
      const { data: profilesCity } = await supabase
        .from('user_profiles')
        .select('address');

      const cityMap: Record<string, number> = {};

      (profilesCity || []).forEach((p: any) => {
        const addr = typeof p.address === 'string' ? JSON.parse(p.address) : p.address;
        const city = addr?.city?.trim();
        const state = addr?.state?.trim();
        if (city) {
          const label = state ? `${city}/${state}` : city;
          cityMap[label] = (cityMap[label] || 0) + 1;
        }
      });

      setCityData(
        Object.entries(cityMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([city, users]) => ({ city, users }))
      );

      // 5. User growth – group user_profiles by month using created_at (if available)
      const { data: profilesCreated } = await supabase
        .from('user_profiles')
        .select('created_at')
        .not('created_at', 'is', null);

      const growthMap: Record<string, number> = {};
      (profilesCreated || []).forEach((p: any) => {
        if (!p.created_at) return;
        const d = new Date(p.created_at);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        growthMap[key] = (growthMap[key] || 0) + 1;
      });
      const growthEntries = Object.entries(growthMap)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .slice(-12)
        .map(([month, users]) => ({
          month: month.replace('-', '/'),
          users,
        }));
      setUserGrowth(growthEntries);

      // 6. Search Alerts
      const { count: totalAlerts } = await (supabase as any)
        .from('search_alerts')
        .select('*', { count: 'exact', head: true });

      setStats({
        total_users: totalUsers || 0,
        active_users_30d: activeUserSet.size,
        new_users_30d: 0,
        total_machines: totalMachines || 0,
        available_machines: availableMachines || 0,
        total_bookings: totalBookings,
        pending_bookings: pendingBookings,
        completed_bookings: completedBookings,
        total_negotiations: totalNegotiations,
        negotiations_30d: negotiations30d,
        search_alerts_count: totalAlerts || 0,
      });

    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to load stats:', error);
      }
    }
  };

  const calculateConversionRate = () => {
    if (!stats || stats.total_users === 0) return "0.0";
    return ((stats.completed_bookings / stats.total_users) * 100).toFixed(1);
  };

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Painel Administrativo</h1>
              <p className="text-muted-foreground">FieldMachine Dashboard</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/')} className="gap-2">
              <Activity className="h-4 w-4" />
              Voltar ao Site
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="machines" className="gap-2">
              <Tractor className="h-4 w-4" />
              Máquinas
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-2">
              <FileCheck className="h-4 w-4" />
              Documentos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AdminOverviewTab
              stats={stats}
              categoryData={categoryData}
              cityData={cityData}
              transactions={transactions}
              userGrowth={userGrowth}
              calculateConversionRate={calculateConversionRate}
            />
          </TabsContent>

          <TabsContent value="users">
            <AdminUsersTab />
          </TabsContent>

          <TabsContent value="machines">
            <AdminMachinesTab />
          </TabsContent>

          <TabsContent value="analytics">
            <AdminAnalyticsTab />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentApproval />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
