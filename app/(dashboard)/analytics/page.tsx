"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import {
  Users,
  Send,
  Mail,
  MessageSquare,
  CalendarCheck,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import { useLeads, useCampaigns } from "@/lib/hooks/useData";
import { LEAD_STATUS_CONFIG } from "@/lib/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  FunnelChart,
  Funnel,
  LabelList,
  Cell,
} from "recharts";

const TEAL = "#25CAD2";
const NAVY = "#00395E";

function getKpiData(leads: any[], campaigns: any[]) {
  const sent = campaigns.reduce((a: number, c: any) => a + (c.totalSent || 0), 0);
  const opened = campaigns.reduce((a: number, c: any) => a + (c.totalOpened || 0), 0);
  const replied = campaigns.reduce((a: number, c: any) => a + (c.totalReplied || 0), 0);
  return [
    { title: "Total Contactos", value: leads.length.toString(), change: "+12%", trend: "up" as const, icon: Users, description: "vs. mes anterior" },
    { title: "Emails Enviados", value: sent.toString(), change: "+8%", trend: "up" as const, icon: Send, description: "vs. mes anterior" },
    { title: "Tasa de Apertura", value: sent > 0 ? `${Math.round((opened / sent) * 100)}%` : "0%", change: "+3%", trend: "up" as const, icon: Mail, description: "vs. mes anterior" },
    { title: "Tasa de Respuesta", value: sent > 0 ? `${Math.round((replied / sent) * 100)}%` : "0%", change: "+2%", trend: "up" as const, icon: MessageSquare, description: "vs. mes anterior" },
    { title: "Reuniones Agendadas", value: "5", change: "+25%", trend: "up" as const, icon: CalendarCheck, description: "vs. mes anterior" },
    { title: "Pipeline Value", value: "$48.5K", change: "+18%", trend: "up" as const, icon: DollarSign, description: "vs. mes anterior" },
  ];
}

function getFunnelStages(leads: any[]) {
  return [
    { name: "Descubiertos", count: leads.length, color: "#94a3b8" },
    { name: "Enriquecidos", count: leads.filter((l: any) => ["enriched", "eligible", "in_sequence", "engaged", "ready_to_sync", "synced"].includes(l.status)).length, color: "#a78bfa" },
    { name: "En Campaña", count: leads.filter((l: any) => ["in_sequence", "engaged", "ready_to_sync", "synced"].includes(l.status)).length, color: TEAL },
    { name: "Contactados", count: leads.filter((l: any) => ["engaged", "ready_to_sync", "synced"].includes(l.status)).length, color: "#fbbf24" },
    { name: "Sincronizados", count: leads.filter((l: any) => l.status === "synced").length, color: "#22c55e" },
  ];
}

const activityOverTime = [
  { week: "Sem 1", Descubrimientos: 28, Enriquecimientos: 18, Emails: 35, Respuestas: 6 },
  { week: "Sem 2", Descubrimientos: 42, Enriquecimientos: 30, Emails: 52, Respuestas: 10 },
  { week: "Sem 3", Descubrimientos: 35, Enriquecimientos: 25, Emails: 48, Respuestas: 12 },
  { week: "Sem 4", Descubrimientos: 50, Enriquecimientos: 32, Emails: 69, Respuestas: 14 },
  { week: "Sem 5", Descubrimientos: 45, Enriquecimientos: 28, Emails: 55, Respuestas: 11 },
  { week: "Sem 6", Descubrimientos: 73, Enriquecimientos: 38, Emails: 76, Respuestas: 19 },
];

