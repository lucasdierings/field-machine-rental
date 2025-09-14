import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Activity, Eye, Mouse, Users, Clock } from 'lucide-react';

interface AnalyticsData {
  id: string;
  event_type: string;
  page_url: string | null;
  search_query: string | null;
  created_at: string;
  user_agent: string | null;
  ip_address: string | null;
}

interface PageView {
  page_url: string;
  views: number;
}

interface EventSummary {
  event_type: string;
  count: number;
}

const AdminAnalyticsTab = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [eventSummary, setEventSummary] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Calculate date range
      const now = new Date();
      const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 1;
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - daysAgo);

      // Get recent analytics events
      const { data: recentEvents, error: eventsError } = await supabase
        .from('analytics')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false })
        .limit(50);

      if (eventsError) throw eventsError;

      setAnalyticsData(recentEvents || []);

      // Get page views summary
      const pageViewsMap = new Map<string, number>();
      recentEvents?.forEach(event => {
        if (event.page_url) {
          const current = pageViewsMap.get(event.page_url) || 0;
          pageViewsMap.set(event.page_url, current + 1);
        }
      });

      const topPages = Array.from(pageViewsMap.entries())
        .map(([page_url, views]) => ({ page_url, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

      setPageViews(topPages);

      // Get event summary
      const eventMap = new Map<string, number>();
      recentEvents?.forEach(event => {
        const current = eventMap.get(event.event_type) || 0;
        eventMap.set(event.event_type, current + 1);
      });

      const eventSummaryData = Array.from(eventMap.entries())
        .map(([event_type, count]) => ({ event_type, count }))
        .sort((a, b) => b.count - a.count);

      setEventSummary(eventSummaryData);

    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('pt-BR');
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'page_view':
        return <Eye className="h-4 w-4" />;
      case 'search_performed':
        return <Activity className="h-4 w-4" />;
      case 'button_click':
        return <Mouse className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getEventBadgeColor = (eventType: string) => {
    switch (eventType) {
      case 'page_view':
        return 'default';
      case 'search_performed':
        return 'secondary';
      case 'button_click':
        return 'outline';
      default:
        return 'outline';
    }
  };

  // Mock metrics (would need actual calculation from real data)
  const metrics = {
    uniqueVisitors: 1247,
    totalPageViews: 3891,
    bounceRate: 42.3,
    avgSessionTime: '3m 24s',
  };

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1d">Último dia</SelectItem>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Traffic Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitantes Únicos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.uniqueVisitors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Últimos {timeRange === '7d' ? '7 dias' : timeRange === '30d' ? '30 dias' : '24 horas'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalPageViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total de páginas visitadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Rejeição</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.bounceRate}%</div>
            <p className="text-xs text-muted-foreground">
              Visitantes com 1 página
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgSessionTime}</div>
            <p className="text-xs text-muted-foreground">
              Duração da sessão
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Páginas Mais Visitadas</CardTitle>
            <CardDescription>Top 10 páginas por visualizações</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pageViews.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nenhum dado disponível
                </p>
              ) : (
                pageViews.map((page, index) => (
                  <div key={page.page_url} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        #{index + 1}
                      </span>
                      <span className="text-sm truncate max-w-[200px]" title={page.page_url}>
                        {page.page_url || 'Página inicial'}
                      </span>
                    </div>
                    <Badge variant="secondary">
                      {page.views} views
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Event Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Eventos por Tipo</CardTitle>
            <CardDescription>Atividades mais frequentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {eventSummary.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nenhum evento registrado
                </p>
              ) : (
                eventSummary.map((event) => (
                  <div key={event.event_type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getEventIcon(event.event_type)}
                      <span className="text-sm capitalize">
                        {event.event_type.replace('_', ' ')}
                      </span>
                    </div>
                    <Badge variant={getEventBadgeColor(event.event_type) as any}>
                      {event.count}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle>Eventos Recentes</CardTitle>
          <CardDescription>Últimas 50 atividades registradas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Página</TableHead>
                  <TableHead>Busca</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>User Agent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell colSpan={5} className="text-center py-4">
                        <div className="animate-pulse flex space-x-4">
                          <div className="rounded bg-muted h-4 w-full"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : analyticsData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Nenhum evento encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  analyticsData.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <Badge 
                          variant={getEventBadgeColor(event.event_type) as any} 
                          className="gap-1"
                        >
                          {getEventIcon(event.event_type)}
                          {event.event_type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {event.page_url || '-'}
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate">
                        {event.search_query || '-'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(event.created_at)}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground">
                        {event.user_agent || '-'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalyticsTab;