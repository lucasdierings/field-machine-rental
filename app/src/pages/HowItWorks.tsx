import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Star, MessageCircle, Handshake, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "1. Busque o Equipamento",
      description: "Use nossos filtros avançados para encontrar a máquina ideal para sua operação na sua região."
    },
    {
      icon: MessageCircle,
      title: "2. Negocie Diretamente",
      description: "Converse com o proprietário, combine valores, condições e detalhes do serviço direto na plataforma."
    },
    {
      icon: Handshake,
      title: "3. Acerte entre Vocês",
      description: "O pagamento é combinado diretamente entre as partes, sem intermediários. Simples como no BlaBlaCar."
    },
    {
      icon: Star,
      title: "4. Avalie a Experiência",
      description: "Após o serviço, avalie o operador, a máquina e o serviço. Ajude a comunidade com seu feedback."
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <SEO
        title="Como Funciona o FieldMachine - Aluguel de Máquinas Sem Taxas"
        description="Entenda como funciona o FieldMachine. Conectamos produtores e prestadores de serviços agrícolas sem cobrar taxas ou comissões."
        canonical="/como-funciona"
      />
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-12 md:py-16 bg-gradient-hero text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">Como Funciona</h1>
            <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto mb-4">
              Conectamos produtores rurais com proprietários de equipamentos agrícolas
              de forma simples e direta — sem intermediários no pagamento.
            </p>
            <p className="text-base md:text-lg opacity-80 max-w-2xl mx-auto">
              Assim como no BlaBlaCar, os valores são combinados na plataforma,
              mas o acerto é feito diretamente entre vocês.
            </p>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
                {steps.map((step, index) => (
                  <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 md:p-8">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg shrink-0">
                          <step.icon className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">{step.title}</h3>
                          <p className="text-sm md:text-base text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Peer-to-Peer Section */}
        <section className="py-12 md:py-16 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
                <Handshake className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">Modelo Peer-to-Peer</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
                Pagamento Direto entre as Partes
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 md:mb-10">
                Não cobramos comissão sobre o serviço. A plataforma existe para conectar vocês.
                O preço é referência — vocês combinam o valor final e acertam como preferirem:
                PIX, dinheiro, transferência.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
                <div className="bg-background rounded-xl p-6 shadow-sm">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-green-700">0%</span>
                  </div>
                  <h3 className="font-semibold mb-2">Sem Taxas</h3>
                  <p className="text-sm text-muted-foreground">
                    Zero comissão sobre o serviço. O valor combinado é todo seu.
                  </p>
                </div>

                <div className="bg-background rounded-xl p-6 shadow-sm">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-7 w-7 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Negociação Livre</h3>
                  <p className="text-sm text-muted-foreground">
                    Converse diretamente e combine valores que funcionem para ambos.
                  </p>
                </div>

                <div className="bg-background rounded-xl p-6 shadow-sm">
                  <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-7 w-7 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Comunidade</h3>
                  <p className="text-sm text-muted-foreground">
                    Avaliações reais garantem confiança entre as partes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Vantagens do FieldMachine</h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
                <div className="text-center">
                  <div className="bg-primary/10 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl md:text-2xl">💰</span>
                  </div>
                  <h3 className="font-semibold mb-2">Economia</h3>
                  <p className="text-sm text-muted-foreground">
                    Sem taxas na plataforma. Negocie diretamente o melhor preço.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-primary/10 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl md:text-2xl">⏰</span>
                  </div>
                  <h3 className="font-semibold mb-2">Agilidade</h3>
                  <p className="text-sm text-muted-foreground">
                    Encontre equipamentos disponíveis na sua região rapidamente.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-primary/10 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl md:text-2xl">⭐</span>
                  </div>
                  <h3 className="font-semibold mb-2">Confiança</h3>
                  <p className="text-sm text-muted-foreground">
                    Avaliações detalhadas do serviço, operador, máquina e cliente.
                  </p>
                </div>
              </div>

              <Button size="lg" className="bg-gradient-primary w-full sm:w-auto" asChild>
                <Link to="/servicos-agricolas">Começar Agora</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Perguntas Frequentes</h2>

              <div className="space-y-4 md:space-y-6">
                <Card>
                  <CardContent className="p-5 md:p-6">
                    <h3 className="font-semibold mb-2">Como funciona o pagamento?</h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      O pagamento é combinado diretamente entre você e o proprietário/operador.
                      A plataforma facilita a conexão e a negociação — vocês decidem a forma de pagamento
                      (PIX, dinheiro, transferência, etc.). Não há intermediação financeira.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5 md:p-6">
                    <h3 className="font-semibold mb-2">A plataforma cobra alguma taxa?</h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Não! O FieldMachine é gratuito para uso. Não cobramos comissão
                      sobre os serviços contratados. Nosso objetivo é conectar a comunidade agrícola.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5 md:p-6">
                    <h3 className="font-semibold mb-2">Como garantir que o serviço será bem feito?</h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Nosso sistema de avaliações permite que tanto o contratante quanto o prestador
                      avaliem a experiência. São avaliados: qualidade do serviço, operador, máquina
                      e o próprio cliente. Isso cria uma comunidade de confiança mútua.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5 md:p-6">
                    <h3 className="font-semibold mb-2">Como posso me tornar um prestador de serviço?</h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Cadastre-se na plataforma, complete seu perfil e cadastre suas máquinas.
                      Produtores da sua região poderão encontrar e contratar seus serviços.
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
