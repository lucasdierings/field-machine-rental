import { Search, MessageCircle, Handshake, Star, FileText, Users, TrendingUp } from "lucide-react";

const locatarioSteps = [
  {
    icon: Search,
    title: "Busque",
    description: "Encontre máquinas próximas à sua propriedade"
  },
  {
    icon: MessageCircle,
    title: "Negocie",
    description: "Chat direto com o proprietário para combinar valores e detalhes"
  },
  {
    icon: Handshake,
    title: "Acerte Direto",
    description: "Combine o pagamento entre vocês — sem intermediários"
  },
  {
    icon: Star,
    title: "Avalie",
    description: "Avalie o serviço, o operador e a máquina para ajudar a comunidade"
  }
];

const proprietarioSteps = [
  {
    icon: FileText,
    title: "Cadastre",
    description: "Anuncie gratuitamente suas máquinas e serviços"
  },
  {
    icon: Users,
    title: "Conecte-se",
    description: "Receba solicitações de produtores da sua região"
  },
  {
    icon: TrendingUp,
    title: "Rentabilize",
    description: "Equipamento parado gerando renda — sem taxas da plataforma"
  },
  {
    icon: Star,
    title: "Construa Reputação",
    description: "Boas avaliações atraem mais clientes para seus serviços"
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
            Como Funciona o FieldMachine
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Conecte-se diretamente com a comunidade agrícola. Sem taxas, sem complicação.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 md:gap-16">
          {/* Para Locatários */}
          <div>
            <div className="text-center mb-6 md:mb-8">
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-2">Para Produtores</h3>
              <p className="text-sm md:text-base text-muted-foreground">Encontre e contrate serviços facilmente</p>
            </div>

            <div className="space-y-4 md:space-y-6">
              {locatarioSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-11 h-11 md:w-12 md:h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <step.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-base md:text-lg font-semibold mb-1">{step.title}</h4>
                    <p className="text-sm md:text-base text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Para Proprietários */}
          <div>
            <div className="text-center mb-6 md:mb-8">
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-2">Para Prestadores de Serviço</h3>
              <p className="text-sm md:text-base text-muted-foreground">Monetize suas máquinas e ofereça seus serviços</p>
            </div>

            <div className="space-y-4 md:space-y-6">
              {proprietarioSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-11 h-11 md:w-12 md:h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <step.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-base md:text-lg font-semibold mb-1">{step.title}</h4>
                    <p className="text-sm md:text-base text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
