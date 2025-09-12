import { useState } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { MachineGrid } from "@/components/ui/machine-grid";
import { AdvancedFilters, type FilterValues } from "@/components/ui/advanced-filters";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search as SearchIcon, Filter } from "lucide-react";

const Search = () => {
  const [searchFilters, setSearchFilters] = useState<FilterValues & {
    location?: string;
    startDate?: Date;
    endDate?: Date;
    time?: string;
    category?: string;
    culture?: string;
  }>();
  
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Todas as categorias");
  const [culture, setCulture] = useState("Selecionar cultura");

  const defaultFilters: FilterValues = {
    priceRange: [100, 2000],
    distanceRadius: "50km",
    powerRange: "Todas",
    availability: "Qualquer",
    yearRange: [2015, 2024],
    minRating: 0,
    minServices: 0,
    verifiedOnly: false,
    category: category,
    culture: culture
  };

  const [filters, setFilters] = useState<FilterValues>(defaultFilters);

  const handleSearch = () => {
    setSearchFilters({
      ...filters,
      location,
      category,
      culture
    });
  };

  const handleFiltersChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Search Section */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SearchIcon className="h-5 w-5 text-primary" />
                  Buscar Equipamentos Agrícolas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Localização"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todas as categorias">Todas as categorias</SelectItem>
                      <SelectItem value="Tratores">Tratores</SelectItem>
                      <SelectItem value="Colheitadeiras">Colheitadeiras</SelectItem>
                      <SelectItem value="Pulverizadores">Pulverizadores</SelectItem>
                      <SelectItem value="Plantadeiras">Plantadeiras</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={culture} onValueChange={setCulture}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Selecionar cultura">Selecionar cultura</SelectItem>
                      <SelectItem value="Soja">Soja</SelectItem>
                      <SelectItem value="Milho">Milho</SelectItem>
                      <SelectItem value="Algodão">Algodão</SelectItem>
                      <SelectItem value="Cana-de-açúcar">Cana-de-açúcar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSearch} className="bg-gradient-primary">
                    <SearchIcon className="h-4 w-4 mr-2" />
                    Buscar
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros Avançados
                  </Button>
                </div>

                <AdvancedFilters
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  isExpanded={showAdvancedFilters}
                  onToggle={() => setShowAdvancedFilters(!showAdvancedFilters)}
                />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <MachineGrid searchFilters={searchFilters} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Search;