import { Search, UserCheck, Handshake, Star } from "lucide-react";

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
      icon: Handshake,
      title: "3. Combine",
      description: "Negocie valores e acertem diretamente"
    },
    {
      icon: Star,
      title: "4. Avalie",
      description: "Avalie o serviço, operador, máquina e cliente"
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 text-foreground">
            Como Funciona
          </h2>
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Processo simples e direto para conectar produtores e prestadores de serviço
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 relative">
          {/* Connecting lines for desktop */}
          <div className="hidden md:block absolute top-1/4 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20"
               style={{ top: "60px" }} />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <div className="bg-card border border-border rounded-lg p-4 md:p-6 text-center hover:border-primary/50 transition-all hover:shadow-glow">
                  <div className="w-14 h-14 md:w-20 md:h-20 mx-auto mb-3 md:mb-4 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center relative z-10">
                    <Icon className="w-7 h-7 md:w-10 md:h-10 text-primary" />
                  </div>
                  <h3 className="text-base md:text-xl font-semibold mb-1 md:mb-2 text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-xs md:text-base text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
