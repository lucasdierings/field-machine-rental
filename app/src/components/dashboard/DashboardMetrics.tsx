import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Tractor, ShoppingCart, BarChart3, Calendar } from "lucide-react";

interface Metrics {
    monthlyRevenue: number;
    revenueChange: number;
    occupancyRate: number;
    occupancyChange: number;
    activeMachines: number;
    pendingRequests: number;
    monthlyEarnings: number;
    upcomingReservations: number;
}

interface DashboardMetricsProps {
    metrics: Metrics;
}

export function DashboardMetrics({ metrics }: DashboardMetricsProps) {
    return (
        <>
            {/* Hero Card - Blue */}
            <Card className="mb-6 bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg">
                <CardContent className="p-6">
                    <h2 className="text-white text-xl font-bold mb-6">Painel do Proprietário</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Monthly Revenue */}
                        <div>
                            <p className="text-blue-100 text-sm mb-1">Faturamento Mensal</p>
                            <div className="flex items-end gap-3">
                                <h3 className="text-white text-4xl font-bold">
                                    R$ {(metrics.monthlyRevenue / 1000).toFixed(1)}k
                                </h3>
                                <div className="flex items-center gap-1 text-white mb-1">
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="text-sm">+{metrics.revenueChange}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Occupancy Rate */}
                        <div>
                            <p className="text-blue-100 text-sm mb-1">Taxa de Ocupação</p>
                            <div className="flex items-end gap-3">
                                <h3 className="text-white text-4xl font-bold">
                                    {metrics.occupancyRate}%
                                </h3>
                                <div className="flex items-center gap-1 text-white mb-1">
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="text-sm">+{metrics.occupancyChange}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Metrics Grid 2x2 */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Active Machines */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                <Tractor className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-muted-foreground text-xs mb-1">Máquinas Ativas</p>
                                <p className="text-2xl font-bold">{metrics.activeMachines}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Pending Requests */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                                <ShoppingCart className="w-6 h-6 text-orange-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-muted-foreground text-xs mb-1">Solicitações</p>
                                <p className="text-2xl font-bold">{metrics.pendingRequests}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Monthly Earnings */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <BarChart3 className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-muted-foreground text-xs mb-1">Ganhos do Mês</p>
                                <p className="text-2xl font-bold">R$ {(metrics.monthlyEarnings / 1000).toFixed(1)}k</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Upcoming Reservations */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-muted-foreground text-xs mb-1">Próximas Reservas</p>
                                <p className="text-2xl font-bold">{metrics.upcomingReservations}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
