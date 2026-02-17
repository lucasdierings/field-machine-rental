import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
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
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Alerts;