import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ServiceStatus {
  name: string;
  label: string;
  status: "operational" | "degraded" | "down" | "checking";
  responseTime?: number;
}

interface DayStatus {
  date: string;
  status: "operational" | "degraded" | "down" | "no-data";
  uptime: number;
}

interface ServiceHistory {
  name: string;
  label: string;
  currentStatus: "operational" | "degraded" | "down" | "checking";
  days: DayStatus[];
  uptimePercent: number;
}

const SERVICES = [
  { name: "app", label: "App (app.fieldmachine.com.br)", url: "https://app.fieldmachine.com.br" },
  { name: "site", label: "Site (fieldmachine.com.br)", url: "https://fieldmachine.com.br" },
  { name: "supabase", label: "Banco de Dados (Supabase)", url: `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/` },
];

const STATUS_COLORS = {
  operational: "#22c55e",
  degraded: "#f59e0b",
  down: "#ef4444",
  "no-data": "#d1d5db",
  checking: "#9ca3af",
};

const STATUS_LABELS: Record<string, string> = {
  operational: "Operacional",
  degraded: "Degradado",
  down: "Fora do ar",
  checking: "Verificando...",
};

const INCIDENT_STATUS_LABELS: Record<string, string> = {
  investigating: "Investigando",
  identified: "Identificado",
  monitoring: "Monitorando",
  resolved: "Resolvido",
};

const INCIDENT_STATUS_COLORS: Record<string, string> = {
  investigating: "#ef4444",
  identified: "#f59e0b",
  monitoring: "#3b82f6",
  resolved: "#22c55e",
};

interface Incident {
  id: string;
  title: string;
  status: string;
  created_at: string;
  resolved_at: string | null;
  updates: IncidentUpdate[];
}

interface IncidentUpdate {
  id: string;
  status: string;
  message: string;
  created_at: string;
}

function getOverallStatus(services: ServiceHistory[]): { label: string; color: string; bg: string } {
  if (services.some((s) => s.currentStatus === "down"))
    return { label: "Alguns sistemas com problemas", color: "#fff", bg: "#ef4444" };
  if (services.some((s) => s.currentStatus === "degraded"))
    return { label: "Desempenho degradado em alguns sistemas", color: "#000", bg: "#f59e0b" };
  return { label: "Todos os sistemas operacionais", color: "#fff", bg: "#65a30d" };
}

