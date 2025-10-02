import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, DollarSign, Shield, Users } from "lucide-react";

const RentMyMachine = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-hero text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Alugue Sua Máquina</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
              Transforme seus equipamentos agrícolas em fonte de renda. 
              Cadastre suas máquinas e conecte-se com produtores da sua região.
            </p>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Por que prestar serviços no FieldMachine?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <Card className="text-center">
                  <CardContent className="p-8">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Renda Extra</h3>
                    <p className="text-sm text-muted-foreground">
                      Monetize equipamentos ociosos e gere renda adicional
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="text-center">
                  <CardContent className="p-8">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Segurança Total</h3>
                    <p className="text-sm text-muted-foreground">
                      Todos os aluguéis são cobertos por seguro completo
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="text-center">
                  <CardContent className="p-8">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Rede de Contatos</h3>
                    <p className="text-sm text-muted-foreground">
                      Conecte-se com outros produtores e expanda sua rede
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Registration Form */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center text-2xl">Cadastre Seu Equipamento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="machine-name">Nome da Máquina *</Label>
                      <Input id="machine-name" placeholder="Ex: Trator New Holland T7" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="brand">Marca *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar marca" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="john-deere">John Deere</SelectItem>
                          <SelectItem value="new-holland">New Holland</SelectItem>
                          <SelectItem value="case">Case IH</SelectItem>
                          <SelectItem value="massey">Massey Ferguson</SelectItem>
                          <SelectItem value="valtra">Valtra</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoria *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="trator">Trator</SelectItem>
                          <SelectItem value="colheitadeira">Colheitadeira</SelectItem>
                          <SelectItem value="pulverizador">Pulverizador</SelectItem>
                          <SelectItem value="plantadeira">Plantadeira</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="year">Ano *</Label>
                      <Input id="year" placeholder="Ex: 2020" type="number" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="power">Potência (CV)</Label>
                      <Input id="power" placeholder="Ex: 180" type="number" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Localização *</Label>
                      <Input id="location" placeholder="Cidade, Estado" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Preço por Hora (R$) *</Label>
                    <Input id="price" placeholder="Ex: 250" type="number" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição do Equipamento</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Descreva o estado, características especiais e informações importantes sobre sua máquina"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Fotos do Equipamento *</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-2">
                        Clique para fazer upload ou arraste as fotos aqui
                      </p>
                      <p className="text-sm text-muted-foreground">
                        PNG, JPG até 10MB (máximo 8 fotos)
                      </p>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-primary" size="lg">
                    Cadastrar Equipamento
                  </Button>

                  <p className="text-sm text-muted-foreground text-center">
                    Após o cadastro, nossa equipe verificará as informações em até 24 horas
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Histórias de Sucesso</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="font-bold text-primary">JS</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">João Silva</h3>
                        <p className="text-sm text-muted-foreground">Produtor de Soja - MT</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      "Em 6 meses no FieldMachine já gerei R$ 45.000 alugando meu trator. 
                      A plataforma é segura e os pagamentos sempre em dia."
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="font-bold text-primary">MS</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">Maria Santos</h3>
                        <p className="text-sm text-muted-foreground">Proprietária de Colheitadeira - RS</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      "Consegui maximizar o uso da minha colheitadeira. Agora ela trabalha 
                      o ano todo e paga as próprias parcelas!"
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default RentMyMachine;