import { Link } from "react-router-dom";
import { SERVICE_CATEGORIES } from "@/data/categories";

// Showcase images — using high-quality agricultural Unsplash photos
const SHOWCASE_IMAGES: Record<string, string> = {
  tratores: "https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=1000&auto=format&fit=crop",
  colheitadeiras: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000&auto=format&fit=crop",
  pulverizadores: "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=1000&auto=format&fit=crop",
  plantio: "https://images.unsplash.com/photo-1530267981375-f0de93ebf579?q=80&w=1000&auto=format&fit=crop",
  drones: "https://images.unsplash.com/photo-1508614589041-895b8c9d7418?q=80&w=1000&auto=format&fit=crop",
  transporte: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=1000&auto=format&fit=crop",
};

// Only show top 6 most relevant categories in the homepage showcase
const SHOWCASE_IDS = ["tratores", "colheitadeiras", "pulverizadores", "plantio", "drones", "transporte"];

export const CategoriesShowcase = () => {
  const showcaseCategories = SERVICE_CATEGORIES.filter(c => SHOWCASE_IDS.includes(c.id));

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Principais Serviços
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Encontre o serviço agrícola ideal para sua operação
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {showcaseCategories.map((category) => (
            <Link
              key={category.id}
              to={`/servicos-agricolas?categoria=${category.slug}`}
              className="group block"
            >
              <div className="bg-card rounded-2xl overflow-hidden shadow-elegant hover:shadow-hero transition-all duration-300 transform hover:-translate-y-2">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={SHOWCASE_IMAGES[category.id] || SHOWCASE_IMAGES.tratores}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className={`absolute top-3 left-3 ${category.color} rounded-lg p-2`}>
                    <category.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {category.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Link to all categories */}
        <div className="text-center mt-10">
          <Link
            to="/servicos"
            className="text-primary hover:underline font-medium"
          >
            Ver todas as {SERVICE_CATEGORIES.length} categorias →
          </Link>
        </div>
      </div>
    </section>
  );
};
