import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Star, Filter, BookmarkPlus, MapPin, Zap, Calendar, Award, Verified } from "lucide-react";

export interface FilterValues {
  priceRange: [number, number];
  distanceRadius: string;
  powerRange: string;
  availability: string;
  yearRange: [number, number];
  minRating: number;
  minServices: number;
  verifiedOnly: boolean;
  // Filtros específicos por cultura
  workWidth?: [number, number];
  tankCapacity?: [number, number];
  // Categoria e cultura
  category: string;
  culture: string;
}

interface AdvancedFiltersProps {
  filters: FilterValues;
  onFiltersChange: (filters: FilterValues) => void;
  onSaveFilters?: () => void;
  isExpanded: boolean;
  onToggle: () => void;
}

const cultureSpecificFilters = {
  "Soja": {
    workWidth: { min: 6, max: 40, label: "Largura de trabalho (m)" },
    tankCapacity: { min: 2000, max: 8000, label: "Capacidade do tanque (L)" }
  },
  "Milho": {
    workWidth: { min: 4, max: 24, label: "Largura de trabalho (m)" },
    tankCapacity: { min: 1500, max: 6000, label: "Capacidade do tanque (L)" }
  },
  "Algodão": {
    workWidth: { min: 6, max: 30, label: "Largura de trabalho (m)" },
    tankCapacity: { min: 3000, max: 10000, label: "Capacidade do tanque (L)" }
  },
  "Cana-de-açúcar": {
    workWidth: { min: 1, max: 8, label: "Largura de trabalho (m)" },
    tankCapacity: { min: 5000, max: 15000, label: "Capacidade do tanque (L)" }
  }
};

