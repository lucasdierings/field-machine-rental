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
import { useToast } from "@/hooks/use-toast";
import { Search as SearchIcon, Filter, Bell } from "lucide-react";
import { SEO } from "@/components/SEO";

const Search = () => {
  const { toast } = useToast();
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
      setSearchFilters(prev => ({ ...prev, location: cityName, ...defaultFilters }));
    }

    // Handle Category Landing Pages
    if (locationObj.pathname.includes('/servicos/colheita')) {
      setOperation("Colheita");
      setCategory("Colheitadeiras");
      setSearchFilters(prev => ({ ...defaultFilters, location: prev?.location, category: "Colheitadeiras", operation: "Colheita" }));
    } else if (locationObj.pathname.includes('/servicos/plantio')) {
      setOperation("Plantio");
      setCategory("Plantadeiras");
      setSearchFilters(prev => ({ ...defaultFilters, location: prev?.location, category: "Plantadeiras", operation: "Plantio" }));
    } else if (locationObj.pathname.includes('/servicos/pulverizacao')) {
      setOperation("Pulverização");
      setCategory("Pulverizadores");
      setSearchFilters(prev => ({ ...defaultFilters, location: prev?.location, category: "Pulverizadores", operation: "Pulverização" }));
    } else if (locationObj.pathname.includes('/servicos/preparo-solo')) {
      setOperation("Preparo do solo");
      setSearchFilters(prev => ({ ...defaultFilters, location: prev?.location, operation: "Preparo do solo" }));
    } else if (locationObj.pathname.includes('/servicos/transporte')) {
      setCategory("Transporte de Cargas");
      setSearchFilters(prev => ({ ...defaultFilters, location: prev?.location, category: "Transporte de Cargas" }));
    }

    if (locationParam) {
      setLocation(locationParam);
    }

    if (categoryParam) {
      setCategory(categoryParam);
    }

    if (locationParam || categoryParam) {
      setSearchFilters(prev => ({
        ...defaultFilters,
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                      <SelectItem value="Implementos">Implementos</SelectItem>
                      <SelectItem value="Transporte de Cargas">Transporte de Cargas</SelectItem>
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

                  <Button
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                    onClick={async () => {
                      const { data: { user } } = await supabase.auth.getUser();
                      let email = user?.email;

                      if (!user) {
                        const input = window.prompt("Digite seu email para receber alertas desta busca:");
                        if (!input) return;
                        email = input;
                      }

                      const { error } = await (supabase as any).from('search_alerts').insert({
                        user_id: user?.id,
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

                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={handleSearch} size="lg" className="bg-gradient-primary w-full md:w-auto">
                    <SearchIcon className="h-4 w-4 mr-2" />
                    Buscar Equipamentos
                  </Button>
                </div>
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