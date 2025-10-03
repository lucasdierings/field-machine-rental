import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, Settings, BarChart3, Bell, History } from "lucide-react";
import { MachineGallery } from "@/components/machines/MachineGallery";

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userMachines, setUserMachines] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        .select("*")
        .eq("owner_id", user.id);
      
      setUserMachines(machines || []);

      // Load bookings
      const { data: userBookings } = await supabase
        .from("bookings" as any)
        .select(`
          *,
          machines(name, category, brand),
          renter:user_profiles!bookings_renter_id_fkey(full_name),
          owner:user_profiles!bookings_owner_id_fkey(full_name)
        `)
        .or(`renter_id.eq.${user.id},owner_id.eq.${user.id}`);
      
      setBookings(userBookings || []);

      // Load alerts
      const { data: userAlerts } = await supabase
        .from("alerts")
        .select("*")
        .eq("user_id", user.id);
      
      setAlerts(userAlerts || []);

    } catch (error) {
      console.error("Error loading dashboard data:", error);
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
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Olá, {userProfile?.full_name || user?.email}
            </h1>
            <p className="text-muted-foreground">
              Gerencie suas máquinas, reservas e perfil
            </p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="machines">Minhas Máquinas</TabsTrigger>
              <TabsTrigger value="bookings">Reservas</TabsTrigger>
              <TabsTrigger value="alerts">Alertas</TabsTrigger>
              <TabsTrigger value="profile">Perfil</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Máquinas Cadastradas
                    </CardTitle>
                    <Settings className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userMachines.length}</div>
                    <p className="text-xs text-muted-foreground">
                      equipamentos disponíveis
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Reservas Ativas
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {bookings.filter(b => b.status === 'confirmed' || b.status === 'in_progress').length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      contratos em andamento
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Alertas Ativos
                    </CardTitle>
                    <Bell className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {alerts.filter(a => a.is_active).length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      notificações configuradas
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Ações Rápidas</CardTitle>
                    <CardDescription>
                      Principais funcionalidades do sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      onClick={() => navigate("/add-machine")}
                      className="w-full justify-start"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Cadastrar Nova Máquina
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => navigate("/search")}
                      className="w-full justify-start"
                    >
                      Buscar Máquinas
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => navigate("/alerts")}
                      className="w-full justify-start"
                    >
                      <Bell className="mr-2 h-4 w-4" />
                      Configurar Alertas
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Últimas Atividades</CardTitle>
                    <CardDescription>
                      Histórico recente de reservas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {bookings.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-sm font-medium">{booking.machines?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {booking.status === 'pending' && 'Pendente'}
                            {booking.status === 'confirmed' && 'Confirmado'}
                            {booking.status === 'completed' && 'Concluído'}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(booking.start_date).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                    {bookings.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        Nenhuma atividade recente
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="machines" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Minhas Máquinas</h2>
                  <p className="text-muted-foreground">
                    Gerencie seus equipamentos cadastrados
                  </p>
                </div>
                <Button onClick={() => navigate("/add-machine")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Máquina
                </Button>
              </div>

              {userMachines.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userMachines.map((machine) => (
                    <Card key={machine.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{machine.name}</CardTitle>
                        <CardDescription>
                          {machine.brand} - {machine.year}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Categoria:</span>
                            <span className="text-sm font-medium">{machine.category}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Status:</span>
                            <span className={`text-sm font-medium ${
                              machine.status === 'available' 
                                ? 'text-green-600' 
                                : 'text-yellow-600'
                            }`}>
                              {machine.status === 'available' ? 'Disponível' : 'Ocupado'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Preço/hora:</span>
                            <span className="text-sm font-medium">
                              R$ {machine.price_hour?.toFixed(2) || '0,00'}
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 space-x-2">
                          <Button size="sm" variant="outline">
                            Editar
                          </Button>
                          <Button size="sm" variant="outline">
                            Galeria
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Settings className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
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
            </TabsContent>

            <TabsContent value="bookings" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Histórico de Reservas</h2>
                <p className="text-muted-foreground">
                  Contratos realizados e em andamento
                </p>
              </div>

              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardContent className="pt-6">
                        <div className="grid md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm font-medium">{booking.machines?.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {booking.machines?.brand} - {booking.machines?.category}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {new Date(booking.start_date).toLocaleDateString()} - 
                              {new Date(booking.end_date).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-muted-foreground">Período</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              R$ {booking.total_price?.toFixed(2) || '0,00'}
                            </p>
                            <p className="text-xs text-muted-foreground">Valor Total</p>
                          </div>
                          <div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                              booking.status === 'in_progress' ? 'bg-purple-100 text-purple-800' :
                              booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {booking.status === 'pending' && 'Pendente'}
                              {booking.status === 'confirmed' && 'Confirmado'}
                              {booking.status === 'in_progress' && 'Em Andamento'}
                              {booking.status === 'completed' && 'Concluído'}
                              {booking.status === 'cancelled' && 'Cancelado'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <History className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Nenhuma reserva encontrada
                    </h3>
                    <p className="text-muted-foreground">
                      Suas reservas aparecerão aqui
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="alerts" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Meus Alertas</h2>
                <p className="text-muted-foreground">
                  Configurações de notificações para novas máquinas
                </p>
              </div>

              <Card>
                <CardContent className="text-center py-12">
                  <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Sistema de alertas em desenvolvimento
                  </h3>
                  <p className="text-muted-foreground">
                    Em breve você poderá configurar alertas personalizados
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Meu Perfil</h2>
                <p className="text-muted-foreground">
                  Gerencie suas informações pessoais
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>
                    Seus dados cadastrais no sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Nome Completo</label>
                      <p className="text-sm text-muted-foreground">
                        {userProfile?.full_name || 'Não informado'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p className="text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Telefone</label>
                      <p className="text-sm text-muted-foreground">
                        {userProfile?.phone || 'Não informado'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Tipo de Usuário</label>
                      <p className="text-sm text-muted-foreground">
                        {userProfile?.user_type === 'producer' ? 'Produtor' : 
                         userProfile?.user_type === 'owner' ? 'Proprietário' : 
                         'Não definido'}
                      </p>
                    </div>
                  </div>
                  <Button>Editar Perfil</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}