import { MachineCard, type Machine } from "@/components/ui/machine-card";
import { useState, useEffect } from "react";
import { type FilterValues } from "@/components/ui/advanced-filters";

// Mock data - em uma aplicação real viria de uma API
const mockMachines: Machine[] = [
  {
    id: "1",
    name: "Trator New Holland T7.260",
    brand: "New Holland",
    year: 2022,
    power: "260 CV",
    category: "Tratores",
    location: "Sorriso, MT",
    rating: 4.8,
    reviews: 24,
    rate: 850,
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop",
    availability: "Disponível",
    owner: "Fazenda Santa Rita",
    servicesCompleted: 127,
    chargeType: "hora",
    comments: ["Excelente máquina, sempre pontual nos serviços", "Muito profissional"],
    verified: true,
    workWidth: 12,
    tankCapacity: 3000
  },
  {
    id: "2", 
    name: "Pulverizador Jacto Uniport 3030",
    brand: "Jacto",
    year: 2021,
    power: "380 CV",
    category: "Pulverizadores",
    location: "Primavera do Leste, MT",
    rating: 4.9,
    reviews: 31,
    rate: 180,
    image: "https://images.unsplash.com/photo-1574263867128-a3d5c1b1debc?w=400&h=300&fit=crop",
    availability: "Disponível",
    owner: "AgroTech Equipamentos",
    servicesCompleted: 89,
    chargeType: "hectare",
    comments: ["Aplicação perfeita, recomendo", "Equipamento top de linha"],
    verified: true,
    workWidth: 18,
    tankCapacity: 3500
  },
  {
    id: "3",
    name: "Colheitadeira Case IH 9240",
    brand: "Case IH", 
    year: 2023,
    power: "435 CV",
    category: "Colheitadeiras",
    location: "Rio Verde, GO",
    rating: 4.7,
    reviews: 18,
    rate: 320,
    image: "https://images.unsplash.com/photo-1581578949510-fa7315c4c350?w=400&h=300&fit=crop",
    availability: "Disponível",
    owner: "Grupo Agro Cerrado",
    servicesCompleted: 45,
    chargeType: "hectare",
    comments: ["Colheita rápida e eficiente"],
    verified: true,
    workWidth: 9,
    tankCapacity: 8000
  },
  {
    id: "4",
    name: "Caminhão Scania R 450",
    brand: "Scania",
    year: 2020,
    power: "450 CV",
    category: "Caminhões",
    location: "Cuiabá, MT",
    rating: 4.6,
    reviews: 42,
    rate: 750,
    image: "https://images.unsplash.com/photo-1605548146838-9f863b57b5ad?w=400&h=300&fit=crop",
    availability: "Ocupado até 15/12",
    owner: "Transportes Agro Sul",
    servicesCompleted: 203,
    chargeType: "hora",
    comments: ["Motorista experiente, entrega no prazo", "Caminhão em excelente estado"],
    verified: false,
    workWidth: 0,
    tankCapacity: 0
  },
  {
    id: "5",
    name: "Trator John Deere 6155R",
    brand: "John Deere",
    year: 2021,
    power: "155 CV",
    category: "Tratores", 
    location: "Campo Grande, MS",
    rating: 4.8,
    reviews: 27,
    rate: 620,
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop",
    availability: "Disponível",
    owner: "Fazenda Boa Vista",
    servicesCompleted: 156,
    chargeType: "hora",
    comments: ["Serviço de qualidade, pontual"],
    verified: true,
    workWidth: 8,
    tankCapacity: 2500
  },
  {
    id: "6",
    name: "Pulverizador Montana Parruda 3027",
    brand: "Montana",
    year: 2022,
    power: "350 CV",
    category: "Pulverizadores",
    location: "Sapezal, MT",
    rating: 4.9,
    reviews: 15,
    rate: 165,
    image: "https://images.unsplash.com/photo-1574263867128-a3d5c1b1debc?w=400&h=300&fit=crop",
    availability: "Disponível", 
    owner: "Soja Tech Ltda",
    servicesCompleted: 73,
    chargeType: "hectare",
    comments: ["Aplicação uniforme, resultado excelente"],
    verified: true,
    workWidth: 24,
    tankCapacity: 4000
  }
];

interface MachineGridProps {
  searchFilters?: FilterValues & {
    location?: string;
    startDate?: Date;
    endDate?: Date;
    time?: string;
    category?: string;
    culture?: string;
    operation?: string;
  };
}

export const MachineGrid = ({ searchFilters }: MachineGridProps) => {
  const [filteredMachines, setFilteredMachines] = useState<Machine[]>(mockMachines);

  useEffect(() => {
    if (!searchFilters) {
      setFilteredMachines(mockMachines);
      return;
    }

    let filtered = mockMachines.filter((machine) => {
      // Filtro de preço
      if (searchFilters.priceRange) {
        const [minPrice, maxPrice] = searchFilters.priceRange;
        if (machine.rate < minPrice || machine.rate > maxPrice) {
          return false;
        }
      }

      // Filtro de categoria
      if (searchFilters.category && searchFilters.category !== "Todas as categorias") {
        if (machine.category !== searchFilters.category) {
          return false;
        }
      }

      // Filtro de potência
      if (searchFilters.powerRange && searchFilters.powerRange !== "Todas") {
        const machinePower = parseInt(machine.power.replace(/\D/g, ''));
        switch (searchFilters.powerRange) {
          case "100-200":
            if (machinePower < 100 || machinePower > 200) return false;
            break;
          case "200-300":
            if (machinePower < 200 || machinePower > 300) return false;
            break;
          case "300-400":
            if (machinePower < 300 || machinePower > 400) return false;
            break;
          case "400+":
            if (machinePower < 400) return false;
            break;
        }
      }

      // Filtro de ano
      if (searchFilters.yearRange) {
        const [minYear, maxYear] = searchFilters.yearRange;
        if (machine.year < minYear || machine.year > maxYear) {
          return false;
        }
      }

      // Filtro de avaliação
      if (searchFilters.minRating && machine.rating < searchFilters.minRating) {
        return false;
      }

      // Filtro de serviços mínimos
      if (searchFilters.minServices && machine.servicesCompleted < searchFilters.minServices) {
        return false;
      }

      // Filtro de verificados
      if (searchFilters.verifiedOnly && !machine.verified) {
        return false;
      }

      // Filtros específicos por cultura
      if (searchFilters.workWidth && machine.workWidth) {
        const [minWidth, maxWidth] = searchFilters.workWidth;
        if (machine.workWidth < minWidth || machine.workWidth > maxWidth) {
          return false;
        }
      }

      if (searchFilters.tankCapacity && machine.tankCapacity) {
        const [minCapacity, maxCapacity] = searchFilters.tankCapacity;
        if (machine.tankCapacity < minCapacity || machine.tankCapacity > maxCapacity) {
          return false;
        }
      }

      return true;
    });

    setFilteredMachines(filtered);
  }, [searchFilters]);
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Equipamentos Disponíveis
          </h2>
          <p className="text-lg text-muted-foreground">
            Máquinas verificadas e prontas para uso
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMachines.map((machine) => (
            <MachineCard key={machine.id} machine={machine} />
          ))}
        </div>

        {filteredMachines.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg mb-2">
              Nenhuma máquina encontrada
            </div>
            <p className="text-sm text-muted-foreground">
              Tente ajustar seus filtros para encontrar mais opções
            </p>
          </div>
        )}

        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            Ver Todos os Equipamentos
          </button>
        </div>
      </div>
    </section>
  );
};