export const AdvancedFilters = ({
  filters,
  onFiltersChange,
  onSaveFilters,
  isExpanded,
  onToggle
}: AdvancedFiltersProps) => {
  const [localFilters, setLocalFilters] = useState<FilterValues>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof FilterValues, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters: FilterValues = {
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
    };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const currentCultureFilters = cultureSpecificFilters[localFilters.culture as keyof typeof cultureSpecificFilters];

  if (!isExpanded) return null;

  return (
    <Card className="mt-6 bg-card/95 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5 text-primary" />
            Filtros Avançados
          </CardTitle>
          <div className="flex gap-2">
            {onSaveFilters && (
              <Button variant="outline" size="sm" onClick={onSaveFilters}>
                <BookmarkPlus className="h-4 w-4 mr-2" />
                Salvar Filtros
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Limpar
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Faixa de Preço */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-sm font-medium">
            💰 Faixa de Preço por Hora
          </Label>
          <div className="px-3">
            <Slider
              value={localFilters.priceRange}
              onValueChange={(value) => handleFilterChange('priceRange', value)}
              max={2000}
              min={100}
              step={50}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>R$ {localFilters.priceRange[0]}</span>
              <span>R$ {localFilters.priceRange[1]}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Raio de Distância e Potência */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4" />
              Raio de Distância
            </Label>
            <Select value={localFilters.distanceRadius} onValueChange={(value) => handleFilterChange('distanceRadius', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10km">10km</SelectItem>
                <SelectItem value="25km">25km</SelectItem>
                <SelectItem value="50km">50km</SelectItem>
                <SelectItem value="100km">100km</SelectItem>
                <SelectItem value="200km">200km</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Zap className="h-4 w-4" />
              Potência (CV)
            </Label>
            <Select value={localFilters.powerRange} onValueChange={(value) => handleFilterChange('powerRange', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todas">Todas as potências</SelectItem>
                <SelectItem value="100-200">100-200 CV</SelectItem>
                <SelectItem value="200-300">200-300 CV</SelectItem>
                <SelectItem value="300-400">300-400 CV</SelectItem>
                <SelectItem value="400+">400+ CV</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Disponibilidade e Ano */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4" />
              Disponibilidade
            </Label>
            <Select value={localFilters.availability} onValueChange={(value) => handleFilterChange('availability', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Qualquer">Qualquer data</SelectItem>
                <SelectItem value="Imediato">Imediato</SelectItem>
                <SelectItem value="Esta semana">Esta semana</SelectItem>
                <SelectItem value="Este mês">Este mês</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Ano do Equipamento</Label>
            <div className="grid grid-cols-2 gap-4 px-1">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">De</Label>
                <div className="relative">
                  <Input
                    type="number"
                    min={1990}
                    max={new Date().getFullYear()}
                    value={localFilters.yearRange[0]}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1990;
                      handleFilterChange('yearRange', [val, localFilters.yearRange[1]]);
                    }}
                    className="h-8"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Até</Label>
                <div className="relative">
                  <Input
                    type="number"
                    min={1990}
                    max={new Date().getFullYear()}
                    value={localFilters.yearRange[1]}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || new Date().getFullYear();
                      handleFilterChange('yearRange', [localFilters.yearRange[0], val]);
                    }}
                    className="h-8"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Filtros de Confiabilidade */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2 text-base font-medium">
            <Award className="h-5 w-5 text-primary" />
            Filtros de Confiabilidade
          </Label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Avaliação Mínima</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    variant={localFilters.minRating >= star ? "default" : "outline"}
                    size="sm"
                    className="p-1 h-8 w-8"
                    onClick={() => handleFilterChange('minRating', star)}
                  >
                    <Star className={`h-4 w-4 ${localFilters.minRating >= star ? 'fill-current' : ''}`} />
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Serviços Mínimos Concluídos</Label>
              <Select value={localFilters.minServices.toString()} onValueChange={(value) => handleFilterChange('minServices', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Qualquer quantidade</SelectItem>
                  <SelectItem value="10">10+ serviços</SelectItem>
                  <SelectItem value="25">25+ serviços</SelectItem>
                  <SelectItem value="50">50+ serviços</SelectItem>
                  <SelectItem value="100">100+ serviços</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="verified-only"
              checked={localFilters.verifiedOnly}
              onCheckedChange={(checked) => handleFilterChange('verifiedOnly', checked)}
            />
            <Label htmlFor="verified-only" className="flex items-center gap-2 text-sm cursor-pointer">
              <Verified className="h-4 w-4 text-primary" />
              Apenas proprietários verificados
            </Label>
          </div>
        </div>

        {/* Filtros Específicos por Cultura */}
        {currentCultureFilters && (
          <>
            <Separator />
            <div className="space-y-4">
              <Label className="flex items-center gap-2 text-base font-medium">
                🌱 Filtros para {localFilters.culture}
              </Label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="text-sm">{currentCultureFilters.workWidth.label}</Label>
                  <div className="px-3">
                    <Slider
                      value={localFilters.workWidth || [currentCultureFilters.workWidth.min, currentCultureFilters.workWidth.max]}
                      onValueChange={(value) => handleFilterChange('workWidth', value)}
                      max={currentCultureFilters.workWidth.max}
                      min={currentCultureFilters.workWidth.min}
                      step={0.5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>{(localFilters.workWidth || [currentCultureFilters.workWidth.min, currentCultureFilters.workWidth.max])[0]}m</span>
                      <span>{(localFilters.workWidth || [currentCultureFilters.workWidth.min, currentCultureFilters.workWidth.max])[1]}m</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm">{currentCultureFilters.tankCapacity.label}</Label>
                  <div className="px-3">
                    <Slider
                      value={localFilters.tankCapacity || [currentCultureFilters.tankCapacity.min, currentCultureFilters.tankCapacity.max]}
                      onValueChange={(value) => handleFilterChange('tankCapacity', value)}
                      max={currentCultureFilters.tankCapacity.max}
                      min={currentCultureFilters.tankCapacity.min}
                      step={100}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>{(localFilters.tankCapacity || [currentCultureFilters.tankCapacity.min, currentCultureFilters.tankCapacity.max])[0]}L</span>
                      <span>{(localFilters.tankCapacity || [currentCultureFilters.tankCapacity.min, currentCultureFilters.tankCapacity.max])[1]}L</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Filtros Ativos */}
        <div className="pt-4">
          <div className="flex flex-wrap gap-2">
            {localFilters.priceRange[0] !== 100 || localFilters.priceRange[1] !== 2000 ? (
              <Badge variant="secondary">
                Preço: R$ {localFilters.priceRange[0]} - R$ {localFilters.priceRange[1]}
              </Badge>
            ) : null}
            {localFilters.distanceRadius !== "50km" && (
              <Badge variant="secondary">Raio: {localFilters.distanceRadius}</Badge>
            )}
            {localFilters.powerRange !== "Todas" && (
              <Badge variant="secondary">Potência: {localFilters.powerRange}</Badge>
            )}
            {localFilters.availability !== "Qualquer" && (
              <Badge variant="secondary">Disponibilidade: {localFilters.availability}</Badge>
            )}
            {localFilters.minRating > 0 && (
              <Badge variant="secondary">
                <Star className="h-3 w-3 mr-1 fill-current" />
                {localFilters.minRating}+ estrelas
              </Badge>
            )}
            {localFilters.verifiedOnly && (
              <Badge variant="secondary">
                <Verified className="h-3 w-3 mr-1" />
                Verificados
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};