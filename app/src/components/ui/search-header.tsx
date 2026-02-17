import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Grid, List, Map, Smartphone } from "lucide-react";

interface SearchHeaderProps {
  totalCount: number;
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: 'grid' | 'list' | 'map';
  onViewModeChange: (mode: 'grid' | 'list' | 'map') => void;
  onToggleMobileMap: () => void;
}

export const SearchHeader = ({
  totalCount,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onToggleMobileMap
}: SearchHeaderProps) => {
  return (
    <div className="border-b border-border bg-background sticky top-16 z-40">
      <div className="p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Results Count */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1">
              {totalCount} máquinas encontradas
            </Badge>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevância</SelectItem>
                <SelectItem value="price_low">Menor preço</SelectItem>
                <SelectItem value="distance">Mais próximo</SelectItem>
                <SelectItem value="rating">Melhor avaliado</SelectItem>
                <SelectItem value="newest">Mais recentes</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle - Desktop */}
            <div className="hidden lg:flex items-center border border-border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('grid')}
                className="px-3"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('list')}
                className="px-3"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('map')}
                className="px-3"
              >
                <Map className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile Map Toggle */}
            <Button
              variant="outline"
              onClick={onToggleMobileMap}
              className="lg:hidden"
            >
              <Smartphone className="h-4 w-4 mr-2" />
              Mapa
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};