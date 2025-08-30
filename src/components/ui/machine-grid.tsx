import { MachineCard, type Machine } from "@/components/ui/machine-card";

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
    pricePerDay: 850,
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop",
    availability: "Disponível",
    owner: "Fazenda Santa Rita",
    servicesCompleted: 127,
    chargeType: "hora",
    comments: ["Excelente máquina, sempre pontual nos serviços", "Muito profissional"]
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
    pricePerDay: 180,
    image: "https://images.unsplash.com/photo-1574263867128-a3d5c1b1debc?w=400&h=300&fit=crop",
    availability: "Disponível",
    owner: "AgroTech Equipamentos",
    servicesCompleted: 89,
    chargeType: "hectare",
    comments: ["Aplicação perfeita, recomendo", "Equipamento top de linha"]
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
    pricePerDay: 320,
    image: "https://images.unsplash.com/photo-1581578949510-fa7315c4c350?w=400&h=300&fit=crop",
    availability: "Disponível",
    owner: "Grupo Agro Cerrado",
    servicesCompleted: 45,
    chargeType: "hectare",
    comments: ["Colheita rápida e eficiente"]
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
    pricePerDay: 750,
    image: "https://images.unsplash.com/photo-1605548146838-9f863b57b5ad?w=400&h=300&fit=crop",
    availability: "Ocupado até 15/12",
    owner: "Transportes Agro Sul",
    servicesCompleted: 203,
    chargeType: "hora",
    comments: ["Motorista experiente, entrega no prazo", "Caminhão em excelente estado"]
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
    pricePerDay: 620,
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop",
    availability: "Disponível",
    owner: "Fazenda Boa Vista",
    servicesCompleted: 156,
    chargeType: "hora",
    comments: ["Serviço de qualidade, pontual"]
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
    pricePerDay: 165,
    image: "https://images.unsplash.com/photo-1574263867128-a3d5c1b1debc?w=400&h=300&fit=crop",
    availability: "Disponível", 
    owner: "Soja Tech Ltda",
    servicesCompleted: 73,
    chargeType: "hectare",
    comments: ["Aplicação uniforme, resultado excelente"]
  }
];

export const MachineGrid = () => {
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
          {mockMachines.map((machine) => (
            <MachineCard key={machine.id} machine={machine} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            Ver Todos os Equipamentos
          </button>
        </div>
      </div>
    </section>
  );
};