import { Card, CardContent } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Star, MapPin, Eye, Shield, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DemoMachine } from '@/data/demo-machines';
import { formatDistance } from '@/lib/geolocation';

interface EnhancedMachineCardProps {
    machine: DemoMachine;
    distance?: number; // Distance in km
    onViewDetails?: () => void;
}

export function EnhancedMachineCard({
    machine,
    distance,
    onViewDetails
}: EnhancedMachineCardProps) {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        if (onViewDetails) {
            onViewDetails();
        } else {
            navigate(`/prestador/${machine.id}`);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    // Render rating stars
    const renderStars = () => {
        const fullStars = Math.floor(machine.rating);
        const hasHalfStar = machine.rating % 1 !== 0;

        return (
            <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`h-4 w-4 ${i < fullStars
                            ? 'fill-yellow-400 text-yellow-400'
                            : hasHalfStar && i === fullStars
                                ? 'fill-yellow-400/50 text-yellow-400'
                                : 'fill-gray-200 text-gray-200'
                            }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
            {/* Large Image */}
            <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                <img
                    src={machine.images[0]}
                    alt={machine.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop';
                    }}
                />

                {/* Category Badge Overlay */}
                <div className="absolute top-3 left-3">
                    <Badge className="bg-primary/90 backdrop-blur-sm text-primary-foreground shadow-lg">
                        {machine.category}
                    </Badge>
                </div>

                {/* Verified/Insurance Badges */}
                <div className="absolute top-3 right-3 flex gap-2">
                    {machine.verified && (
                        <Badge className="bg-green-600/90 backdrop-blur-sm text-white shadow-lg">
                            <Shield className="h-3 w-3 mr-1" />
                            Verificado
                        </Badge>
                    )}
                    {machine.deliveryAvailable && (
                        <Badge className="bg-blue-600/90 backdrop-blur-sm text-white shadow-lg">
                            <Truck className="h-3 w-3" />
                        </Badge>
                    )}
                </div>
            </div>

            <CardContent className="p-5 space-y-3">
                {/* Machine Name */}
                <div>
                    <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                        {machine.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {machine.brand} • {machine.year}
                    </p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                    {renderStars()}
                    <span className="font-semibold text-sm">{machine.rating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">
                        ({machine.reviewCount} {machine.reviewCount === 1 ? 'avaliação' : 'avaliações'})
                    </span>
                </div>

                {/* Price Highlighted */}
                <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-3 border border-primary/20">
                    <div className="flex items-baseline justify-between">
                        <div>
                            <span className="text-2xl font-bold text-primary">
                                {formatPrice(machine.price_hour)}
                            </span>
                            <span className="text-sm text-muted-foreground ml-1">/hora</span>
                        </div>
                        {machine.price_day && (
                            <div className="text-right">
                                <div className="text-xs text-muted-foreground">ou</div>
                                <div className="text-sm font-semibold">
                                    {formatPrice(machine.price_day)}/dia
                                </div>
                            </div>
                        )}
                    </div>
                    {machine.price_hectare && (
                        <div className="text-sm text-muted-foreground mt-1">
                            {formatPrice(machine.price_hectare)}/hectare
                        </div>
                    )}
                </div>

                {/* Approximate Distance */}
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{machine.location.city}/{machine.location.state}</span>
                    {distance !== undefined && (
                        <>
                            <span>•</span>
                            <span className="font-medium">{formatDistance(distance)}</span>
                        </>
                    )}
                </div>

                {/* Ver Detalhes Button */}
                <Button
                    onClick={handleViewDetails}
                    className="w-full mt-2"
                    size="lg"
                >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                </Button>
            </CardContent>
        </Card>
    );
}