function getLast90Days(): string[] {
  const days: string[] = [];
  for (let i = 89; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

export default function Status() {
  const [services, setServices] = useState<ServiceHistory[]>(
    SERVICES.map((s) => ({
      name: s.name,
      label: s.label,
      currentStatus: "checking",
      days: [],
      uptimePercent: 0,
    }))
  );
  const [lastChecked, setLastChecked] = useState<string>("");
  const [incidents, setIncidents] = useState<Incident[]>([]);

  const checkServiceHealth = useCallback(async (service: typeof SERVICES[0]): Promise<ServiceStatus> => {
    const start = performance.now();
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(service.url, {
        method: "HEAD",
        mode: "no-cors",
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const responseTime = Math.round(performance.now() - start);
      const status = response.ok || response.type === "opaque" ? "operational" : "degraded";

      return { name: service.name, label: service.label, status, responseTime };
    } catch {
      const responseTime = Math.round(performance.now() - start);
      if (responseTime > 8000) {
        return { name: service.name, label: service.label, status: "down", responseTime };
      }
      return { name: service.name, label: service.label, status: "degraded", responseTime };
    }
  }, []);

  const saveHealthCheck = useCallback(async (result: ServiceStatus) => {
    try {
      await supabase.from("health_checks").insert({
        service_name: result.name,
        status: result.status,
        response_time_ms: result.responseTime || null,
      });
    } catch {
      // Silent fail — don't break status page if DB is down
    }
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const { data } = await supabase
        .from("health_checks")
        .select("service_name, status, checked_at")
        .gte("checked_at", ninetyDaysAgo.toISOString())
        .order("checked_at", { ascending: true });

      if (!data) return {};

      const byService: Record<string, Record<string, { total: number; operational: number; degraded: number; down: number }>> = {};

      for (const row of data) {
        const day = row.checked_at.split("T")[0];
        if (!byService[row.service_name]) byService[row.service_name] = {};
        if (!byService[row.service_name][day]) {
          byService[row.service_name][day] = { total: 0, operational: 0, degraded: 0, down: 0 };
        }
        const d = byService[row.service_name][day];
        d.total++;
        if (row.status === "operational") d.operational++;
        else if (row.status === "degraded") d.degraded++;
        else d.down++;
      }

      return byService;
    } catch {
      return {};
    }
  }, []);

  const loadIncidents = useCallback(async () => {
    try {
      const fifteenDaysAgo = new Date();
      fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

      const { data: incidentsData } = await supabase
        .from("incidents")
        .select("*")
        .gte("created_at", fifteenDaysAgo.toISOString())
        .order("created_at", { ascending: false });

      if (!incidentsData || incidentsData.length === 0) {
        setIncidents([]);
        return;
      }

      const incidentIds = incidentsData.map((i) => i.id);
      const { data: updatesData } = await supabase
        .from("incident_updates")
        .select("*")
        .in("incident_id", incidentIds)
        .order("created_at", { ascending: false });

      const updatesMap: Record<string, IncidentUpdate[]> = {};
      for (const u of updatesData || []) {
        if (!updatesMap[u.incident_id]) updatesMap[u.incident_id] = [];
        updatesMap[u.incident_id].push({ id: u.id, status: u.status, message: u.message, created_at: u.created_at });
      }

      setIncidents(
        incidentsData.map((i) => ({
          ...i,
          updates: updatesMap[i.id] || [],
        }))
      );
    } catch {
      // Silent fail
    }
  }, []);

  const runChecks = useCallback(async () => {
    const [results, history] = await Promise.all([
      Promise.all(SERVICES.map(checkServiceHealth)),
      loadHistory(),
      loadIncidents(),
    ]);

    // Save current checks
    await Promise.all(results.map(saveHealthCheck));

    const days90 = getLast90Days();

    const updated: ServiceHistory[] = results.map((result) => {
      const serviceHistory = history[result.name] || {};

      const days: DayStatus[] = days90.map((date) => {
        const dayData = serviceHistory[date];
        if (!dayData) return { date, status: "no-data" as const, uptime: 0 };

        const uptime = (dayData.operational / dayData.total) * 100;
        let status: DayStatus["status"] = "operational";
        if (dayData.down > 0) status = "down";
        else if (dayData.degraded > 0 || uptime < 99) status = "degraded";

        return { date, status, uptime };
      });

      const daysWithData = days.filter((d) => d.status !== "no-data");
      const uptimePercent =
        daysWithData.length > 0
          ? daysWithData.reduce((sum, d) => sum + d.uptime, 0) / daysWithData.length
          : 100;

      return {
        name: result.name,
        label: result.label,
        currentStatus: result.status === "checking" ? "operational" : result.status,
        days,
        uptimePercent,
      };
    });

    setServices(updated);
    setLastChecked(new Date().toLocaleTimeString("pt-BR"));
  }, [checkServiceHealth, loadHistory, saveHealthCheck]);

  useEffect(() => {
    runChecks();
    const interval = setInterval(runChecks, 60000);
    return () => clearInterval(interval);
  }, [runChecks]);

  const overall = getOverallStatus(services);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fafaf9", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#111" }}>
            <span style={{ color: "#16a34a" }}>Field Machine</span> Status
          </h1>
          {lastChecked && (
            <span style={{ fontSize: 13, color: "#9ca3af" }}>
              Atualizado: {lastChecked}
            </span>
          )}
        </div>

        {/* Overall status banner */}
        <div
          style={{
            backgroundColor: overall.bg,
            color: overall.color,
            padding: "20px 28px",
            borderRadius: 8,
            fontSize: 18,
            fontWeight: 600,
            marginBottom: 48,
          }}
        >
          {overall.label}
        </div>

        {/* Uptime header */}
        <p style={{ textAlign: "right", fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
          Uptime nos ultimos 90 dias
        </p>

        {/* Service cards */}
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
          {services.map((service, idx) => (
            <div
              key={service.name}
              style={{
                padding: "24px 28px",
                borderBottom: idx < services.length - 1 ? "1px solid #e5e7eb" : "none",
                backgroundColor: "#fff",
              }}
            >
              {/* Service header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 16, fontWeight: 600, color: "#111" }}>{service.label}</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: STATUS_COLORS[service.currentStatus] }}>
                  {STATUS_LABELS[service.currentStatus]}
                </span>
              </div>

              {/* Uptime bars */}
              <div style={{ display: "flex", gap: 1.5, marginBottom: 8 }}>
                {service.days.length > 0 ? (
                  service.days.map((day, i) => (
                    <div
                      key={i}
                      title={`${day.date}: ${day.status === "no-data" ? "Sem dados" : `${day.uptime.toFixed(1)}% uptime`}`}
                      style={{
                        flex: 1,
                        height: 32,
                        backgroundColor: STATUS_COLORS[day.status],
                        borderRadius: 2,
                        cursor: "pointer",
                        transition: "opacity 0.15s",
                      }}
                      onMouseEnter={(e) => { (e.target as HTMLElement).style.opacity = "0.7"; }}
                      onMouseLeave={(e) => { (e.target as HTMLElement).style.opacity = "1"; }}
                    />
                  ))
                ) : (
                  // Placeholder bars while loading
                  Array.from({ length: 90 }, (_, i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: 32,
                        backgroundColor: "#e5e7eb",
                        borderRadius: 2,
                      }}
                    />
                  ))
                )}
              </div>

              {/* Footer */}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#9ca3af" }}>
                <span>90 dias atras</span>
                <span>{service.uptimePercent > 0 ? `${service.uptimePercent.toFixed(2)} % uptime` : ""}</span>
                <span>Hoje</span>
              </div>
            </div>
          ))}
        </div>

        {/* Past Incidents */}
        <PastIncidents incidents={incidents} />

        {/* Footer */}
        <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: 40 }}>
          Verificado automaticamente a cada 60 segundos
        </p>
      </div>
    </div>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" });
}

