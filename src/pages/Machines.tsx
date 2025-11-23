import { useState, useEffect } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { MachineSearchBar } from "@/components/ui/machine-search-bar";
import { CategoryChips } from "@/components/ui/category-chips";
import { EnhancedMachineCard } from "@/components/ui/enhanced-machine-card";
import { EmptyMachineState } from "@/components/ui/empty-machine-state";
import { DemoDataBanner } from "@/components/ui/demo-data-banner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { demoMachines, categories, DemoMachine } from "@/data/demo-machines";
import { getUserLocation, sortByDistance, Coordinates } from "@/lib/geolocation";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ArrowUpDown } from "lucide-react";

export interface MachineData {
  id: string;
  name: string;
  category: string;
  brand?: string;
  model?: string;
  year?: number;
  images?: string[];
  location?: any;
  price_hour?: number;
  price_hectare?: number;
  price_day?: number;
  specifications?: any;
  owner_id?: string;
  status?: string;
  created_at?: string;
}

const Machines = () => {
  const navigate = useNavigate();
  const [machines, setMachines] = useState<DemoMachine[]>([]);
  const [displayMachines, setDisplayMachines] = useState<DemoMachine[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("relevance");
  const [hasRealData, setHasRealData] = useState(false);
  const [machineDistances, setMachineDistances] = useState<Map<string, number>>(new Map());

  // Load machines (demo or real data)
  useEffect(() => {
    const loadMachines = async () => {
      setLoading(true);
      try {
        // Try to fetch real machines from database
        const { data, error, count } = await supabase
          .from('machines')
          .select('*', { count: 'exact' })
          .eq('status', 'available')
          .limit(50);

        if (error) throw error;

        if (data && data.length > 0) {
          // We have real data
          setHasRealData(true);
          // Convert to DemoMachine format (you may need to adjust this mapping)
          setMachines(data as any);
        } else {
          // Use demo data
          setHasRealData(false);
          setMachines(demoMachines);
        }
      } catch (error) {
        console.error('Error loading machines:', error);
        // Fallback to demo data
        setHasRealData(false);
        setMachines(demoMachines);
      } finally {
        setLoading(false);
      }
    };

    loadMachines();
  }, []);

  // Get user location on mount
  useEffect(() => {
    getUserLocation().then(setUserLocation);
  }, []);

  // Calculate distances when user location or machines change
  useEffect(() => {
    if (userLocation && machines.length > 0) {
      const distances = new Map<string, number>();
      machines.forEach((machine) => {
        const sorted = sortByDistance([machine], userLocation);
        if (sorted.length > 0) {
          distances.set(machine.id, sorted[0].distance);
        }
      });
      setMachineDistances(distances);
    }
  }, [userLocation, machines]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...machines];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.brand.toLowerCase().includes(query) ||
          m.model.toLowerCase().includes(query) ||
          m.category.toLowerCase().includes(query)
      );
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((m) =>
        selectedCategories.includes(m.category)
      );
    }

    // Sort
    switch (sortBy) {
      case "distance":
        if (userLocation) {
          filtered = sortByDistance(filtered, userLocation);
        }
        break;
      case "price_low":
        filtered.sort((a, b) => a.price_hour - b.price_hour);
        break;
      case "price_high":
        filtered.sort((a, b) => b.price_hour - a.price_hour);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // relevance - keep current order
        break;
    }

    setDisplayMachines(filtered);
  }, [machines, searchQuery, selectedCategories, sortBy, userLocation]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSortBy("relevance");
  };

  const handleRegisterMachine = () => {
    navigate("/add-machine");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Demo Data Banner */}
          {!hasRealData && (
            <DemoDataBanner onRegisterClick={handleRegisterMachine} />
          )}

          {/* Search Bar */}
          <div className="mb-6">
            <MachineSearchBar
              onSearchChange={setSearchQuery}
              placeholder="Buscar por máquina, marca ou modelo..."
            />
          </div>

          {/* Category Chips */}
          <div className="mb-6 -mx-4 sm:mx-0">
            <CategoryChips
              categories={categories}
              selectedCategories={selectedCategories}
              onCategoryToggle={handleCategoryToggle}
            />
          </div>

          {/* Sorting and Results Count */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {displayMachines.length}
              </span>{" "}
              {displayMachines.length === 1 ? "máquina encontrada" : "máquinas encontradas"}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevância</SelectItem>
                  <SelectItem value="distance" disabled={!userLocation}>
                    Mais Próximo
                    {!userLocation && " (localização necessária)"}
                  </SelectItem>
                  <SelectItem value="price_low">Menor Preço</SelectItem>
                  <SelectItem value="price_high">Maior Preço</SelectItem>
                  <SelectItem value="rating">Melhor Avaliado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Machine Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="w-full aspect-[16/10] rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : displayMachines.length === 0 ? (
            <EmptyMachineState
              onClearFilters={handleClearFilters}
              showClearFilters={
                searchQuery.trim() !== "" || selectedCategories.length > 0
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayMachines.map((machine) => (
                <EnhancedMachineCard
                  key={machine.id}
                  machine={machine}
                  distance={machineDistances.get(machine.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Machines;