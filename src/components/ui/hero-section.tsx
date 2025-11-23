import { useNavigate } from "react-router-dom";

// ... imports

export const HeroSection = ({ onSearch }: HeroSectionProps) => {
  const navigate = useNavigate();
  // ... state

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (category && category !== "Todas as categorias") params.set('categoria', category);

    navigate(`/search?${params.toString()}`);
  };

  // ...

  return (
    // ...
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Localização
      </label>
      <Input
        placeholder="Cidade, Estado"
        className="h-12 text-gray-900 bg-white"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
    </div>

              {/* ... other inputs ... */ }

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Horário
                </label>
                <select
                  className="w-full h-12 px-3 rounded-md border border-input bg-white text-gray-900"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                >
                  {/* ... options ... */}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Categoria
                </label>
                <select
                  className="w-full h-12 px-3 rounded-md border border-input bg-white text-gray-900"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setFilters(prev => ({ ...prev, category: e.target.value }));
                  }}
                >
                  {/* ... options ... */}
                </select>
              </div>
            </div >

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Cultura
                </label>
                <select
                  className="w-full h-12 px-3 rounded-md border border-input bg-white text-gray-900"
                  value={culture}
                  onChange={(e) => {
                    setCulture(e.target.value);
                    setFilters(prev => ({ ...prev, culture: e.target.value }));
                  }}
                >
                  {/* ... options ... */}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Operação
                </label>
                <select
                  className="w-full h-12 px-3 rounded-md border border-input bg-white text-gray-900"
                  value={operation}
                  onChange={(e) => setOperation(e.target.value)}
                >
                  {/* ... options ... */}
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
          </div >

  {/* Advanced Filters */ }
  < AdvancedFilters
filters = { filters }
onFiltersChange = { handleFiltersChange }
onSaveFilters = { handleSaveFilters }
isExpanded = { showAdvancedFilters }
onToggle = {() => setShowAdvancedFilters(!showAdvancedFilters)}
          />

{/* Features */ }
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
      <CalendarIcon className="h-8 w-8 text-primary-glow" />
    </div>
    <h3 className="text-lg font-semibold">Contrate Instantaneamente</h3>
    <p className="text-sm opacity-80">Processo simples e seguro de contratação</p>
  </div>

  <div className="text-center space-y-2">
    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
      <MapPin className="h-8 w-8 text-primary-glow" />
    </div>
    <h3 className="text-lg font-semibold">Entrega Local</h3>
    <p className="text-sm opacity-80">Equipamentos entregues onde você precisar</p>
  </div>
</div>
        </div >
      </div >
    </section >
  );
};