import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Tractor, TrendingUp, Activity, Handshake } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from 'recharts';

interface DashboardStats {
  total_users: number;
  active_users_30d: number;
  new_users_30d: number;
  total_machines: number;
  available_machines: number;
  total_bookings: number;
  pending_bookings: number;
  completed_bookings: number;
  total_negotiations: number;
  negotiations_30d: number;
  search_alerts_count: number;
}

interface CategoryData { name: string; value: number; }
interface CityData { city: string; users: number; }
interface TransactionRow {
  id: string;
  machine_name: string;
  renter_name: string;
  value: number;
  date: string;
  billing_type?: string;
  billing_quantity?: number;
}
interface UserGrowthRow { month: string; users: number; }

interface AdminOverviewTabProps {
  stats: DashboardStats | null;
  categoryData: CategoryData[];
  cityData: CityData[];
  transactions: TransactionRow[];
  userGrowth: UserGrowthRow[];
  calculateConversionRate: () => string;
}

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];

export function AdminOverviewTab({
  stats,
  categoryData,
  cityData,
  transactions,
  userGrowth,
  calculateConversionRate,
}: AdminOverviewTabProps) {
  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Totais</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_users || 0}</div>
            <p className="text-xs text-green-600">
              {stats?.active_users_30d || 0} ativos nos últimos 30 dias
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas de Busca</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.search_alerts_count || 0}</div>
            <p className="text-xs text-muted-foreground">Usuários monitorando</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Máquinas Ativas</CardTitle>
            <Tractor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.available_machines || 0}</div>
            <p className="text-xs text-muted-foreground">
              de {stats?.total_machines || 0} cadastradas
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Negociações (30d)</CardTitle>
            <Handshake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {(stats?.negotiations_30d || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Total: R$ {(stats?.total_negotiations || 0).toLocaleString('pt-BR')}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateConversionRate()}%</div>
            <p className="text-xs text-muted-foreground">
              {stats?.completed_bookings || 0} reservas concluídas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Reservas</CardTitle>
            <CardDescription>Status atual</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-bold">{stats?.total_bookings || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Pendentes</span>
              <span className="font-bold text-yellow-600">{stats?.pending_bookings || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Concluídas</span>
              <span className="font-bold text-green-600">{stats?.completed_bookings || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usuários</CardTitle>
            <CardDescription>Atividade</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-bold">{stats?.total_users || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Ativos (30d)</span>
              <span className="font-bold text-green-600">{stats?.active_users_30d || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Inativos</span>
              <span className="font-bold text-yellow-600">
                {(stats?.total_users || 0) - (stats?.active_users_30d || 0)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Negociações Realizadas</CardTitle>
            <CardDescription>Valor total de reservas concluídas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total histórico</span>
              <span className="font-bold">
                R$ {(stats?.total_negotiations || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Últimos 30 dias</span>
              <span className="font-bold text-green-600">
                R$ {(stats?.negotiations_30d || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Reservas concluídas</span>
              <span className="font-bold text-green-600">{stats?.completed_bookings || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* User Growth Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Crescimento de Usuários</CardTitle>
            <CardDescription>Novos cadastros por mês</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {userGrowth.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowth} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="users"
                    name="Usuários"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ fill: '#22c55e', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                Sem dados suficientes
              </div>
            )}
          </CardContent>
        </Card>

        {/* Machines by Category Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Máquinas por Categoria</CardTitle>
            <CardDescription>Distribuição atual</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value} máquinas`, '']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                Sem dados
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top 10 Cities Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Cidades</CardTitle>
            <CardDescription>Usuários e prestadores por cidade</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {cityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={cityData}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                  <YAxis dataKey="city" type="category" tick={{ fontSize: 10 }} width={90} />
                  <Tooltip />
                  <Bar dataKey="users" name="Usuários" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                Sem dados de cidade nos perfis
              </div>
            )}
          </CardContent>
        </Card>

        {/* Latest Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Últimas Negociações</CardTitle>
            <CardDescription>5 reservas concluídas mais recentes</CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length > 0 ? (
              <div className="space-y-1">
                <div className="grid grid-cols-3 text-xs font-semibold text-muted-foreground pb-2 border-b">
                  <span>Máquina / Solicitante</span>
                  <span className="text-center">Data</span>
                  <span className="text-right">Valor</span>
                </div>
                {transactions.map((tx) => (
                  <div key={tx.id} className="grid grid-cols-3 text-sm py-2 border-b last:border-0 items-center">
                    <div>
                      <p className="font-medium truncate">{tx.machine_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{tx.renter_name}</p>
                      {tx.billing_type && tx.billing_quantity && (
                        <p className="text-xs text-blue-600">
                          {tx.billing_quantity} {tx.billing_type === 'hora' ? 'h' : tx.billing_type === 'hectare' ? 'ha' : tx.billing_type === 'dia' ? 'dias' : tx.billing_type}
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      {new Date(tx.date).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="font-semibold text-green-600 text-right">
                      R$ {tx.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                Nenhuma negociação concluída ainda
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
