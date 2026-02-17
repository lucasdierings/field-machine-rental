import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tractor } from "lucide-react";

interface Machine {
    id: string;
    name?: string;
    brand?: string;
    model?: string;
    category: string;
    status: string;
    machine_images?: { image_url: string }[];
}

interface DashboardMachineCardProps {
    machine: Machine;
    revenue: number;
    reservations: number;
}

export const DashboardMachineCard = memo(({ machine, revenue, reservations }: DashboardMachineCardProps) => {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex gap-4">
                    {/* Machine Image */}
                    <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex-shrink-0 overflow-hidden">
                        {(machine.machine_images && machine.machine_images[0]?.image_url) ? (
                            <img
                                src={machine.machine_images[0].image_url}
                                alt={machine.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Tractor className="w-10 h-10 text-green-600" />
                            </div>
                        )}
                    </div>

                    {/* Machine Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-base mb-0.5 truncate">
                                    {machine.name || `${machine.brand} ${machine.model}`}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    {machine.category}
                                </p>
                            </div>
                            <div className="text-right ml-2 flex-shrink-0">
                                <p className="text-green-600 font-bold text-base">
                                    R$ {(revenue / 1000).toFixed(1)}k
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {reservations} reservas
                                </p>
                            </div>
                        </div>

                        <Badge
                            variant={machine.status === 'available' ? 'default' : 'secondary'}
                            className={machine.status === 'available'
                                ? 'bg-green-500 hover:bg-green-600'
                                : 'bg-red-500 hover:bg-red-600'
                            }
                        >
                            {machine.status === 'available' ? 'Ativo' : 'Inativo'}
                        </Badge>

                        {/* Occupancy Progress */}
                        <div className="mt-3">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-muted-foreground">Taxa de ocupação</span>
                                <span className="text-xs font-medium">0%</span>
                            </div>
                            <Progress value={0} className="h-2" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
});
DashboardMachineCard.displayName = 'DashboardMachineCard';
