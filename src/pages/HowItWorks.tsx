import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Shield, Star } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "1. Busque o Equipamento",
      description: "Use nossos filtros avançados para encontrar a máquina ideal para sua operação"
    },
    {
      icon: Calendar,
      title: "2. Agende o Serviço",
      description: "Escolha datas, horários e negocie diretamente com o proprietário"
    },
    {
      icon: Shield,
      title: "3. Serviço Garantido",
      description: "Todos os equipamentos são verificados e cobertos por seguro"
    },
    {
      icon: Star,
      title: "4. Avalie a Experiência",
      description: "Após o serviço, avalie o proprietário e ajude nossa comunidade"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-hero text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Como Funciona</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
              Conectamos produtores rurais com proprietários de equipamentos agrícolas 
              de forma simples, segura e eficiente
            </p>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {steps.map((step, index) => (
                  <Card key={index} className="relative overflow-hidden">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <step.icon className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                          <p className="text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8">Vantagens do FieldMachine</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💰</span>
                  </div>
                  <h3 className="font-semibold mb-2">Economia</h3>
                  <p className="text-sm text-muted-foreground">
                    Reduza custos evitando a compra de equipamentos caros
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⏰</span>
                  </div>
                  <h3 className="font-semibold mb-2">Agilidade</h3>
                  <p className="text-sm text-muted-foreground">
                    Encontre equipamentos disponíveis na sua região rapidamente
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <h3 className="font-semibold mb-2">Segurança</h3>
                  <p className="text-sm text-muted-foreground">
                    Proprietários verificados e equipamentos segurados
                  </p>
                </div>
              </div>
              
              <Button size="lg" className="bg-gradient-primary">
                Começar Agora
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>
              
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Como funciona o pagamento?</h3>
                    <p className="text-muted-foreground">
                      O pagamento é feito diretamente na plataforma após a conclusão do serviço. 
                      Oferecemos várias opções como PIX, cartão de crédito e boleto.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">E se houver problemas com o equipamento?</h3>
                    <p className="text-muted-foreground">
                      Todos os equipamentos são cobertos por seguro. Em caso de problemas, 
                      nossa equipe de suporte está disponível 24/7 para ajudar.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Como posso me tornar um fornecedor?</h3>
                    <p className="text-muted-foreground">
                      Cadastre-se em nossa plataforma, complete o processo de verificação 
                      e comece a oferecer seus serviços para outros produtores.
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

export default HowItWorks;