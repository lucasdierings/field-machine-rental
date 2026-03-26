import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Activity, Eye, Users, Monitor, Smartphone, Globe,
  ArrowUp, ArrowDown, Minus, BarChart3, MapPin
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316'];

const PAGE_LABELS: Record<string, string> = {
  '/': 'Home',
  '/servicos-agricolas': 'Busca',
  '/prestadores': 'Prestadores',
  '/servicos': 'Categorias',
  '/login': 'Login',
  '/cadastro': 'Cadastro',
  '/onboarding': 'Onboarding',
  '/dashboard': 'Dashboard',
  '/como-funciona': 'Como Funciona',
  '/sobre': 'Sobre',
  '/contato': 'Contato',
  '/suporte': 'Suporte',
  '/add-machine': 'Cadastrar Máquina',
  '/oferecer-servicos': 'Oferecer Serviços',
};

const AdminAnalyticsTab = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  const [metrics, setMetrics] = useState({
    uniqueVisitors: 0,
    totalPageViews: 0,
    uniqueSessions: 0,
    avgPagesPerSession: 0,
    mobilePercent: 0,
    desktopPercent: 0,
    newUsersInPeriod: 0,
    activeUsersInPeriod: 0,
  });

  const [topPages, setTopPages] = useState<{ page: string; views: number }[]>([]);
  const [platformData, setPlatformData] = useState<{ name: string; value: number }[]>([]);
  const [dailyViews, setDailyViews] = useState<{ date: string; views: number; visitors: number }[]>([]);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [topReferrers, setTopReferrers] = useState<{ source: string; count: number }[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const days = timeRange === '1d' ? 1 : timeRange === '7d' ? 7 : 30;
      const startDate = subDays(new Date(), days).toISOString();

      // Fetch all events in period
      const { data: events, error } = await supabase
        .from('analytics')
        .select('*')
        .gte('created_at', startDate)
        .order('created_at', { ascending: false });

      if (error) throw error;
      const allEvents = events || [];

      // --- Metrics ---
      const pageViews = allEvents.filter(e => e.event_type === 'page_view');
      const uniqueIPs = new Set(allEvents.map(e => e.ip_address).filter(Boolean));
      const uniqueSessions = new Set(allEvents.map(e => e.session_id).filter(Boolean));
      const uniqueUserIds = new Set(allEvents.map(e => e.user_id).filter(Boolean));

      const avgPages = uniqueSessions.size > 0 ? pageViews.length / uniqueSessions.size : 0;

      // Platform breakdown from metadata
      let mobileCount = 0;
      let desktopCount = 0;
      const platformMap = new Map<string, number>();

      allEvents.forEach(e => {
        const meta = e.metadata as any;
        const platform = meta?.platform || parsePlatformFromUA(e.user_agent);
        if (platform) {
          platformMap.set(platform, (platformMap.get(platform) || 0) + 1);
        }
        if (['iOS', 'Android'].includes(platform)) mobileCount++;
        else desktopCount++;
      });

      const total = mobileCount + desktopCount || 1;

      setMetrics({
        uniqueVisitors: Math.max(uniqueIPs.size, uniqueUserIds.size),
        totalPageViews: pageViews.length,
        uniqueSessions: uniqueSessions.size,
        avgPagesPerSession: Math.round(avgPages * 10) / 10,
        mobilePercent: Math.round((mobileCount / total) * 100),
        desktopPercent: Math.round((desktopCount / total) * 100),
        newUsersInPeriod: 0, // Will be filled from user_profiles
        activeUsersInPeriod: uniqueUserIds.size,
      });

      // --- Top Pages ---
      const pageMap = new Map<string, number>();
      pageViews.forEach(e => {
        const path = e.page_url?.split('?')[0] || '/';
        pageMap.set(path, (pageMap.get(path) || 0) + 1);
      });
      setTopPages(
        Array.from(pageMap.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([page, views]) => ({ page, views }))
      );

      // --- Platform pie ---
      setPlatformData(
        Array.from(platformMap.entries())
          .sort((a, b) => b[1] - a[1])
          .map(([name, value]) => ({ name, value }))
      );

      // --- Daily views ---
      const dayMap = new Map<string, { views: number; visitors: Set<string> }>();
      for (let i = days - 1; i >= 0; i--) {
        const d = format(subDays(new Date(), i), 'dd/MM');
        dayMap.set(d, { views: 0, visitors: new Set() });
      }
      pageViews.forEach(e => {
        const d = format(new Date(e.created_at!), 'dd/MM');
        const entry = dayMap.get(d);
        if (entry) {
          entry.views++;
          if (e.ip_address || e.user_id) entry.visitors.add(e.ip_address || e.user_id);
        }
      });
      setDailyViews(
        Array.from(dayMap.entries()).map(([date, { views, visitors }]) => ({
          date,
          views,
          visitors: visitors.size,
        }))
      );

      // --- Referrers ---
      const refMap = new Map<string, number>();
      allEvents.forEach(e => {
        const meta = e.metadata as any;
        const ref = meta?.referrer;
        if (ref && ref !== '') {
          try {
            const hostname = new URL(ref).hostname || ref;
            const source = hostname.replace('www.', '');
            refMap.set(source, (refMap.get(source) || 0) + 1);
          } catch {
            refMap.set(ref, (refMap.get(ref) || 0) + 1);
          }
        }
      });
      setTopReferrers(
        Array.from(refMap.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([source, count]) => ({ source, count }))
      );

      // --- Recent events (last 30) ---
      setRecentEvents(allEvents.slice(0, 30));

      // --- New users in period ---
      const { count: newUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate);

      setMetrics(prev => ({ ...prev, newUsersInPeriod: newUsers || 0 }));

    } catch (error) {
      if (import.meta.env.DEV) console.error('Analytics load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const periodLabel = timeRange === '1d' ? '24h' : timeRange === '7d' ? '7 dias' : '30 dias';

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-lg" />)}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-72 rounded-lg" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Analytics</h2>
          <p className="text-sm text-muted-foreground">Acompanhe o uso da plataforma em tempo real</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1d">Últimas 24h</SelectItem>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitantes</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.uniqueVisitors}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.uniqueSessions} sessões nos últimos {periodLabel}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalPageViews}</div>
            <p className="text-xs text-muted-foreground">
              ~{metrics.avgPagesPerSession} páginas/sessão
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Activity className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeUsersInPeriod}</div>
            <p className="text-xs text-muted-foreground">
              +{metrics.newUsersInPeriod} novos nos últimos {periodLabel}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dispositivos</CardTitle>
            <Smartphone className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <span className="text-lg">{metrics.mobilePercent}%</span>
              <Smartphone className="h-4 w-4" />
              <span className="text-muted-foreground">/</span>
              <span className="text-lg">{metrics.desktopPercent}%</span>
              <Monitor className="h-4 w-4" />
            </div>
            <p className="text-xs text-muted-foreground">Mobile vs Desktop</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Daily Views Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Acessos por Dia</CardTitle>
            <CardDescription>Page views e visitantes únicos</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            {dailyViews.length > 0 && dailyViews.some(d => d.views > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyViews} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="views" name="Page Views" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="visitors" name="Visitantes" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <BarChart3 className="h-10 w-10 mb-2 opacity-30" />
                <p className="text-sm">Os dados aparecerão conforme os usuários acessarem o app</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Platform Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Plataformas de Acesso</CardTitle>
            <CardDescription>De onde os usuários acessam</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            {platformData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {platformData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value} acessos`, '']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <Smartphone className="h-10 w-10 mb-2 opacity-30" />
                <p className="text-sm">Sem dados de plataforma ainda</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Top Pages */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Páginas Mais Acessadas</CardTitle>
            <CardDescription>Top 10 no período</CardDescription>
          </CardHeader>
          <CardContent>
            {topPages.length > 0 ? (
              <div className="space-y-3">
                {topPages.map((page, i) => {
                  const maxViews = topPages[0]?.views || 1;
                  const percent = (page.views / maxViews) * 100;
                  const label = PAGE_LABELS[page.page] || page.page;
                  return (
                    <div key={page.page} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="truncate max-w-[250px]" title={page.page}>
                          <span className="text-muted-foreground mr-2">#{i + 1}</span>
                          {label}
                        </span>
                        <span className="font-medium">{page.views}</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">Nenhum acesso registrado ainda</p>
            )}
          </CardContent>
        </Card>

        {/* Sources / Referrers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Origens de Tráfego
            </CardTitle>
            <CardDescription>De onde vieram os visitantes</CardDescription>
          </CardHeader>
          <CardContent>
            {topReferrers.length > 0 ? (
              <div className="space-y-3">
                {topReferrers.map((ref) => (
                  <div key={ref.source} className="flex items-center justify-between text-sm">
                    <span className="truncate max-w-[160px]">{ref.source}</span>
                    <Badge variant="secondary">{ref.count}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <MapPin className="h-8 w-8 mx-auto mb-2 opacity-30 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Acesso direto (sem referrer)</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Atividade Recente</CardTitle>
          <CardDescription>Últimos 30 eventos registrados</CardDescription>
        </CardHeader>
        <CardContent>
          {recentEvents.length > 0 ? (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {recentEvents.map((event) => {
                const meta = event.metadata as any;
                const platform = meta?.platform || parsePlatformFromUA(event.user_agent);
                const pageName = PAGE_LABELS[event.page_url?.split('?')[0]] || event.page_url || '/';
                return (
                  <div key={event.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors text-sm">
                    <div className="shrink-0">
                      {event.event_type === 'page_view' ? (
                        <Eye className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Activity className="h-4 w-4 text-orange-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium">{pageName}</span>
                      {event.search_query && (
                        <span className="text-muted-foreground ml-1">— buscou "{event.search_query}"</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0 text-xs text-muted-foreground">
                      {platform === 'iOS' || platform === 'Android' ? (
                        <Smartphone className="h-3 w-3" />
                      ) : (
                        <Monitor className="h-3 w-3" />
                      )}
                      <span>{format(new Date(event.created_at), "dd/MM HH:mm")}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Nenhuma atividade registrada ainda.</p>
              <p className="text-xs mt-1">Os dados aparecerão automaticamente quando os usuários acessarem o app.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

function parsePlatformFromUA(ua?: string | null): string {
  if (!ua) return 'Other';
  if (/iPhone|iPad|iPod/.test(ua)) return 'iOS';
  if (/Android/.test(ua)) return 'Android';
  if (/Mac/.test(ua)) return 'macOS';
  if (/Win/.test(ua)) return 'Windows';
  if (/Linux/.test(ua)) return 'Linux';
  return 'Other';
}

export default AdminAnalyticsTab;
