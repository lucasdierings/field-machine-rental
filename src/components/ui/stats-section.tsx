import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";

const stats = [
  {
    number: 347,
    suffix: "+",
    label: "Máquinas disponíveis",
    description: "Equipamentos verificados"
  },
  {
    number: 1847,
    suffix: "+", 
    label: "Produtores cadastrados",
    description: "Rede confiável"
  },
  {
    number: 96,
    suffix: "%",
    label: "Satisfação",
    description: "Clientes satisfeitos"
  },
  {
    number: 2.7,
    suffix: "M+",
    prefix: "R$ ",
    label: "Economizados",
    description: "Para nossos usuários"
  }
];

export const StatsSection = () => {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Números que Comprovam Nossa Confiabilidade
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Milhares de produtores já confiam no FieldMachine para suas necessidades agrícolas
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-card rounded-2xl p-8 shadow-elegant hover:shadow-hero transition-shadow duration-300">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {inView ? (
                    <>
                      {stat.prefix}
                      <CountUp
                        end={stat.number}
                        duration={2.5}
                        delay={index * 0.2}
                      />
                      {stat.suffix}
                    </>
                  ) : (
                    `${stat.prefix || ""}0${stat.suffix}`
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-1">{stat.label}</h3>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};