function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", { day: "numeric", month: "short" }) + ", " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function PastIncidents({ incidents }: { incidents: Incident[] }) {
  // Group incidents by day
  const groupedByDay = useMemo(() => {
    const days: Record<string, Incident[]> = {};
    const last7 = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7.push(d.toISOString().split("T")[0]);
    }

    for (const day of last7) {
      days[day] = incidents.filter((inc) => inc.created_at.split("T")[0] === day);
    }
    return days;
  }, [incidents]);

  return (
    <div style={{ marginTop: 56 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: "#111", marginBottom: 24 }}>
        Incidentes Recentes
      </h2>

      {Object.entries(groupedByDay).map(([day, dayIncidents]) => (
        <div key={day} style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111", paddingBottom: 8, borderBottom: "2px solid #e5e7eb", marginBottom: 12 }}>
            {formatDate(day)}
          </h3>

          {dayIncidents.length === 0 ? (
            <p style={{ fontSize: 14, color: "#9ca3af", fontStyle: "italic" }}>
              Nenhum incidente reportado.
            </p>
          ) : (
            dayIncidents.map((incident) => (
              <div key={incident.id} style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 16, fontWeight: 600, color: INCIDENT_STATUS_COLORS[incident.status] || "#f59e0b", marginBottom: 12 }}>
                  {incident.title}
                </h4>

                {incident.updates.map((update) => (
                  <div key={update.id} style={{ marginBottom: 16 }}>
                    <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>
                      <strong>{INCIDENT_STATUS_LABELS[update.status] || update.status}</strong>
                      {" - "}
                      {update.message}
                    </p>
                    <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>
                      {formatDateTime(update.created_at)}
                    </p>
                  </div>
                ))}

                {incident.updates.length === 0 && (
                  <p style={{ fontSize: 14, color: "#374151" }}>
                    <strong>{INCIDENT_STATUS_LABELS[incident.status]}</strong> - Incidente registrado.
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  );
}
