import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Tractor, TrendingUp, Activity, BarChart3, FileCheck, Handshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/hooks/useUserRole';
import AdminUsersTab from '@/components/admin/AdminUsersTab';
import AdminAnalyticsTab from '@/components/admin/AdminAnalyticsTab';
import AdminMachinesTab from '@/components/admin/AdminMachinesTab';
import { DocumentApproval } from '@/components/admin/DocumentApproval';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from 'recharts';

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

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];

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

      // 4. Users by city — extract from address JSON in user_profiles + machines location
      const { data: profilesCity } = await supabase
        .from('user_profiles')
        .select('address');

      const { data: machinesCity } = await supabase
        .from('machines')
        .select('location, owner_id');

      const cityMap: Record<string, number> = {};

      // Extract from user_profiles.address (JSON: {city, state, ...})
      (profilesCity || []).forEach((p: any) => {
        const addr = typeof p.address === 'string' ? JSON.parse(p.address) : p.address;
        const city = addr?.city?.trim();
        const state = addr?.state?.trim();
        if (city) {
          const label = state ? `${city}/${state}` : city;
          cityMap[label] = (cityMap[label] || 0) + 1;
        }
      });

      // Also extract from machines.location (JSON: {city, state, ...})
      // Count unique owners per city (so one owner = 1 count even with multiple machines)
      const ownerCitySet = new Set<string>();
      (machinesCity || []).forEach((m: any) => {
        const loc = typeof m.location === 'string' ? JSON.parse(m.location) : m.location;
        const city = loc?.city?.trim();
        const state = loc?.state?.trim();
        if (city && m.owner_id) {
          const label = state ? `${city}/${state}` : city;
          const key = `${m.owner_id}:${label}`;
          if (!ownerCitySet.has(key)) {
            ownerCitySet.add(key);
            // Only add if we didn't already count this user from their profile
            if (!cityMap[label]) cityMap[label] = 0;
            // Add machine-based city data with lower weight if profile already counted
            cityMap[label] = (cityMap[label] || 0) + 1;
          }
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

          <TabsContent value="dashboard" className="space-y-8">
            {/* KPI Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Usuários Totais</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.total_users || 0}</div>
                  <p className="text-xs text-green-600">
                    {stats?.active_users_30d || 0} ativos nos últimos 30 dias
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-yellow-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Alertas de Busca</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.search_alerts_count || 0}</div>
                  <p className="text-xs text-muted-foreground">Usuários monitorando</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Máquinas Ativas</CardTitle>
                  <Tractor className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.available_machines || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    de {stats?.total_machines || 0} cadastradas
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Negociações (30d)</CardTitle>
                  <Handshake className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    R$ {(stats?.negotiations_30d || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total: R$ {(stats?.total_negotiations || 0).toLocaleString('pt-BR')}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taxa Conversão</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{calculateConversionRate()}%</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.completed_bookings || 0} reservas concluídas
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Reservas</CardTitle>
                  <CardDescription>Status atual</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="font-bold">{stats?.total_bookings || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Pendentes</span>
                    <span className="font-bold text-yellow-600">{stats?.pending_bookings || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Concluídas</span>
                    <span className="font-bold text-green-600">{stats?.completed_bookings || 0}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Usuários</CardTitle>
                  <CardDescription>Atividade</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="font-bold">{stats?.total_users || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Ativos (30d)</span>
                    <span className="font-bold text-green-600">{stats?.active_users_30d || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Inativos</span>
                    <span className="font-bold text-yellow-600">
                      {(stats?.total_users || 0) - (stats?.active_users_30d || 0)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Negociações Realizadas</CardTitle>
                  <CardDescription>Valor total de reservas concluídas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total histórico</span>
                    <span className="font-bold">
                      R$ {(stats?.total_negotiations || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Últimos 30 dias</span>
                    <span className="font-bold text-green-600">
                      R$ {(stats?.negotiations_30d || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Reservas concluídas</span>
                    <span className="font-bold text-green-600">{stats?.completed_bookings || 0}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* User Growth Line Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Crescimento de Usuários</CardTitle>
                  <CardDescription>Novos cadastros por mês</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {userGrowth.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={userGrowth} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="users"
                          name="Usuários"
                          stroke="#22c55e"
                          strokeWidth={2}
                          dot={{ fill: '#22c55e', r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                      Sem dados suficientes
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Machines by Category Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Máquinas por Categoria</CardTitle>
                  <CardDescription>Distribuição atual</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={3}
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                          labelLine={false}
                        >
                          {categoryData.map((_, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [`${value} máquinas`, '']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                      Sem dados
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Top 10 Cities Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Top 10 Cidades</CardTitle>
                  <CardDescription>Usuários e prestadores por cidade</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {cityData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={cityData}
                        layout="vertical"
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                        <YAxis dataKey="city" type="category" tick={{ fontSize: 10 }} width={90} />
                        <Tooltip />
                        <Bar dataKey="users" name="Usuários" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                      Sem dados de cidade nos perfis
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Latest Transactions Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Últimas Negociações</CardTitle>
                  <CardDescription>5 reservas concluídas mais recentes</CardDescription>
                </CardHeader>
                <CardContent>
                  {transactions.length > 0 ? (
                    <div className="space-y-1">
                      <div className="grid grid-cols-3 text-xs font-semibold text-muted-foreground pb-2 border-b">
                        <span>Máquina / Solicitante</span>
                        <span className="text-center">Data</span>
                        <span className="text-right">Valor</span>
                      </div>
                      {transactions.map((tx) => (
                        <div key={tx.id} className="grid grid-cols-3 text-sm py-2 border-b last:border-0 items-center">
                          <div>
                            <p className="font-medium truncate">{tx.machine_name}</p>
                            <p className="text-xs text-muted-foreground truncate">{tx.renter_name}</p>
                            {tx.billing_type && tx.billing_quantity && (
                              <p className="text-xs text-blue-600">
                                {tx.billing_quantity} {tx.billing_type === 'hora' ? 'h' : tx.billing_type === 'hectare' ? 'ha' : tx.billing_type === 'dia' ? 'dias' : tx.billing_type}
                              </p>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground text-center">
                            {new Date(tx.date).toLocaleDateString('pt-BR')}
                          </p>
                          <p className="font-semibold text-green-600 text-right">
                            R$ {tx.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                      Nenhuma negociação concluída ainda
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
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
