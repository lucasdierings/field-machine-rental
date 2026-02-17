import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Zap, Wheat, Droplets, Truck } from "lucide-react";
import { MachineData } from "@/pages/Machines";

interface InteractiveMapProps {
  machines: MachineData[];
}

export const InteractiveMap = ({ machines }: InteractiveMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedMachine, setSelectedMachine] = useState<MachineData | null>(null);
  const [mapMoved, setMapMoved] = useState(false);

  // Mock coordinates for demonstration
  const defaultCenter = { lat: -25.4284, lng: -49.2733 }; // Curitiba

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'tratores':
        return Zap;
      case 'colheitadeiras':
        return Wheat;
      case 'pulverizadores':
        return Droplets;
      default:
        return Truck;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'tratores':
        return 'bg-blue-500';
      case 'colheitadeiras':
        return 'bg-yellow-500';
      case 'pulverizadores':
        return 'bg-green-500';
      case 'plantadeiras':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  // For now, we'll show a placeholder map with machine pins
  // In a real implementation, you would integrate with Mapbox or Google Maps
  const mockMachinePositions = machines.map((machine, index) => ({
    ...machine,
    position: {
      lat: defaultCenter.lat + (Math.random() - 0.5) * 0.1,
      lng: defaultCenter.lng + (Math.random() - 0.5) * 0.1
    }
  }));

  return (
    <div className="relative w-full h-full bg-muted/20">
      {/* Map Container - Placeholder */}
      <div ref={mapRef} className="w-full h-full relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        {/* Machine Pins */}
        {mockMachinePositions.map((machine, index) => {
          const Icon = getCategoryIcon(machine.category);
          return (
            <div
              key={machine.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{
                left: `${50 + (index % 3 - 1) * 20}%`,
                top: `${50 + (Math.floor(index / 3) % 3 - 1) * 20}%`
              }}
              onClick={() => setSelectedMachine(machine)}
            >
              <div className={`w-10 h-10 rounded-full ${getCategoryColor(machine.category)} flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 transition-transform`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              {/* Price popup on hover */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                {machine.price_hour ? `R$ ${machine.price_hour}/h` : 'Sob consulta'}
              </div>
            </div>
          );
        })}

        {/* Search in Area Button */}
        {mapMoved && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            <Button className="shadow-lg">
              <Search className="h-4 w-4 mr-2" />
              Buscar nesta área
            </Button>
          </div>
        )}

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button variant="outline" size="icon" className="bg-white shadow-lg">
            +
          </Button>
          <Button variant="outline" size="icon" className="bg-white shadow-lg">
            -
          </Button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4">
          <Card className="w-48">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Categorias</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {['Tratores', 'Colheitadeiras', 'Pulverizadores', 'Plantadeiras'].map((category) => {
                const Icon = getCategoryIcon(category);
                return (
                  <div key={category} className="flex items-center gap-2 text-sm">
                    <div className={`w-4 h-4 rounded-full ${getCategoryColor(category)} flex items-center justify-center`}>
                      <Icon className="h-2.5 w-2.5 text-white" />
                    </div>
                    <span>{category}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Machine Details Popup */}
      {selectedMachine && (
        <div className="absolute top-4 left-4 w-80">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{selectedMachine.name}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Cidade • 12 km</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedMachine(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Badge variant="outline">{selectedMachine.category}</Badge>
                <Badge variant="outline">{selectedMachine.year || '2020'}</Badge>
              </div>
              
              {selectedMachine.price_hour && (
                <div className="text-lg font-semibold">
                  R$ {selectedMachine.price_hour.toLocaleString('pt-BR')}/hora
                </div>
              )}
              
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" size="sm">
                  Ver Detalhes
                </Button>
                <Button className="flex-1" size="sm">
                  Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Map placeholder overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center text-muted-foreground">
          <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Mapa Interativo</p>
          <p className="text-sm">Integração com Mapbox em desenvolvimento</p>
        </div>
      </div>
    </div>
  );
};