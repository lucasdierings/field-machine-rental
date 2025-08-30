import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, MapPin, Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { cn } from "@/lib/utils";
import heroImage from "@/assets/hero-farming.jpg";

export const HeroSection = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

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
                <select className="w-full h-12 px-3 rounded-md border border-input bg-background text-foreground">
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
                <select className="w-full h-12 px-3 rounded-md border border-input bg-background text-foreground">
                  <option>Todas as categorias</option>
                  <option>Tratores</option>
                  <option>Pulverizadores</option>
                  <option>Colheitadeiras</option>
                  <option>Caminhões</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Cultura
                </label>
                <select className="w-full h-12 px-3 rounded-md border border-input bg-background text-foreground">
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

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Operação
                </label>
                <select className="w-full h-12 px-3 rounded-md border border-input bg-background text-foreground">
                  <option>Tipo de operação</option>
                  <option>Plantio</option>
                  <option>Pulverização</option>
                  <option>Colheita</option>
                  <option>Preparo do solo</option>
                  <option>Adubação</option>
                  <option>Transporte</option>
                </select>
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full h-14 text-lg font-semibold bg-gradient-primary hover:shadow-hero transition-all duration-300"
            >
              <Search className="mr-2 h-5 w-5" />
              Buscar Equipamentos
            </Button>
          </div>

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