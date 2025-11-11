import { useState, useEffect } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { AdvancedMachineFilters } from "@/components/ui/advanced-machine-filters";
import { MachineResultCard } from "@/components/ui/machine-result-card";
import { InteractiveMap } from "@/components/ui/interactive-map";
import { SearchHeader } from "@/components/ui/search-header";
import { Button } from "@/components/ui/button";
import { MapPin, List, Grid, Map } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

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

export interface SearchFilters {
  location?: string;
  distance?: number;
  categories?: string[];
  priceRange?: [number, number];
  priceType?: 'hour' | 'hectare' | 'day';
  powerRange?: string;
  yearRange?: [number, number];
  availability?: {
    startDate?: Date;
    endDate?: Date;
    immediate?: boolean;
  };
  rating?: number;
  verifiedOnly?: boolean;
  withInsurance?: boolean;
  deliveryAvailable?: boolean;
}

const Machines = () => {
  const [machines, setMachines] = useState<MachineData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [showMobileMap, setShowMobileMap] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Extrair categoria da URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('categoria');
    
    if (categoryParam) {
      // Converter slug para nome da categoria
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
        setFilters(prev => ({
          ...prev,
          categories: [category]
        }));
      }
    }
  }, []);

  const fetchMachines = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('machines')
        .select('*', { count: 'exact' })
        .eq('status', 'available'); // Apenas equipamentos disponíveis

      // Apply filters
      if (filters.categories && filters.categories.length > 0) {
        query = query.in('category', filters.categories);
      }

      if (filters.powerRange) {
        // Apply power range filter based on specifications
      }

      if (filters.yearRange) {
        query = query
          .gte('year', filters.yearRange[0])
          .lte('year', filters.yearRange[1]);
      }

      // Apply sorting
      switch (sortBy) {
        case 'price_low':
          query = query.order('price_hour', { ascending: true });
          break;
        case 'price_high':
          query = query.order('price_hour', { ascending: false });
          break;
        case 'distance':
          // For now, order by created_at as distance calculation needs coordinates
          query = query.order('created_at', { ascending: false });
          break;
        case 'rating':
          // Would need to join with reviews table
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error, count } = await query.limit(50);

      if (error) throw error;

      setMachines(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching machines:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, [filters, sortBy]);

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Search Header */}
        <SearchHeader
          totalCount={totalCount}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onToggleMobileMap={() => setShowMobileMap(!showMobileMap)}
        />

        <div className="flex h-[calc(100vh-120px)]">
          {/* Left Panel - Filters & Results */}
          <div className={`${showMobileMap ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-2/5 border-r border-border`}>
            {/* Filters */}
            <div className="border-b border-border">
              <AdvancedMachineFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="p-4 border border-border rounded-lg">
                    <div className="flex gap-4">
                      <Skeleton className="w-32 h-24 rounded" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-3 w-2/3" />
                        <Skeleton className="h-4 w-1/3" />
                      </div>
                    </div>
                  </div>
                ))
              ) : machines.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma máquina encontrada</h3>
                  <p className="text-muted-foreground mb-4">
                    Tente ajustar os filtros ou expandir a área de busca
                  </p>
                  <Button variant="outline">Limpar Filtros</Button>
                </div>
              ) : (
                machines.map((machine) => (
                  <MachineResultCard
                    key={machine.id}
                    machine={machine}
                    viewMode={viewMode}
                  />
                ))
              )}
            </div>
          </div>

          {/* Right Panel - Map */}
          <div className={`${showMobileMap ? 'flex' : 'hidden lg:flex'} flex-1`}>
            <InteractiveMap machines={machines} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Machines;