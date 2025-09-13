import { Link } from "react-router-dom";
import johnDeereTractor from "@/assets/john-deere-tractor.jpg";
import combineHarvester from "@/assets/combine-harvester.jpg";
import pulverizador from "@/assets/pulverizador.jpg";
import plantadeira from "@/assets/plantadeira.jpg";
import implementos from "@/assets/implementos.jpg";

const categories = [
  {
    title: "Tratores",
    description: "Potência e versatilidade para todas as operações",
    image: johnDeereTractor,
    link: "/buscar?categoria=tratores"
  },
  {
    title: "Colheitadeiras", 
    description: "Eficiência na colheita de grãos",
    image: combineHarvester,
    link: "/buscar?categoria=colheitadeiras"
  },
  {
    title: "Pulverizadores",
    description: "Aplicação precisa de defensivos",
    image: pulverizador,
    link: "/buscar?categoria=pulverizadores"
  },
  {
    title: "Plantadeiras",
    description: "Plantio uniforme e eficiente", 
    image: plantadeira,
    link: "/buscar?categoria=plantadeiras"
  },
  {
    title: "Implementos",
    description: "Preparo do solo e cultivo",
    image: implementos,
    link: "/buscar?categoria=implementos"
  }
];

export const CategoriesShowcase = () => {
  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Categorias Principais
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Encontre exatamente o equipamento que precisa para sua operação
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={category.link}
              className="group block"
            >
              <div className="bg-card rounded-2xl overflow-hidden shadow-elegant hover:shadow-hero transition-all duration-300 transform hover:-translate-y-2">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};