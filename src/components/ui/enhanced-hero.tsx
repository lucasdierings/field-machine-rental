import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-soybean-field.jpg";

const cidadesParana = [
  "Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel", 
  "São José dos Pinhais", "Foz do Iguaçu", "Colombo", "Guarapuava", 
  "Paranaguá", "Araucária", "Toledo", "Apucarana", "Pinhais", "Campo Largo"
];

const categorias = [
  "Todas as categorias",
  "Trator", 
  "Colheitadeira",
  "Pulverizador",
  "Plantadeira",
  "Implementos"
];

export const EnhancedHero = () => {
  const [cidade, setCidade] = useState("");
  const [categoria, setCategoria] = useState("Todas as categorias");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredCidades = cidadesParana.filter(c => 
    c.toLowerCase().includes(cidade.toLowerCase())
  );

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    if (cidade) searchParams.set("cidade", cidade);
    if (categoria !== "Todas as categorias") searchParams.set("categoria", categoria);
    
    const queryString = searchParams.toString();
    window.location.href = `/buscar${queryString ? `?${queryString}` : ""}`;
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage}
          alt="Campo de soja no Paraná - Aluguel de máquinas agrícolas"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Prestação de Serviços Agrícolas com{" "}
              <span className="text-primary-glow">Segurança no Paraná</span>
            </h1>
            <p className="text-xl md:text-2xl font-light opacity-90 max-w-3xl mx-auto">
              Economize até 40% conectando-se com proprietários verificados
            </p>
          </div>

          {/* Trust Badge */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>Seguro incluído</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>Proprietários verificados</span>
            </div>
          </div>

          {/* Search Card */}
          <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-hero max-w-4xl mx-auto">
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4" />
                    Cidade no Paraná
                  </label>
                  <Input 
                    placeholder="Ex: Londrina, Cascavel..."
                    className="h-12 text-base"
                    value={cidade}
                    onChange={(e) => {
                      setCidade(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  />
                  
                  {/* Autocomplete Suggestions */}
                  {showSuggestions && cidade && filteredCidades.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-background border border-border rounded-md shadow-lg z-50 mt-1 max-h-48 overflow-y-auto">
                      {filteredCidades.slice(0, 8).map((c) => (
                        <button
                          key={c}
                          className="w-full text-left px-4 py-2 hover:bg-accent text-foreground"
                          onClick={() => {
                            setCidade(c);
                            setShowSuggestions(false);
                          }}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Categoria
                  </label>
                  <select 
                    className="w-full h-12 px-3 rounded-md border border-input bg-background text-foreground text-base"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                  >
                    {categorias.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full h-14 text-lg font-semibold bg-[#10B981] hover:bg-[#059669] text-white transition-all duration-300"
                onClick={handleSearch}
              >
                <Search className="mr-2 h-5 w-5" />
                Buscar Máquinas
              </Button>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <Button 
              variant="outline" 
              size="lg"
              className="flex-1 h-12 border-white text-white hover:bg-white hover:text-primary backdrop-blur-sm bg-black/20"
              asChild
            >
              <Link to="/buscar">
                Quero Contratar Serviços
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="flex-1 h-12 border-white text-white hover:bg-white hover:text-primary backdrop-blur-sm bg-black/20"
              asChild
            >
              <Link to="/alugar-minha-maquina">
                Quero Prestar Serviços
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="flex-1 h-12 border-white text-white hover:bg-white hover:text-primary backdrop-blur-sm bg-black/20"
              asChild
            >
              <Link to="/cadastro">
                Cadastrar-se
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};