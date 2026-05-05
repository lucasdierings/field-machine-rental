import { Header } from "@/components/ui/header";
import { EnhancedFooter } from "@/components/ui/enhanced-footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Tractor, Users, MapPin, Target, Sprout, Shield } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Sobre Nós"
        description="Saiba mais sobre a FieldMachine e nossa missão de conectar produtores rurais a máquinas agrícolas no Paraná."
        canonical="/sobre"
      />
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24 max-w-5xl">
        {/* Hero */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Conectando o campo à tecnologia
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A FieldMachine nasceu para democratizar o acesso a máquinas agrícolas
            no Brasil, conectando quem precisa a quem tem.
          </p>
        </section>

        {/* Mission */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6 flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Nossa Missão</h2>
                  <p className="text-muted-foreground">
                    Democratizar o acesso a máquinas e serviços agrícolas no Brasil,
                    permitindo que pequenos e médios produtores rurais tenham acesso
                    à mesma tecnologia disponível para grandes propriedades, sem a
                    necessidade de investimentos milionários.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Sprout className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Nossa Visão</h2>
                  <p className="text-muted-foreground">
                    Ser a principal plataforma de compartilhamento de máquinas
                    agrícolas do Brasil, transformando a forma como o agronegócio
                    opera e promovendo o uso eficiente de recursos no campo.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Origin Story */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Como nascemos</h2>
          <Card>
            <CardContent className="p-8">
              <p className="text-muted-foreground text-lg leading-relaxed">
                A FieldMachine nasceu da necessidade real de produtores rurais no
                Paraná. Percebemos que milhares de máquinas agrícolas ficam
                paradas boa parte do ano, enquanto produtores vizinhos não
                conseguem investir em equipamentos próprios. Criamos uma plataforma
                que resolve esse problema: conectamos quem tem máquinas disponíveis
                com quem precisa delas, de forma rápida, segura e acessível.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mt-4">
                Somos uma startup paranaense focada no agronegócio brasileiro,
                nascida no campo e desenvolvida com tecnologia de ponta para
                atender as necessidades reais do produtor rural.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Numbers */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">
            FieldMachine em números
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Tractor className="h-6 w-6 text-primary" />
                </div>
                <p className="text-3xl font-bold text-primary">50+</p>
                <p className="text-muted-foreground">Máquinas cadastradas</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <p className="text-3xl font-bold text-primary">10+</p>
                <p className="text-muted-foreground">Cidades atendidas</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <p className="text-3xl font-bold text-primary">100+</p>
                <p className="text-muted-foreground">Produtores conectados</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Nossos valores</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Confiança</h3>
                <p className="text-sm text-muted-foreground">
                  Verificação de identidade, avaliações transparentes e
                  comunicação segura entre todos os usuários da plataforma.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Comunidade</h3>
                <p className="text-sm text-muted-foreground">
                  Acreditamos que o compartilhamento de recursos fortalece toda
                  a cadeia produtiva e gera oportunidades para todos.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <Sprout className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Sustentabilidade</h3>
                <p className="text-sm text-muted-foreground">
                  Otimizar o uso de máquinas reduz custos, desperdício e o
                  impacto ambiental da produção agrícola.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <EnhancedFooter />
    </div>
  );
};

export default About;
