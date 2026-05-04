import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { CategorySection } from "@/components/ui/category-section";
import { SEO } from "@/components/SEO";

const Categories = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Categorias de Serviços e Máquinas Agrícolas"
        description="Explore todas as categorias de serviços e aluguel de máquinas agrícolas. Tratores, colheitadeiras, pulverizadores, drones e muito mais."
        canonical="/servicos"
      />
      <Header />
      <main className="pt-16">
        {/* Page Header */}
        <section className="py-12 bg-gradient-hero text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Serviços e Operações Agrícolas</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Encontre prestadores de serviço para cada etapa da sua produção
            </p>
          </div>
        </section>

        {/* Categories Grid */}
        <CategorySection />
      </main>
      <Footer />
    </div>
  );
};

export default Categories;
