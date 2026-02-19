import { ArrowUpRight, ArrowDownRight, Mail, Linkedin, Sparkles, Target, CheckCircle2, AlertCircle, Clock, Zap, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { sparklineData, funnelData, recentActivity } from "@/lib/mockData";
import { useRegionContext } from "@/contexts/RegionContext";
import { getHotelsByZone, getZoneStats } from "@/lib/zoneFilters";
import { LineChart, Line } from "recharts";

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const chartData = data.map((v, i) => ({ v, i }));
  return (
    <div style={{ width: 80, height: 32 }}>
      <LineChart width={80} height={32} data={chartData}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
      </LineChart>
    </div>
  );
}

const tasks = [
  { icon: AlertCircle, text: "2 leads respondieron - acción requerida", badge: "Urgente", badgeColor: "bg-red-500/15 text-red-400 dark:text-red-400", iconColor: "text-red-400 dark:text-red-400" },
  { icon: Zap, text: "3 leads con Contact Value > 40 - revisar", badge: "Atención", badgeColor: "bg-amber-500/15 text-amber-600 dark:text-amber-400", iconColor: "text-amber-600 dark:text-amber-400" },
  { icon: Mail, text: "Spain Boutique cadencia - 45 emails programados hoy", badge: "Info", badgeColor: "bg-blue-500/15 text-blue-600 dark:text-blue-400", iconColor: "text-blue-600 dark:text-blue-400" },
  { icon: CheckCircle2, text: "5 nuevos hoteles enriquecidos y listos", badge: "Listo", badgeColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400", iconColor: "text-emerald-600 dark:text-emerald-400" },
];

function activityIcon(type: string) {
  switch (type) {
    case "email": return <Mail className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />;
    case "linkedin": return <Linkedin className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />;
    case "enrichment": return <Sparkles className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />;
    case "sql": return <Target className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />;
    case "cadence": return <Clock className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />;
    default: return <Mail className="w-3.5 h-3.5 text-muted-foreground" />;
  }
}

export default function Dashboard() {
  const today = new Date().toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const { region, currentZone } = useRegionContext();
  const stats = getZoneStats(region);
  const zoneHotels = getHotelsByZone(region);

  const sqlCount = stats.sqls;
  const sqlTarget = region === "todas" ? 10 : Math.max(3, Math.ceil(stats.totalHotels * 0.15));
  const sqlPct = Math.min(100, Math.round((sqlCount / sqlTarget) * 100));

  const kpiCards = [
    { label: "Hoteles", value: stats.totalHotels.toString(), change: "+8%", up: true, color: "#F59E0B", sparkline: sparklineData.traffic },
    { label: "En Cadencia", value: stats.inCadence.toString(), change: "+31%", up: true, color: "#EC4899", sparkline: sparklineData.leads },
    { label: "Nurturing", value: stats.nurturing.toString(), change: "+24%", up: true, color: "#8B5CF6", sparkline: sparklineData.mqls },
    { label: "SQLs", value: stats.sqls.toString(), change: "+19%", up: true, color: "#10B981", sparkline: sparklineData.sqls },
  ];

  const zoneFunnel = [
    { stage: "Total", count: stats.totalHotels, color: "#6366F1" },
    { stage: "En Cadencia", count: stats.inCadence, rate: stats.totalHotels > 0 ? `${Math.round((stats.inCadence / stats.totalHotels) * 100)}%` : "0%", color: "#8B5CF6" },
    { stage: "Nurturing", count: stats.nurturing, rate: stats.inCadence > 0 ? `${Math.round((stats.nurturing / stats.inCadence) * 100)}%` : "0%", color: "#A78BFA" },
    { stage: "SQL", count: stats.sqls, rate: stats.nurturing > 0 ? `${Math.round((stats.sqls / stats.nurturing) * 100)}%` : "0%", color: "#10B981" },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-semibold text-foreground" data-testid="text-page-title">
            {currentZone ? `Dashboard - ${currentZone.name}` : "GTM Dashboard"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5 capitalize">{today}</p>
        </div>
        <div className="flex items-center gap-3">
          {currentZone && (
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg px-3 py-1.5" data-testid="badge-ambassador">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-3 h-3 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground leading-tight">Embajador</p>
                <p className="text-xs font-medium text-primary leading-tight">{currentZone.ambassador.name}</p>
              </div>
            </div>
          )}
          <span className="text-xs font-medium bg-primary/15 text-primary px-3 py-1.5 rounded-md" data-testid="badge-fideltour">Fideltour</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4" data-testid="kpi-cards">
        {kpiCards.map((kpi) => (
          <Card key={kpi.label} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{kpi.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1" data-testid={`text-kpi-${kpi.label.toLowerCase()}`}>{kpi.value}</p>
                <span className="inline-flex items-center gap-0.5 text-xs font-medium mt-1.5" style={{ color: kpi.up ? "#10B981" : "#EF4444" }}>
                  {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {kpi.change} vs semana anterior
                </span>
              </div>
              <MiniSparkline data={kpi.sparkline} color={kpi.color} />
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5" data-testid="pipeline-funnel">
        <h2 className="text-sm font-semibold text-foreground mb-4">Pipeline {currentZone ? `- ${currentZone.name}` : ""}</h2>
        <div className="space-y-0">
          {(region === "todas" ? funnelData : zoneFunnel).map((stage, i, arr) => {
            const maxCount = arr[0].count || 1;
            const widthPct = Math.max(((stage.count / maxCount) * 100), 25);
            return (
              <div key={stage.stage} className="flex flex-col items-center">
                <div
                  className="relative flex items-center justify-between px-4 py-3"
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: `${stage.color}15`,
                    borderLeft: `2px solid ${stage.color}50`,
                    borderRight: `2px solid ${stage.color}50`,
                    borderTop: i === 0 ? `2px solid ${stage.color}50` : "none",
                    borderBottom: i === arr.length - 1 ? `2px solid ${stage.color}50` : "none",
                    borderRadius: i === 0 ? "8px 8px 0 0" : i === arr.length - 1 ? "0 0 8px 8px" : "0",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: stage.color }} />
                    <span className="text-sm font-medium text-foreground">{stage.stage}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-foreground">{stage.count}</span>
                    {i > 0 && stage.rate && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md" style={{ backgroundColor: `${stage.color}20`, color: stage.color }}>{stage.rate}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          <Card className="p-5" data-testid="tasks-panel">
            <h2 className="text-sm font-semibold text-foreground mb-3">Tareas de Hoy</h2>
            <div className="space-y-2">
              {tasks.map((task, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-background/60 hover:bg-background transition-colors cursor-pointer" data-testid={`task-item-${i}`}>
                  <task.icon className={`w-4 h-4 flex-shrink-0 ${task.iconColor}`} />
                  <span className="text-sm text-foreground/80 flex-1">{task.text}</span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${task.badgeColor}`}>{task.badge}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5" data-testid="activity-feed">
            <h2 className="text-sm font-semibold text-foreground mb-3">Actividad Reciente</h2>
            <div className="space-y-3">
              {recentActivity.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-background flex items-center justify-center flex-shrink-0 mt-0.5">
                    {activityIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground/80">{item.description}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5" data-testid="sql-target">
            <h2 className="text-sm font-semibold text-foreground mb-3">Objetivo SQL {currentZone ? currentZone.name : "Semanal"}</h2>
            <div className="text-center py-4">
              <p className="text-4xl font-bold text-foreground">{sqlCount}<span className="text-lg text-muted-foreground">/{sqlTarget}</span></p>
              <p className="text-sm text-muted-foreground mt-1">SQLs {currentZone ? "en esta región" : "esta semana"}</p>
            </div>
            <div className="w-full bg-background rounded-full h-2 mt-2">
              <div className="h-2 rounded-full bg-gradient-to-r from-[#6366F1] to-[#10B981]" style={{ width: `${sqlPct}%` }} />
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 text-center font-medium">{sqlPct}% del objetivo alcanzado</p>
          </Card>

          <Card className="p-5" data-testid="quick-stats">
            <h2 className="text-sm font-semibold text-foreground mb-3">Resumen {currentZone ? currentZone.name : "Rápido"}</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">ICP Medio</span>
                <span className="text-sm font-medium text-foreground">{stats.avgIcp}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">CV Medio</span>
                <span className="text-sm font-medium text-foreground">{stats.avgCv}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Nuevos</span>
                <span className="text-sm font-medium text-foreground">{stats.newLeads}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Leads Activos</span>
                <span className="text-sm font-medium text-foreground">{stats.inCadence + stats.nurturing}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Total Hoteles</span>
                <span className="text-sm font-medium text-foreground">{stats.totalHotels}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
