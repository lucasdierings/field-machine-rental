import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Tractor, Combine, Droplets, ArrowRight } from "lucide-react";

const categories = [
  {
    id: "tratores",
    name: "Tratores",
    icon: Tractor,
    description: "Tratores de alta potência para todas as necessidades",
    count: "45+ disponíveis",
    color: "from-green-500 to-green-600"
  },
  {
    id: "pulverizadores", 
    name: "Pulverizadores",
    icon: Droplets,
    description: "Equipamentos para aplicação de defensivos",
    count: "28+ disponíveis",
    color: "from-blue-500 to-blue-600"
  },
  {
    id: "colheitadeiras",
    name: "Colheitadeiras", 
    icon: Combine,
    description: "Máquinas para colheita eficiente",
    count: "18+ disponíveis",
    color: "from-yellow-500 to-orange-500"
  },
  {
    id: "caminhoes",
    name: "Caminhões",
    icon: Truck,
    description: "Transporte e logística para sua safra",
    count: "32+ disponíveis", 
    color: "from-red-500 to-red-600"
  }
];

export const CategorySection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Categorias de Equipamentos
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Encontre a máquina perfeita para sua operação agrícola
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card 
                key={category.id}
                className="group hover:shadow-card transition-all duration-300 cursor-pointer border-0 bg-gradient-card"
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-20 h-20 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {category.name}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-3">
                    {category.description}
                  </p>
                  
                  <p className="text-primary font-semibold text-sm mb-4">
                    {category.count}
                  </p>

                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
                  >
                    Ver Equipamentos
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Implementos Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center text-foreground mb-8">
            Implementos Agrícolas
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center p-6 bg-gradient-card border-0">
              <div className="w-16 h-16 bg-accent rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h4 className="font-semibold text-foreground mb-2">Plantio</h4>
              <p className="text-sm text-muted-foreground">Implementos para plantio e semeadura</p>
            </Card>

            <Card className="text-center p-6 bg-gradient-card border-0">
              <div className="w-16 h-16 bg-accent rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚜</span>
              </div>
              <h4 className="font-semibold text-foreground mb-2">Preparação do Solo</h4>
              <p className="text-sm text-muted-foreground">Arados, grades e subsoladores</p>
            </Card>

            <Card className="text-center p-6 bg-gradient-card border-0">
              <div className="w-16 h-16 bg-accent rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💧</span>
              </div>
              <h4 className="font-semibold text-foreground mb-2">Pulverização</h4>
              <p className="text-sm text-muted-foreground">Barras e bicos para aplicação</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};