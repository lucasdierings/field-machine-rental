import { MachineCard, type Machine } from "@/components/ui/machine-card";
import { useState, useEffect } from "react";
import { type FilterValues } from "@/components/ui/advanced-filters";
import { supabase } from "@/integrations/supabase/client";

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
  const [filteredMachines, setFilteredMachines] = useState<Machine[]>([]);
  const [allMachines, setAllMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMachines();
  }, []);

  const loadMachines = async () => {
    try {
      // Extrair categoria da URL
      const params = new URLSearchParams(window.location.search);
      const categoryParam = params.get('categoria');

      let query = supabase
        .from("machines")
        .select("*")
        .eq("status", "available"); // Apenas disponíveis

      // Filtrar por categoria se houver na URL
      if (categoryParam) {
        const categoryMap: Record<string, string> = {
          'tratores': 'Tratores',
          'colheitadeiras': 'Colheitadeiras',
          'pulverizadores': 'Pulverizadores',
          'plantadeiras': 'Plantadeiras',
          'implementos': 'Implementos',
          'transporte-de-cargas': 'Transporte de Cargas'
        };

        const category = categoryMap[categoryParam];
        if (category) {
          query = query.eq('category', category);
        }
      }

      const { data: machines, error } = await query;

      if (error) {
        if (import.meta.env.DEV) {
          console.error("Error loading machines:", error);
        }
        setAllMachines([]);
        setFilteredMachines([]);
      } else {
        // Transform database machines to match interface
        const transformedMachines = machines.map(machine => ({
          id: machine.id,
          name: machine.name,
          brand: machine.brand || "",
          year: machine.year || new Date().getFullYear(),
          power: (machine.specifications as any)?.power || "N/A",
          category: machine.category,
          location: typeof machine.location === 'object' && machine.location !== null && 'city' in machine.location
            ? `${machine.location.city}, ${machine.location.state}`
            : "Localização não informada",
          rating: 0,
          reviews: 0,
          rate: machine.price_hour || machine.price_day || machine.price_hectare || 0,
          image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop", // Images stored in machine_images table
          availability: "Disponível",
          owner: "Proprietário",
          servicesCompleted: 0,
          chargeType: machine.price_hour ? "hora" as const : machine.price_hectare ? "hectare" as const : "hora" as const,
          comments: [],
          verified: false,
          workWidth: (machine.specifications as any)?.workWidth ? parseFloat((machine.specifications as any).workWidth) : 0,
          tankCapacity: 0,
          anonymous: true
        }));
        setAllMachines(transformedMachines);
        setFilteredMachines(transformedMachines);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error loading machines:", error);
      }
      setAllMachines([]);
      setFilteredMachines([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchFilters) {
      setFilteredMachines(allMachines);
      return;
    }

    let filtered = allMachines.filter((machine) => {
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
  }, [searchFilters, allMachines]);
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

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg h-64 w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMachines.map((machine) => (
              <MachineCard key={machine.id} machine={machine} />
            ))}
          </div>
        )}

        {!loading && filteredMachines.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg mb-4">
              Não há máquinas disponíveis no momento para esta busca.
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Que tal criar um alerta? Avisaremos você assim que um equipamento compatível for cadastrado.
            </p>

            <button
              onClick={async () => {
                const { data: { user } } = await supabase.auth.getUser();
                let email = user?.email;

                if (!user) {
                  const input = window.prompt("Digite seu email para receber alertas:");
                  if (!input) return;
                  email = input;
                }

                // Get filters from props or current state
                const category = searchFilters?.category || "Todas as categorias";
                const location = searchFilters?.location || "Qualquer localização";

                const { error } = await (supabase as any).from('search_alerts').insert({
                  user_id: user?.id,
                  email: email,
                  location: location,
                  category: category,
                  radius_km: 50
                });

                if (error) {
                  alert("Erro ao criar alerta. Tente novamente.");
                } else {
                  alert(`Alerta criado! Avisaremos você sobre ${category} em ${location}.`);
                }
              }}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
            >
              <span className="text-xl">🔔</span>
              Criar Alerta de Disponibilidade
            </button>
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