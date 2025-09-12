import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, MapPin, Calendar as CalendarIcon, Clock, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import heroImage from "@/assets/hero-farming.jpg";
import { AdvancedFilters, type FilterValues } from "@/components/ui/advanced-filters";

interface HeroSectionProps {
  onSearch?: (filters: FilterValues & { location: string; startDate?: Date; endDate?: Date; time: string; category: string; culture: string }) => void;
}

export const HeroSection = ({ onSearch }: HeroSectionProps) => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("Período integral");
  const [category, setCategory] = useState("Todas as categorias");
  const [culture, setCulture] = useState("Selecionar cultura");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Load saved filters from localStorage on component mount
  useEffect(() => {
    const savedFilters = localStorage.getItem('fieldmachine-saved-filters');
    if (savedFilters) {
      try {
        const parsed = JSON.parse(savedFilters);
        setFilters(parsed);
        if (parsed.location) setLocation(parsed.location);
        if (parsed.category) setCategory(parsed.category);
        if (parsed.culture) setCulture(parsed.culture);
      } catch (error) {
        console.error('Error loading saved filters:', error);
      }
    }
  }, []);
  
  const [filters, setFilters] = useState<FilterValues>({
    priceRange: [100, 2000],
    distanceRadius: "50km",
    powerRange: "Todas",
    availability: "Qualquer",
    yearRange: [2015, 2024],
    minRating: 0,
    minServices: 0,
    verifiedOnly: false,
    category: "Todas as categorias",
    culture: "Selecionar cultura"
  });

  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        ...filters,
        location,
        startDate,
        endDate,
        time,
        category,
        culture
      });
    }
  };

  const handleFiltersChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    // Sincronizar com os selects principais
    setCulture(newFilters.culture);
    setCategory(newFilters.category);
  };

  const handleSaveFilters = () => {
    // Implementar salvamento dos filtros favoritos
    const savedFilters = {
      ...filters,
      location,
      time,
      category,
      culture
    };
    localStorage.setItem('fieldmachine-favorite-filters', JSON.stringify(savedFilters));
    // Aqui você pode adicionar uma notificação de sucesso
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage}
          alt="Máquinas agrícolas trabalhando no campo"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Logo/Brand */}
          <div className="space-y-2">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
              Field<span className="text-primary-glow">Machine</span>
            </h1>
            <p className="text-xl md:text-2xl font-light opacity-90">
              Alugue máquinas agrícolas de forma rápida e segura
            </p>
          </div>

          {/* Search Card */}
          <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-8 shadow-hero max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Localização
                </label>
                <Input 
                  placeholder="Cidade, Estado"
                  className="h-12"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Data Início
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-12 w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Horário
                </label>
                <select 
                  className="w-full h-12 px-3 rounded-md border border-input bg-background text-foreground"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                >
                  <option>06:00 - 12:00</option>
                  <option>12:00 - 18:00</option>
                  <option>18:00 - 24:00</option>
                  <option>Período integral</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Categoria
                </label>
                <select 
                  className="w-full h-12 px-3 rounded-md border border-input bg-background text-foreground"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setFilters(prev => ({ ...prev, category: e.target.value }));
                  }}
                >
                  <option>Todas as categorias</option>
                  <option>Tratores</option>
                  <option>Pulverizadores</option>
                  <option>Colheitadeiras</option>
                  <option>Caminhões</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-1 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Cultura
                </label>
                <select
                  className="w-full h-12 px-3 rounded-md border border-input bg-background text-foreground"
                  value={culture}
                  onChange={(e) => {
                    setCulture(e.target.value);
                    setFilters(prev => ({ ...prev, culture: e.target.value }));
                  }}
                >
                  <option>Selecionar cultura</option>
                  <option>Soja</option>
                  <option>Milho</option>
                  <option>Algodão</option>
                  <option>Cana-de-açúcar</option>
                  <option>Arroz</option>
                  <option>Feijão</option>
                  <option>Trigo</option>
                  <option>Café</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <Button 
                  size="lg" 
                  className="flex-1 h-14 text-lg font-semibold bg-gradient-primary hover:shadow-hero transition-all duration-300"
                  onClick={handleSearch}
                >
                  <Search className="mr-2 h-5 w-5" />
                  Buscar Equipamentos
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-6 border-white/20 text-foreground hover:bg-white/10"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                >
                  <Filter className="mr-2 h-5 w-5" />
                  Filtros
                  {showAdvancedFilters ? 
                    <ChevronUp className="ml-2 h-4 w-4" /> : 
                    <ChevronDown className="ml-2 h-4 w-4" />
                  }
                </Button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          <AdvancedFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onSaveFilters={handleSaveFilters}
            isExpanded={showAdvancedFilters}
            onToggle={() => setShowAdvancedFilters(!showAdvancedFilters)}
          />

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary-glow" />
              </div>
              <h3 className="text-lg font-semibold">Encontre Rapidamente</h3>
              <p className="text-sm opacity-80">Milhares de máquinas disponíveis na sua região</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-primary-glow" />
              </div>
              <h3 className="text-lg font-semibold">Reserve Instantaneamente</h3>
              <p className="text-sm opacity-80">Processo simples e seguro de locação</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary-glow" />
              </div>
              <h3 className="text-lg font-semibold">Entrega Local</h3>
              <p className="text-sm opacity-80">Equipamentos entregues onde você precisar</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};