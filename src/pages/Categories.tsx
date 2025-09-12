import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { CategorySection } from "@/components/ui/category-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Categories = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Page Header */}
        <section className="py-12 bg-gradient-hero text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Categorias de Equipamentos</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Encontre o equipamento agrícola ideal para sua operação
            </p>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <CategorySection />
          </div>
        </section>

        {/* Additional Information */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Por que escolher equipamentos por categoria?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Nossa plataforma organiza os equipamentos em categorias específicas para facilitar sua busca. 
                    Cada categoria agrupa máquinas com funções similares, permitindo comparar modelos, 
                    especificações e preços de forma mais eficiente.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div>
                      <h3 className="font-semibold mb-2">🚜 Tratores</h3>
                      <p className="text-sm text-muted-foreground">
                        Equipamentos versáteis para diversas operações agrícolas
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">🌾 Colheitadeiras</h3>
                      <p className="text-sm text-muted-foreground">
                        Máquinas especializadas para colheita de grãos
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">💧 Pulverizadores</h3>
                      <p className="text-sm text-muted-foreground">
                        Equipamentos para aplicação de defensivos e fertilizantes
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">🌱 Plantadeiras</h3>
                      <p className="text-sm text-muted-foreground">
                        Máquinas para plantio e semeadura precisa
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Categories;