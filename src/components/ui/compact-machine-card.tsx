import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";

interface CompactMachineCardProps {
  machine: {
    id: string;
    name: string;
    category: string;
    brand?: string;
    location?: {
      city: string;
      state: string;
    };
    price_hour?: number;
    price_hectare?: number;
    rating?: number;
    reviewCount?: number;
    images?: string[];
    verified?: boolean;
    status?: string;
  };
}

export const CompactMachineCard = ({ machine }: CompactMachineCardProps) => {
  const imageUrl = machine.images?.[0] || "/placeholder.svg";
  const locationText = machine.location 
    ? `${machine.location.city}, ${machine.location.state}` 
    : "Localização não informada";

  // Determina o preço principal a mostrar
  const displayPrice = machine.price_hectare || machine.price_hour;
  const priceUnit = machine.price_hectare ? "/ha" : "/hora";

  return (
    <Link to={`/maquinas/${machine.id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200 active:scale-[0.98]">
        <div className="flex h-28">
          {/* Image */}
          <div className="relative w-28 h-full flex-shrink-0">
            <img
              src={imageUrl}
              alt={machine.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {machine.verified && (
              <Badge 
                className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5"
              >
                Verificado
              </Badge>
            )}
          </div>

          {/* Content */}
          <CardContent className="flex-1 p-3 flex flex-col justify-between min-w-0">
            <div className="space-y-1">
              {/* Category */}
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                {machine.category}
              </span>
              
              {/* Title */}
              <h3 className="font-semibold text-sm text-foreground line-clamp-1">
                {machine.name}
              </h3>
              
              {/* Location */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{locationText}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              {/* Rating */}
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">
                  {machine.rating?.toFixed(1) || "Novo"}
                </span>
                {machine.reviewCount && machine.reviewCount > 0 && (
                  <span className="text-xs text-muted-foreground">
                    ({machine.reviewCount})
                  </span>
                )}
              </div>

              {/* Price */}
              {displayPrice && (
                <div className="text-right">
                  <span className="text-sm font-bold text-primary">
                    R$ {displayPrice.toLocaleString('pt-BR')}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {priceUnit}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
};
