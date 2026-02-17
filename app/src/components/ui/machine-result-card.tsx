import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { 
  MapPin, 
  Star, 
  Heart, 
  MessageCircle, 
  Eye, 
  Clock, 
  Calendar,
  CheckCircle,
  Wrench
} from "lucide-react";
import { MachineData } from "@/pages/Machines";

interface MachineResultCardProps {
  machine: MachineData;
  viewMode: 'grid' | 'list' | 'map';
}

export const MachineResultCard = ({ machine, viewMode }: MachineResultCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);

  // Mock data for demonstration
  const mockImages = [
    '/placeholder.svg',
    '/placeholder.svg',
    '/placeholder.svg'
  ];

  const distance = "12 km"; // Mock distance
  const rating = 4.8;
  const reviewCount = 23;
  const ownerName = "João Silva";
  const responseTime = "~2h";
  const hoursWorked = machine.specifications?.hours_worked || "1.245";

  const formatPrice = (price: number | undefined, type: string) => {
    if (!price) return "Sob consulta";
    return `R$ ${price.toLocaleString('pt-BR')}/${type}`;
  };

  const isListView = viewMode === 'list';

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${isListView ? 'flex-row' : ''}`}>
      <div className={`relative ${isListView ? 'w-48 flex-shrink-0' : 'aspect-[4/3]'}`}>
        {/* Image Carousel */}
        <Carousel className="w-full h-full">
          <CarouselContent>
            {(machine.images || mockImages).map((image, index) => (
              <CarouselItem key={index}>
                <div className={`relative ${isListView ? 'h-32' : 'aspect-[4/3]'}`}>
                  <img
                    src={image}
                    alt={`${machine.name} - Imagem ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          <Badge className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            VERIFICADO
          </Badge>
        </div>

        {/* Favorite Button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 bg-white/90 hover:bg-white"
          onClick={() => setIsFavorited(!isFavorited)}
        >
          <Heart
            className={`h-4 w-4 ${
              isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </Button>
      </div>

      <CardContent className={`p-4 ${isListView ? 'flex-1' : ''}`}>
        <div className="space-y-3">
          {/* Title and Location */}
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{machine.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span>Cidade • {distance}</span>
            </div>
          </div>

          {/* Specifications */}
          <div className="flex flex-wrap gap-2 text-sm">
            <Badge variant="outline">
              <Wrench className="h-3 w-3 mr-1" />
              {machine.specifications?.power || '180'} CV
            </Badge>
            <Badge variant="outline">
              <Calendar className="h-3 w-3 mr-1" />
              {machine.year || '2020'}
            </Badge>
            <Badge variant="outline">
              <Clock className="h-3 w-3 mr-1" />
              {hoursWorked}h
            </Badge>
          </div>

          {/* Pricing */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Preços:</span>
            </div>
            <div className="space-y-1 text-sm">
              {machine.price_hour && (
                <div className="flex justify-between">
                  <span>Por hora:</span>
                  <span className="font-medium">{formatPrice(machine.price_hour, 'h')}</span>
                </div>
              )}
              {machine.price_hectare && (
                <div className="flex justify-between">
                  <span>Por hectare:</span>
                  <span className="font-medium">{formatPrice(machine.price_hectare, 'ha')}</span>
                </div>
              )}
              {machine.price_day && (
                <div className="flex justify-between">
                  <span>Por dia:</span>
                  <span className="font-medium">{formatPrice(machine.price_day, 'dia')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{rating}</span>
            <span className="text-sm text-muted-foreground">({reviewCount} avaliações)</span>
          </div>

          {/* Owner Info */}
          <div className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>{ownerName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="text-sm font-medium">{ownerName}</div>
              <div className="text-xs text-muted-foreground">Responde em {responseTime}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Ver Detalhes
            </Button>
            <Button className="flex-1" size="sm">
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};