import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  DollarSign, 
  Settings, 
  Calendar as CalendarIcon,
  Shield,
  X
} from "lucide-react";
import { format } from "date-fns";
import { SearchFilters } from "@/pages/Machines";

interface AdvancedMachineFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

export const AdvancedMachineFilters = ({ filters, onFiltersChange }: AdvancedMachineFiltersProps) => {
  const [openSections, setOpenSections] = useState({
    location: true,
    category: true,
    price: false,
    specs: false,
    availability: false,
    reliability: false
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const categories = [
    { id: 'Tratores', label: 'Tratores' },
    { id: 'Colheitadeiras', label: 'Colheitadeiras' },
    { id: 'Pulverizadores', label: 'Pulverizadores' },
    { id: 'Plantadeiras', label: 'Plantadeiras' }
  ];

  const powerRanges = [
    { id: 'under_100', label: 'Até 100 CV' },
    { id: '100_200', label: '100-200 CV' },
    { id: '200_300', label: '200-300 CV' },
    { id: 'over_300', label: 'Acima de 300 CV' }
  ];

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const activeFiltersCount = Object.keys(filters).filter(key => {
    const value = filters[key as keyof SearchFilters];
    return value !== undefined && value !== null && 
           (Array.isArray(value) ? value.length > 0 : true);
  }).length;

  return (
    <div className="p-4 space-y-4 bg-muted/30">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filtros</h3>
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">{activeFiltersCount}</Badge>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters}
            disabled={activeFiltersCount === 0}
          >
            <X className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        </div>
      </div>

      {/* Location Filter */}
      <Collapsible open={openSections.location} onOpenChange={() => toggleSection('location')}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="font-medium">Localização</span>
            </div>
            {openSections.location ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 mt-3">
          <div>
            <Label htmlFor="location">Cidade</Label>
            <Input
              id="location"
              placeholder="Digite a cidade..."
              value={filters.location || ''}
              onChange={(e) => updateFilter('location', e.target.value)}
            />
          </div>
          <div>
            <Label>Distância: {filters.distance || 50} km</Label>
            <Slider
              value={[filters.distance || 50]}
              onValueChange={(value) => updateFilter('distance', value[0])}
              max={200}
              min={10}
              step={10}
              className="mt-2"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="delivery"
              checked={filters.deliveryAvailable || false}
              onCheckedChange={(checked) => updateFilter('deliveryAvailable', checked)}
            />
            <Label htmlFor="delivery">Entrega na fazenda</Label>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Category Filter */}
      <Collapsible open={openSections.category} onOpenChange={() => toggleSection('category')}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="font-medium">Categoria</span>
            </div>
            {openSections.category ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 mt-3">
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={filters.categories?.includes(category.id) || false}
                  onCheckedChange={(checked) => {
                    const current = filters.categories || [];
                    if (checked) {
                      updateFilter('categories', [...current, category.id]);
                    } else {
                      updateFilter('categories', current.filter(c => c !== category.id));
                    }
                  }}
                />
                <Label htmlFor={category.id}>{category.label}</Label>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Price Filter */}
      <Collapsible open={openSections.price} onOpenChange={() => toggleSection('price')}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="font-medium">Preço</span>
            </div>
            {openSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 mt-3">
          <div>
            <Label>Tipo de preço</Label>
            <Select 
              value={filters.priceType || 'hour'} 
              onValueChange={(value) => updateFilter('priceType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hour">Por hora</SelectItem>
                <SelectItem value="hectare">Por hectare</SelectItem>
                <SelectItem value="day">Por dia</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Faixa de preço: R$ {filters.priceRange?.[0] || 100} - R$ {filters.priceRange?.[1] || 2000}</Label>
            <Slider
              value={filters.priceRange || [100, 2000]}
              onValueChange={(value) => updateFilter('priceRange', value)}
              max={5000}
              min={50}
              step={50}
              className="mt-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="min-price">Mín</Label>
              <Input
                id="min-price"
                type="number"
                placeholder="R$ 100"
                value={filters.priceRange?.[0] || ''}
                onChange={(e) => {
                  const current = filters.priceRange || [100, 2000];
                  updateFilter('priceRange', [Number(e.target.value), current[1]]);
                }}
              />
            </div>
            <div>
              <Label htmlFor="max-price">Máx</Label>
              <Input
                id="max-price"
                type="number"
                placeholder="R$ 2000"
                value={filters.priceRange?.[1] || ''}
                onChange={(e) => {
                  const current = filters.priceRange || [100, 2000];
                  updateFilter('priceRange', [current[0], Number(e.target.value)]);
                }}
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Technical Specs */}
      <Collapsible open={openSections.specs} onOpenChange={() => toggleSection('specs')}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="font-medium">Especificações</span>
            </div>
            {openSections.specs ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 mt-3">
          <div>
            <Label>Potência</Label>
            <div className="space-y-2 mt-2">
              {powerRanges.map((range) => (
                <div key={range.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={range.id}
                    checked={filters.powerRange === range.id}
                    onCheckedChange={(checked) => {
                      updateFilter('powerRange', checked ? range.id : undefined);
                    }}
                  />
                  <Label htmlFor={range.id}>{range.label}</Label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label>Ano: {filters.yearRange?.[0] || 2015} - {filters.yearRange?.[1] || 2024}</Label>
            <Slider
              value={filters.yearRange || [2015, 2024]}
              onValueChange={(value) => updateFilter('yearRange', value)}
              max={2024}
              min={2015}
              step={1}
              className="mt-2"
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Availability */}
      <Collapsible open={openSections.availability} onOpenChange={() => toggleSection('availability')}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span className="font-medium">Disponibilidade</span>
            </div>
            {openSections.availability ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 mt-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="immediate"
              checked={filters.availability?.immediate || false}
              onCheckedChange={(checked) => 
                updateFilter('availability', { 
                  ...filters.availability, 
                  immediate: checked 
                })
              }
            />
            <Label htmlFor="immediate">Disponível imediatamente</Label>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Reliability */}
      <Collapsible open={openSections.reliability} onOpenChange={() => toggleSection('reliability')}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="font-medium">Confiabilidade</span>
            </div>
            {openSections.reliability ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 mt-3">
          <div>
            <Label>Rating mínimo: {filters.rating || 0} estrelas</Label>
            <Slider
              value={[filters.rating || 0]}
              onValueChange={(value) => updateFilter('rating', value[0])}
              max={5}
              min={0}
              step={0.5}
              className="mt-2"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="verified"
                checked={filters.verifiedOnly || false}
                onCheckedChange={(checked) => updateFilter('verifiedOnly', checked)}
              />
              <Label htmlFor="verified">Apenas verificados</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="insurance"
                checked={filters.withInsurance || false}
                onCheckedChange={(checked) => updateFilter('withInsurance', checked)}
              />
              <Label htmlFor="insurance">Com seguro</Label>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};