export default function Analytics() {
  const { data: leads = [] } = useLeads() as { data: any[] };
  const { data: campaigns = [] } = useCampaigns() as { data: any[] };
  const [timeRange, setTimeRange] = useState("30d");

  const kpiData = getKpiData(leads, campaigns);
  const funnelStages = getFunnelStages(leads);

  const campaignPerformance = campaigns.filter((c: any) => c.status !== "draft").map((c: any) => {
    const openRate = c.totalSent > 0 ? Math.round((c.totalOpened / c.totalSent) * 100) : 0;
    const replyRate = c.totalSent > 0 ? Math.round((c.totalReplied / c.totalSent) * 100) : 0;
    return {
      name: c.name.length > 20 ? c.name.substring(0, 20) + "..." : c.name,
      fullName: c.name,
      Enviados: c.totalSent,
      Abiertos: c.totalOpened,
      Respuestas: c.totalReplied,
      Rebotes: c.totalBounced,
      openRate,
      replyRate,
      status: c.status,
      enrolledCount: c.enrolledCount,
      id: c.id,
    };
  });

  const topCampaigns = [...campaignPerformance].sort((a, b) => b.replyRate - a.replyRate);

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap p-4 pb-0">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-analytics-title">Analíticas</h1>
          <p className="text-sm text-muted-foreground">Métricas de rendimiento de campañas y pipeline</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px]" data-testid="select-time-range">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Últimos 7 días</SelectItem>
            <SelectItem value="30d">Últimos 30 días</SelectItem>
            <SelectItem value="90d">Últimos 90 días</SelectItem>
            <SelectItem value="all">Todo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {kpiData.map((kpi) => (
            <Card key={kpi.title} data-testid={`card-kpi-${kpi.title.toLowerCase().replace(/\s+/g, '-')}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <kpi.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Badge variant="secondary" className="text-xs">
                    {kpi.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 mr-1 text-green-600 dark:text-green-400" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1 text-red-600 dark:text-red-400" />
                    )}
                    {kpi.change}
                  </Badge>
                </div>
                <div className="text-2xl font-bold" data-testid={`text-kpi-value-${kpi.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  {kpi.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{kpi.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card data-testid="card-campaign-performance">
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-base">Rendimiento por Campaña</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={campaignPerformance} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      color: "hsl(var(--card-foreground))",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="Enviados" fill={NAVY} radius={[2, 2, 0, 0]} />
                  <Bar dataKey="Abiertos" fill={TEAL} radius={[2, 2, 0, 0]} />
                  <Bar dataKey="Respuestas" fill="#22c55e" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card data-testid="card-pipeline-funnel">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Pipeline Funnel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {funnelStages.map((stage, index) => {
                const maxCount = funnelStages[0].count;
                const pct = maxCount > 0 ? Math.round((stage.count / maxCount) * 100) : 0;
                return (
                  <div key={stage.name} data-testid={`funnel-stage-${stage.name.toLowerCase()}`}>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        {index > 0 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
                        <span className="text-sm font-medium">{stage.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{stage.count}</span>
                        <span className="text-xs text-muted-foreground">({pct}%)</span>
                      </div>
                    </div>
                    <div className="h-4 bg-muted rounded-md overflow-hidden">
                      <div
                        className="h-full rounded-md transition-all"
                        style={{ width: `${pct}%`, backgroundColor: stage.color }}
                      />
                    </div>
                  </div>
                );
              })}
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-muted-foreground">Conversión total</span>
                  <span className="font-bold">
                    {funnelStages[0].count > 0
                      ? `${Math.round((funnelStages[funnelStages.length - 1].count / funnelStages[0].count) * 100)}%`
                      : "0%"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card data-testid="card-activity-over-time">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Actividad por Semana</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activityOverTime} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      color: "hsl(var(--card-foreground))",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="Descubrimientos" stroke="#94a3b8" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="Enriquecimientos" stroke="#a78bfa" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="Emails" stroke={TEAL} strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="Respuestas" stroke={NAVY} strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card data-testid="card-top-campaigns">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Top Campañas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                <div className="grid grid-cols-6 gap-2 text-xs font-medium text-muted-foreground pb-2 border-b">
                  <span className="col-span-2">Campaña</span>
                  <span className="text-right">Inscritos</span>
                  <span className="text-right">Enviados</span>
                  <span className="text-right">Apertura</span>
                  <span className="text-right">Respuesta</span>
                </div>
                {topCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="grid grid-cols-6 gap-2 py-2 border-b last:border-b-0 items-center"
                    data-testid={`row-campaign-${campaign.id}`}
                  >
                    <div className="col-span-2 flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium truncate">{campaign.fullName}</span>
                      <Badge
                        variant={campaign.status === "active" ? "default" : "secondary"}
                        className="text-xs shrink-0"
                      >
                        {campaign.status === "active" ? "Activa" : campaign.status === "paused" ? "Pausada" : campaign.status === "completed" ? "Completada" : campaign.status}
                      </Badge>
                    </div>
                    <span className="text-sm text-right">{campaign.enrolledCount}</span>
                    <span className="text-sm text-right">{campaign.Enviados}</span>
                    <span className="text-sm text-right font-medium">{campaign.openRate}%</span>
                    <span className="text-sm text-right font-medium">{campaign.replyRate}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <Card data-testid="card-status-distribution">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Distribución de Estados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(LEAD_STATUS_CONFIG)
                .filter(([status]) => status !== "archived")
                .map(([status, config]) => {
                  const count = leads.filter(l => l.status === status).length;
                  const pct = leads.length > 0 ? Math.round((count / leads.length) * 100) : 0;
                  return (
                    <div key={status} className="flex items-center gap-2" data-testid={`status-row-${status}`}>
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: config.color }} />
                      <span className="text-xs flex-1 truncate">{config.label}</span>
                      <span className="text-xs font-medium">{count}</span>
                      <span className="text-xs text-muted-foreground w-8 text-right">{pct}%</span>
                    </div>
                  );
                })}
            </CardContent>
          </Card>

          <Card data-testid="card-geo-distribution">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Por País</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(() => {
                const byCountry: Record<string, number> = {};
                leads.forEach(l => { byCountry[l.country] = (byCountry[l.country] || 0) + 1; });
                return Object.entries(byCountry)
                  .sort(([, a], [, b]) => b - a)
                  .map(([country, count]) => {
                    const pct = Math.round((count / leads.length) * 100);
                    return (
                      <div key={country} className="space-y-1" data-testid={`geo-row-${country.toLowerCase().replace(/\s+/g, '-')}`}>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs">{country}</span>
                          <span className="text-xs font-medium">{count} ({pct}%)</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: TEAL + "99" }} />
                        </div>
                      </div>
                    );
                  });
              })()}
            </CardContent>
          </Card>

          <Card data-testid="card-industry-distribution">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Por Industria</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(() => {
                const byIndustry: Record<string, number> = {};
                leads.forEach(l => { byIndustry[l.industry] = (byIndustry[l.industry] || 0) + 1; });
                return Object.entries(byIndustry)
                  .sort(([, a], [, b]) => b - a)
                  .map(([industry, count]) => {
                    const pct = Math.round((count / leads.length) * 100);
                    return (
                      <div key={industry} className="space-y-1" data-testid={`industry-row-${industry.toLowerCase().replace(/\s+/g, '-')}`}>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs">{industry}</span>
                          <span className="text-xs font-medium">{count} ({pct}%)</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: NAVY + "99" }} />
                        </div>
                      </div>
                    );
                  });
              })()}
            </CardContent>
          </Card>

          <Card data-testid="card-score-distribution">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Distribución de Score</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(() => {
                const ranges = [
                  { label: "90-100", min: 90, max: 100, color: "#22c55e" },
                  { label: "70-89", min: 70, max: 89, color: TEAL },
                  { label: "50-69", min: 50, max: 69, color: "#fbbf24" },
                  { label: "0-49", min: 0, max: 49, color: "#ef4444" },
                ];
                return ranges.map(range => {
                  const count = leads.filter(l => l.score >= range.min && l.score <= range.max).length;
                  const pct = leads.length > 0 ? Math.round((count / leads.length) * 100) : 0;
                  return (
                    <div key={range.label} className="space-y-1" data-testid={`score-row-${range.label}`}>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: range.color }} />
                          <span className="text-xs">{range.label}</span>
                        </div>
                        <span className="text-xs font-medium">{count} ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: range.color + "99" }} />
                      </div>
                    </div>
                  );
                });
              })()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
