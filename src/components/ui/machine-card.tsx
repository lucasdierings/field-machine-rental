import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Fuel, Settings, Star, CheckCircle, Clock, BarChart3, Verified } from "lucide-react";
import { Link } from "react-router-dom";

export interface Machine {
  id: string;
  name: string;
  brand: string;
  year: number;
  power: string;
  category: string;
  location: string;
  rating: number;
  reviews: number;
  rate: number; // Changed from pricePerDay to rate
  image: string;
  availability: string;
  owner: string;
  servicesCompleted: number;
  chargeType: "hora" | "hectare";
  comments?: string[];
  verified: boolean;
  workWidth?: number;
  tankCapacity?: number;
}

interface MachineCardProps {
  machine: Machine;
}

export const MachineCard = ({ machine }: MachineCardProps) => {
  const platformFee = machine.rate * 0.02;
  const totalPrice = machine.rate + platformFee;

  return (
    <Card className="group overflow-hidden hover:shadow-card transition-all duration-300 bg-gradient-card border-0">
      <div className="relative">
        <img 
          src={machine.image}
          alt={machine.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Badge 
          className="absolute top-3 left-3 bg-primary text-primary-foreground"
        >
          {machine.category}
        </Badge>
        <Badge 
          variant="secondary"
          className="absolute top-3 right-3"
        >
          {machine.availability}
        </Badge>
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div>
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              {machine.name}
            </h3>
            <p className="text-muted-foreground">{machine.brand} • {machine.year}</p>
          </div>

          {/* Specifications */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Fuel className="h-4 w-4" />
              <span>{machine.power}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{machine.location}</span>
            </div>
          </div>

          {/* Rating & Services */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{machine.rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({machine.reviews} avaliações)
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{machine.servicesCompleted} serviços</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <BarChart3 className="h-4 w-4" />
                <span>Cobrança por {machine.chargeType}</span>
              </div>
            </div>

            {machine.comments && machine.comments.length > 0 && (
              <div className="p-2 bg-muted/20 rounded text-xs text-muted-foreground">
                <span className="font-medium">Último comentário:</span> "{machine.comments[0]}"
              </div>
            )}
          </div>

          {/* Pricing */}
          <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
            <div className="flex justify-between text-sm">
              <span>Valor por {machine.chargeType}:</span>
              <span>R$ {machine.rate.toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Taxa da plataforma (2%):</span>
              <span>R$ {platformFee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total por {machine.chargeType}:</span>
              <span className="text-primary">R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* Owner (Hidden until hiring) */}
          <div className="flex items-center gap-2 text-sm">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {machine.verified ? (
                <>
                  <Verified className="inline h-4 w-4 text-primary mr-1" />
                  Prestador verificado
                </>
              ) : (
                "Prestador não verificado"
              )} • Nome liberado após contratação
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1"
              asChild
            >
              <Link to={`/equipamento/${machine.id}`}>
                Ver Detalhes
              </Link>
            </Button>
            <Button 
              size="sm"
              className="flex-1 bg-gradient-primary hover:shadow-hero transition-all duration-300"
              asChild
            >
              <Link to={`/reservar/${machine.id}`}>
                <Calendar className="mr-2 h-4 w-4" />
                Reservar
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};