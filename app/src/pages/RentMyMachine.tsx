import { useNavigate } from "react-router-dom";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Shield, Users, ArrowRight, Tractor } from "lucide-react";
import { SEO } from "@/components/SEO";

const RentMyMachine = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Anunciar Serviços Agrícolas e Aluguel de Máquinas"
        description="Anuncie seus serviços e máquinas agrícolas para milhares de produtores. Aumente sua renda prestando serviços rurais com segurança."
        canonical="/oferecer-servicos"
      />
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

        {/* CTA to Register Machine */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-lg mx-auto text-center">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-10">
                  <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Tractor className="h-10 w-10 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">Pronto para começar?</h2>
                  <p className="text-muted-foreground mb-6">
                    Cadastre seu equipamento em poucos minutos e comece a receber solicitações de produtores da sua região.
                  </p>
                  <Button
                    className="w-full bg-gradient-primary"
                    size="lg"
                    onClick={() => navigate("/add-machine")}
                  >
                    Cadastrar Equipamento
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <p className="text-xs text-muted-foreground mt-3">
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