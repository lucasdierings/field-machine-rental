<<<<<<< HEAD
=======
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
>>>>>>> origin/main
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
<<<<<<< HEAD
import { Bell, Plus, MapPin, DollarSign } from "lucide-react";

const Alerts = () => {
  // Mock data - in real app this would come from state/API
  const alerts = [
    {
      id: 1,
      name: "Tratores em Ribeirão Preto",
      category: "Tratores",
      location: "Ribeirão Preto, SP",
      maxPrice: 300,
      isActive: true
    },
    {
      id: 2,
      name: "Colheitadeiras até R$ 500/h",
      category: "Colheitadeiras",
      location: "Qualquer local",
      maxPrice: 500,
      isActive: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Bell className="h-8 w-8 text-primary" />
                  <h1 className="text-3xl font-bold">Alertas de Equipamentos</h1>
                </div>
                <Button className="bg-gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Alerta
                </Button>
              </div>

              {/* Create Alert Form */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Criar Novo Alerta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="alert-name">Nome do Alerta</Label>
                      <Input id="alert-name" placeholder="Ex: Tratores na minha região" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoria</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tratores">Tratores</SelectItem>
                          <SelectItem value="colheitadeiras">Colheitadeiras</SelectItem>
                          <SelectItem value="pulverizadores">Pulverizadores</SelectItem>
                          <SelectItem value="plantadeiras">Plantadeiras</SelectItem>
                          <SelectItem value="implementos">Implementos</SelectItem>
                          <SelectItem value="transporte-de-cargas">Transporte de Cargas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Localização</Label>
                      <Input id="location" placeholder="Cidade, Estado" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="max-price">Preço Máximo (R$/hora)</Label>
                      <Input id="max-price" type="number" placeholder="300" />
                    </div>
                  </div>

                  <Button className="bg-gradient-primary">
                    Criar Alerta
                  </Button>
                </CardContent>
              </Card>

              {/* Active Alerts */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Seus Alertas</h2>
                
                {alerts.length === 0 ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Nenhum alerta criado</h3>
                      <p className="text-muted-foreground">
                        Crie alertas para ser notificado quando novos equipamentos 
                        estiverem disponíveis.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  alerts.map((alert) => (
                    <Card key={alert.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{alert.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Bell className="h-4 w-4" />
                                {alert.category}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {alert.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                Até R$ {alert.maxPrice}/h
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Label htmlFor={`alert-${alert.id}`} className="text-sm">
                                {alert.isActive ? "Ativo" : "Inativo"}
                              </Label>
                              <Switch 
                                id={`alert-${alert.id}`}
                                checked={alert.isActive}
                              />
                            </div>
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                            <Button variant="outline" size="sm">
                              Excluir
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Information Card */}
              <Card className="mt-8 bg-primary/5">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Como funcionam os alertas?</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Receba notificações por e-mail quando novos equipamentos atenderem seus critérios</li>
                    <li>• Configure múltiplos alertas para diferentes tipos de equipamentos</li>
                    <li>• Ative ou desative alertas a qualquer momento</li>
                    <li>• Seja o primeiro a saber sobre equipamentos disponíveis na sua região</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
=======
import { Badge } from "@/components/ui/badge";
import { Bell, Plus, MapPin, DollarSign, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SERVICE_CATEGORIES } from "@/data/categories";

interface Alert {
  id: string;
  category: string | null;
  location: any;
  radius_km: number | null;
  price_range: any;
  is_active: boolean | null;
  created_at: string;
}

const Alerts = () => {
  const { userId, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showForm, setShowForm] = useState(false);

  const loadAlerts = useCallback(async () => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error: any) {
      console.error("Error loading alerts:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (isAuthenticated) loadAlerts();
    else setLoading(false);
  }, [isAuthenticated, loadAlerts]);

  const handleCreate = async () => {
    if (!userId) {
      toast({ title: "Faça login para criar alertas", variant: "destructive" });
      navigate("/login");
      return;
    }
    if (!category) {
      toast({ title: "Selecione uma categoria", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("alerts")
        .insert({
          user_id: userId,
          category,
          location: location ? { city: location } : null,
          price_range: maxPrice ? { max: Number(maxPrice) } : null,
          radius_km: 50,
          is_active: true,
        });

      if (error) throw error;

      toast({ title: "Alerta criado!", description: "Você será notificado quando houver novos serviços." });
      setCategory("");
      setLocation("");
      setMaxPrice("");
      setShowForm(false);
      loadAlerts();
    } catch (error: any) {
      toast({ title: "Erro ao criar alerta", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (alertId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from("alerts")
        .update({ is_active: !isActive, updated_at: new Date().toISOString() })
        .eq("id", alertId);

      if (error) throw error;
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, is_active: !isActive } : a));
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from("alerts")
        .delete()
        .eq("id", alertId);

      if (error) throw error;
      setAlerts(prev => prev.filter(a => a.id !== alertId));
      toast({ title: "Alerta removido" });
    } catch (error: any) {
      toast({ title: "Erro ao remover", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      <main className="pt-16">
        <section className="py-8">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Bell className="h-7 w-7 text-primary" />
                <h1 className="text-2xl font-bold">Alertas de Serviços</h1>
              </div>
              {!showForm && (
                <Button onClick={() => setShowForm(true)} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Novo
                </Button>
              )}
            </div>

            {/* Create Alert Form */}
            {showForm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Novo Alerta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Categoria *</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICE_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Localização (opcional)</Label>
                      <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Cidade, Estado"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Preço Máximo R$/hora (opcional)</Label>
                      <Input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="Ex: 300"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
                    <Button onClick={handleCreate} disabled={saving}>
                      {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Bell className="h-4 w-4 mr-1" />}
                      Criar Alerta
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Alerts List */}
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : !isAuthenticated ? (
              <Card className="border-dashed">
                <CardContent className="text-center py-8">
                  <Bell className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground text-sm mb-3">Faça login para criar e gerenciar alertas.</p>
                  <Button variant="outline" onClick={() => navigate("/login")}>Entrar</Button>
                </CardContent>
              </Card>
            ) : alerts.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="text-center py-10">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-40" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum alerta criado</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Crie alertas para ser notificado quando novos serviços estiverem disponíveis na sua região.
                  </p>
                  <Button onClick={() => setShowForm(true)}>
                    <Plus className="h-4 w-4 mr-1" /> Criar Primeiro Alerta
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <Card key={alert.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">{alert.category || "Todas"}</Badge>
                            {alert.is_active ? (
                              <Badge className="bg-green-100 text-green-800 text-[10px]">Ativo</Badge>
                            ) : (
                              <Badge variant="outline" className="text-[10px]">Inativo</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            {alert.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {typeof alert.location === "object" ? alert.location.city : alert.location}
                              </span>
                            )}
                            {alert.price_range?.max && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                Até R$ {alert.price_range.max}/h
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Switch
                            checked={!!alert.is_active}
                            onCheckedChange={() => handleToggle(alert.id, !!alert.is_active)}
                          />
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(alert.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Info */}
            <Card className="mt-8 bg-primary/5">
              <CardContent className="p-5">
                <h3 className="font-semibold mb-2 text-sm">Como funcionam os alertas?</h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Receba notificações quando novos serviços atenderem seus critérios</li>
                  <li>• Configure alertas para diferentes categorias e regiões</li>
                  <li>• Ative ou desative a qualquer momento</li>
                </ul>
              </CardContent>
            </Card>
>>>>>>> origin/main
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

<<<<<<< HEAD
export default Alerts;
=======
export default Alerts;
>>>>>>> origin/main
