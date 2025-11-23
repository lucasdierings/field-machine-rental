import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Tractor, DollarSign, TrendingUp, Activity, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/hooks/useUserRole';
import AdminUsersTab from '@/components/admin/AdminUsersTab';
import AdminAnalyticsTab from '@/components/admin/AdminAnalyticsTab';

interface DashboardStats {
  total_users: number;
  verified_users: number;
  new_users_30d: number;
  total_machines: number;
  available_machines: number;
  new_machines_30d: number;
  total_bookings: number;
  pending_bookings: number;
  completed_bookings: number;
  new_bookings_30d: number;
  total_revenue: number;
  revenue_30d: number;
  total_platform_fees: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
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
        .from('users')
        .select('*', { count: 'exact', head: true });

      // 2. Machines Stats
      const { count: totalMachines } = await supabase
        .from('machines')
        .select('*', { count: 'exact', head: true });

      const { count: availableMachines } = await supabase
        .from('machines')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'available');

      // 3. Bookings Stats
      const { data: bookings } = await supabase
        .from('bookings')
        .select('status, total_amount, created_at');

      const totalBookings = bookings?.length || 0;
      const pendingBookings = bookings?.filter(b => b.status === 'pending').length || 0;
      const completedBookings = bookings?.filter(b => b.status === 'completed' || b.status === 'approved').length || 0;

      // Calculate Revenue
      const totalRevenue = bookings
        ?.filter(b => b.status === 'completed' || b.status === 'approved')
        .reduce((acc, curr) => acc + (curr.total_amount || 0), 0) || 0;

      // Calculate 30d stats
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const newUsers30d = 0; // Need created_at in users table to calculate this accurately
      const newMachines30d = 0; // Need created_at in machines
      const revenue30d = bookings
        ?.filter(b => (b.status === 'completed' || b.status === 'approved') && new Date(b.created_at) >= thirtyDaysAgo)
        .reduce((acc, curr) => acc + (curr.total_amount || 0), 0) || 0;

      setStats({
        total_users: totalUsers || 0,
        verified_users: 0, // Need verification logic
        new_users_30d: newUsers30d,
        total_machines: totalMachines || 0,
        available_machines: availableMachines || 0,
        new_machines_30d: newMachines30d,
        total_bookings: totalBookings,
        pending_bookings: pendingBookings,
        completed_bookings: completedBookings,
        new_bookings_30d: 0,
        total_revenue: totalRevenue,
        revenue_30d: revenue30d,
        total_platform_fees: totalRevenue * 0.1 // Assuming 10% fee
      });

    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to load stats:', error);
      }
    }
  };

  // Calcular taxa de conversão (bookings completados / total de usuários)
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
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <Activity className="h-4 w-4" />
              Voltar ao Site
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
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
                    +{stats?.new_users_30d || 0} este mês
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Máquinas Ativas</CardTitle>
                  <Tractor className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.available_machines || 0}</div>
                  <p className="text-xs text-green-600">
                    +{stats?.new_machines_30d || 0} este mês
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">GMV Mensal</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    R$ {(stats?.revenue_30d || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total: R$ {(stats?.total_revenue || 0).toLocaleString('pt-BR')}
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
                    {stats?.completed_bookings || 0} reservas completadas
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
                    <span className="text-sm text-muted-foreground">Completadas</span>
                    <span className="font-bold text-green-600">{stats?.completed_bookings || 0}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Usuários</CardTitle>
                  <CardDescription>Verificação</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="font-bold">{stats?.total_users || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Verificados</span>
                    <span className="font-bold text-green-600">{stats?.verified_users || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Pendentes</span>
                    <span className="font-bold text-yellow-600">
                      {(stats?.total_users || 0) - (stats?.verified_users || 0)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Receita</CardTitle>
                  <CardDescription>Taxas da plataforma (10%)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="font-bold">
                      R$ {(stats?.total_platform_fees || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Este mês</span>
                    <span className="font-bold text-green-600">
                      R$ {((stats?.revenue_30d || 0) * 0.1).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Crescimento de Usuários</CardTitle>
                  <CardDescription>Últimos 30 dias</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Gráfico de linha (implementar com Recharts)
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Máquinas por Categoria</CardTitle>
                  <CardDescription>Distribuição atual</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Gráfico de pizza (implementar com Recharts)
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top 10 Cidades</CardTitle>
                  <CardDescription>Por número de buscas</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Gráfico de barras (implementar com Recharts)
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Últimas Transações</CardTitle>
                  <CardDescription>5 mais recentes</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Tabela de transações
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <AdminUsersTab />
          </TabsContent>

          <TabsContent value="analytics">
            <AdminAnalyticsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;