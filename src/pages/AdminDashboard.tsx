import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Tractor, DollarSign, TrendingUp, Activity, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import AdminUsersTab from '@/components/admin/AdminUsersTab';
import AdminAnalyticsTab from '@/components/admin/AdminAnalyticsTab';

interface DashboardStats {
  totalUsers: number;
  activeMachines: number;
  monthlyGMV: number;
  conversionRate: number;
  userGrowth: number;
  machineGrowth: number;
  gmvGrowth: number;
}

const AdminDashboard = () => {
  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeMachines: 0,
    monthlyGMV: 0,
    conversionRate: 0,
    userGrowth: 0,
    machineGrowth: 0,
    gmvGrowth: 0,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAuth();
    loadDashboardStats();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const sessionResult = await supabase.auth.getSession();
      const session = sessionResult.data.session;
      
      if (!session) {
        navigate('/entrar');
        return;
      }

      // For now, assume admin access (would check user_type in production)
      // TODO: Implement proper admin check with user_type from users table
      setUserType('admin');
    } catch (err) {
      console.error('Auth check failed:', err);
      navigate('/entrar');
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardStats = async () => {
    try {
      // Get total users
      const usersResult = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Get active machines
      const machinesResult = await supabase
        .from('machines')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'available');

      // Mock data for other stats (would need actual booking/payment tables)
      setStats({
        totalUsers: usersResult.count || 0,
        activeMachines: machinesResult.count || 0,
        monthlyGMV: 285000,
        conversionRate: 3.2,
        userGrowth: 12,
        machineGrowth: 8,
        gmvGrowth: 25,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (userType !== 'admin') {
    return null;
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
                  <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-green-600">
                    +{stats.userGrowth}% este mês
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Máquinas Ativas</CardTitle>
                  <Tractor className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeMachines.toLocaleString()}</div>
                  <p className="text-xs text-green-600">
                    +{stats.machineGrowth}% este mês
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
                    R$ {stats.monthlyGMV.toLocaleString('pt-BR')}
                  </div>
                  <p className="text-xs text-green-600">
                    +{stats.gmvGrowth}% este mês
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taxa Conversão</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.conversionRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    Meta: 3%
                  </p>
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