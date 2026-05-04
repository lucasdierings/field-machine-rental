import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { MachineGrid } from "@/components/ui/machine-grid";
import { AdvancedFilters, type FilterValues } from "@/components/ui/advanced-filters";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Search as SearchIcon, Filter, Bell } from "lucide-react";
import { SEO } from "@/components/SEO";

const createDefaultFilters = (
  category = "Todas as categorias",
  culture = "Selecionar cultura"
): FilterValues => ({
  priceRange: [100, 2000],
  distanceRadius: "50km",
  powerRange: "Todas",
  availability: "Qualquer",
  yearRange: [2015, new Date().getFullYear()],
  minRating: 0,
  minServices: 0,
  verifiedOnly: false,
  category,
  culture,
});

const Search = () => {
  const { toast } = useToast();
  const { userId, user } = useAuth();
  const { city } = useParams();
  const locationObj = useLocation();

  const [searchFilters, setSearchFilters] = useState<FilterValues & {
    location?: string;
    startDate?: Date;
    endDate?: Date;
    time?: string;
    category?: string;
    culture?: string;
    operation?: string;
  }>();

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Todas as categorias");
  const [culture, setCulture] = useState("Selecionar cultura");
  const [operation, setOperation] = useState("Selecionar operação");

  const [filters, setFilters] = useState<FilterValues>(() => createDefaultFilters());

  // SEO Logic
  let seoTitle = "Busca de Serviços Agrícolas";
  let seoDescription = "Encontre prestadores de serviços, aluguel de máquinas e soluções para sua lavoura.";
  let canonicalUrl = "/servicos-agricolas";

  if (city) {
    const cityName = city.charAt(0).toUpperCase() + city.slice(1).replace(/-/g, ' ');
    seoTitle = `Serviços Agrícolas em ${cityName}`;
    seoDescription = `Encontre tratores, colheitadeiras e serviços rurais em ${cityName}. Conecte-se com prestadores locais.`;
    canonicalUrl = `/servicos/${city}`;
  } else if (locationObj.pathname.includes('/servicos/colheita')) {
    seoTitle = "Serviços de Colheita - Locação de Colheitadeiras";
    seoDescription = "Encontre colheitadeiras e serviços de colheita. Conecte-se com prestadores qualificados.";
    canonicalUrl = "/servicos/colheita";
  } else if (locationObj.pathname.includes('/servicos/plantio')) {
    seoTitle = "Serviços de Plantio - Plantadeiras e Tratores";
    canonicalUrl = "/servicos/plantio";
  } else if (locationObj.pathname.includes('/servicos/pulverizacao')) {
    seoTitle = "Serviços de Pulverização Agrícola";
    canonicalUrl = "/servicos/pulverizacao";
  } else if (locationObj.pathname.includes('/servicos/preparo-solo')) {
    seoTitle = "Preparo de Solo - Tratores e Implementos";
    canonicalUrl = "/servicos/preparo-solo";
  } else if (locationObj.pathname.includes('/servicos/transporte')) {
    seoTitle = "Transporte Agrícola e de Cargas";
    canonicalUrl = "/servicos/transporte";
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const locationParam = params.get('location');
    const categoryParam = params.get('categoria');

    // Handle City Landing Page
    if (city) {
      const cityName = city.replace(/-/g, ' ');
      setLocation(cityName);
      setSearchFilters(prev => ({ ...createDefaultFilters(), ...prev, location: cityName }));
    }

    // Handle Category Landing Pages
    if (locationObj.pathname.includes('/servicos/colheita')) {
      setOperation("Colheita");
      setCategory("Colheitadeiras");
      setFilters(prev => ({ ...prev, category: "Colheitadeiras" }));
      setSearchFilters(prev => ({ ...createDefaultFilters("Colheitadeiras"), location: prev?.location, category: "Colheitadeiras", operation: "Colheita" }));
    } else if (locationObj.pathname.includes('/servicos/plantio')) {
      setOperation("Plantio");
      setCategory("Plantadeiras");
      setFilters(prev => ({ ...prev, category: "Plantadeiras" }));
      setSearchFilters(prev => ({ ...createDefaultFilters("Plantadeiras"), location: prev?.location, category: "Plantadeiras", operation: "Plantio" }));
    } else if (locationObj.pathname.includes('/servicos/pulverizacao')) {
      setOperation("Pulverização");
      setCategory("Pulverizadores");
      setFilters(prev => ({ ...prev, category: "Pulverizadores" }));
      setSearchFilters(prev => ({ ...createDefaultFilters("Pulverizadores"), location: prev?.location, category: "Pulverizadores", operation: "Pulverização" }));
    } else if (locationObj.pathname.includes('/servicos/preparo-solo')) {
      setOperation("Preparo do solo");
      setSearchFilters(prev => ({ ...createDefaultFilters(prev?.category, prev?.culture), location: prev?.location, operation: "Preparo do solo" }));
    } else if (locationObj.pathname.includes('/servicos/transporte')) {
      setCategory("Transporte de Cargas");
      setFilters(prev => ({ ...prev, category: "Transporte de Cargas" }));
      setSearchFilters(prev => ({ ...createDefaultFilters("Transporte de Cargas"), location: prev?.location, category: "Transporte de Cargas" }));
    }

    if (locationParam) {
      setLocation(locationParam);
    }

    if (categoryParam) {
      setCategory(categoryParam);
      setFilters(prev => ({ ...prev, category: categoryParam }));
    }

    if (locationParam || categoryParam) {
      setSearchFilters(prev => ({
        ...createDefaultFilters(categoryParam || prev?.category || undefined, prev?.culture),
        ...prev,
        location: locationParam || prev?.location || "",
        category: categoryParam || prev?.category || "Todas as categorias",
      }));
    }
  }, [city, locationObj.pathname]);

  const handleSearch = () => {
    setSearchFilters({
      ...filters,
      location,
      category,
      culture,
      operation
    });
  };

  const handleFiltersChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setFilters(prev => ({ ...prev, category: value }));
  };

  const handleCultureChange = (value: string) => {
    setCulture(value);
    setFilters(prev => ({ ...prev, culture: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonical={canonicalUrl}
      />
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Input
                    placeholder="Localização"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />

                  <Select value={category} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todas as categorias">Todas as categorias</SelectItem>
                      <SelectItem value="Tratores">Tratores</SelectItem>
                      <SelectItem value="Colheitadeiras">Colheitadeiras</SelectItem>
                      <SelectItem value="Pulverizadores">Pulverizadores</SelectItem>
                      <SelectItem value="Plantadeiras">Plantadeiras</SelectItem>
                      <SelectItem value="Implementos">Implementos</SelectItem>
                      <SelectItem value="Transporte de Cargas">Transporte de Cargas</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={culture} onValueChange={handleCultureChange}>
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

                  <Select value={operation} onValueChange={setOperation}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Selecionar operação">Selecionar operação</SelectItem>
                      <SelectItem value="Plantio">Plantio</SelectItem>
                      <SelectItem value="Pulverização">Pulverização</SelectItem>
                      <SelectItem value="Colheita">Colheita</SelectItem>
                      <SelectItem value="Preparo do solo">Preparo do solo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <Button onClick={handleSearch} className="w-full bg-gradient-primary sm:w-auto">
                    <SearchIcon className="h-4 w-4 mr-2" />
                    Buscar
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="w-full sm:w-auto"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros Avançados
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-white sm:w-auto"
                    onClick={async () => {
                      let email = user?.email;

                      if (!userId) {
                        const input = window.prompt("Digite seu email para receber alertas desta busca:");
                        if (!input) return;
                        email = input;
                      }

                      const { error } = await (supabase as any).from('search_alerts').insert({
                        user_id: userId || null,
                        email: email,
                        location: location,
                        category: category,
                        radius_km: 50
                      });

                      if (error) {
                        toast({ title: "Erro", description: "Não foi possível criar o alerta.", variant: "destructive" });
                      } else {
                        toast({ title: "Alerta Criado!", description: `Você será notificado sobre ${category} em ${location}.` });
                      }
                    }}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Criar Alerta
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
