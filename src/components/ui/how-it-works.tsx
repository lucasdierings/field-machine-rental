import { Search, MessageCircle, CheckCircle, FileText, DollarSign, Shield } from "lucide-react";

const locatarioSteps = [
  {
    icon: Search,
    title: "Busque",
    description: "Encontre máquinas próximas à sua propriedade"
  },
  {
    icon: MessageCircle,
    title: "Negocie", 
    description: "Chat direto com proprietário para ajustar detalhes"
  },
  {
    icon: CheckCircle,
    title: "Reserve",
    description: "Pagamento seguro e contrato digital"
  }
];

const proprietarioSteps = [
  {
    icon: FileText,
    title: "Cadastre",
    description: "Anuncie gratuitamente suas máquinas"
  },
  {
    icon: DollarSign,
    title: "Rentabilize",
    description: "Equipamento parado gera renda extra"
  },
  {
    icon: Shield,
    title: "Segurança",
    description: "Seguro e garantias incluídos"
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Como Funciona o FieldMachine
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Plataforma simples e segura para conectar produtores e proprietários de máquinas
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Para Locatários */}
          <div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-primary mb-2">Para Produtores</h3>
              <p className="text-muted-foreground">Encontre e alugue máquinas facilmente</p>
            </div>
            
            <div className="space-y-6">
              {locatarioSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <step.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">{step.title}</h4>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Para Proprietários */}
          <div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-primary mb-2">Para Proprietários</h3>
              <p className="text-muted-foreground">Monetize suas máquinas paradas</p>
            </div>
            
            <div className="space-y-6">
              {proprietarioSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <step.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">{step.title}</h4>
                    <p className="text-muted-foreground">{step.description}</p>
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