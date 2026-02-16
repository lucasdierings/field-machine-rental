import { Link } from "react-router-dom";
import johnDeereTractor from "@/assets/john-deere-tractor-real.jpg"; // Keep if exists, otherwise fallback to external URL in component
import newHollandColheitadeira from "@/assets/new-holland-colheitadeira.jpg";
import casePulverizador from "@/assets/case-pulverizador.jpg";
import valtraPlantadeira from "@/assets/valtra-plantadeira.jpg";
import implementosAgricolas from "@/assets/implementos-agricolas.jpg";
import transporteCarga from "@/assets/transporte-carga.jpg";

// Using Unsplash images for realistic look if local assets are missing/placeholders
const tractorImg = "https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=1000&auto=format&fit=crop";
const harvesterImg = "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000&auto=format&fit=crop";
const sprayerImg = "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=1000&auto=format&fit=crop";
const planterImg = "https://images.unsplash.com/photo-1530267981375-f0de93ebf579?q=80&w=1000&auto=format&fit=crop"; // Generic farm field
const backhoeImg = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1000&auto=format&fit=crop";
const droneImg = "https://images.unsplash.com/photo-1508614589041-895b8c9d7418?q=80&w=1000&auto=format&fit=crop";


const categories = [
  {
    title: "Tratores",
    description: "Potência e versatilidade para todas as operações",
    image: tractorImg,
    brand: "Varid",
    link: "/buscar?categoria=tratores"
  },
  {
    title: "Colheitadeiras",
    description: "Eficiência na colheita de grãos",
    image: harvesterImg,
    brand: "New Holland",
    link: "/buscar?categoria=colheitadeiras"
  },
  {
    title: "Pulverizadores",
    description: "Aplicação precisa de defensivos",
    image: sprayerImg,
    brand: "Case IH",
    link: "/buscar?categoria=pulverizadores"
  },
  {
    title: "Retroescavadeiras",
    description: "Serviços de terraplanagem e escavação",
    image: backhoeImg,
    brand: "CAT / JCB",
    link: "/buscar?categoria=retroescavadeiras"
  },
  {
    title: "Drones Agrícolas",
    description: "Pulverização aérea e mapeamento",
    image: droneImg,
    brand: "DJI / XAG",
    link: "/buscar?categoria=drones"
  },
  {
    title: "Transporte de Cargas",
    description: "Caminhões, carretas e bitrens",
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=1000&auto=format&fit=crop",
    brand: "Diversos",
    link: "/buscar?categoria=transporte-de-cargas"
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