import { Search, UserCheck, Tractor, CheckCircle } from "lucide-react";

export const ProcessFlow = () => {
  const steps = [
    {
      icon: Search,
      title: "1. Busque",
      description: "Encontre a máquina ideal para sua necessidade"
    },
    {
      icon: UserCheck,
      title: "2. Conecte",
      description: "Entre em contato direto com o prestador"
    },
    {
      icon: Tractor,
      title: "3. Contrate",
      description: "Agende e receba o equipamento"
    },
    {
      icon: CheckCircle,
      title: "4. Trabalhe",
      description: "Realize o serviço e avalie"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            Como Funciona
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Processo simples e direto para conectar produtores e prestadores de serviço
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connecting lines for desktop */}
          <div className="hidden md:block absolute top-1/4 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" 
               style={{ top: "60px" }} />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <div className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary/50 transition-all hover:shadow-glow">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center relative z-10">
                    <Icon className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                
                {/* Arrow for mobile */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center my-4">
                    <div className="w-0.5 h-8 bg-gradient-to-b from-primary to-primary/20" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
