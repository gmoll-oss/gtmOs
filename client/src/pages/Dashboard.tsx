import { ArrowUpRight, ArrowDownRight, Mail, Linkedin, Sparkles, Target, CheckCircle2, AlertCircle, Clock, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { sparklineData, funnelData, recentActivity } from "@/lib/mockData";
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

const kpiCards = [
  { label: "Traffic", value: "1,240", change: "+8%", up: true, color: "#F59E0B", sparkline: sparklineData.traffic },
  { label: "Leads", value: "387", change: "+31%", up: true, color: "#EC4899", sparkline: sparklineData.leads },
  { label: "MQLs", value: "94", change: "+24%", up: true, color: "#8B5CF6", sparkline: sparklineData.mqls },
  { label: "SQLs", value: "18", change: "+19%", up: true, color: "#10B981", sparkline: sparklineData.sqls },
];

const tasks = [
  { icon: AlertCircle, text: "2 leads respondieron - acción requerida", badge: "Urgente", badgeColor: "bg-red-500/15 text-red-400", iconColor: "text-red-400" },
  { icon: Zap, text: "3 leads con Contact Value > 40 - revisar", badge: "Atención", badgeColor: "bg-amber-500/15 text-amber-400", iconColor: "text-amber-400" },
  { icon: Mail, text: "Spain Boutique cadencia - 45 emails programados hoy", badge: "Info", badgeColor: "bg-blue-500/15 text-blue-400", iconColor: "text-blue-400" },
  { icon: CheckCircle2, text: "5 nuevos hoteles enriquecidos y listos", badge: "Listo", badgeColor: "bg-emerald-500/15 text-emerald-400", iconColor: "text-emerald-400" },
];

function activityIcon(type: string) {
  switch (type) {
    case "email": return <Mail className="w-3.5 h-3.5 text-blue-400" />;
    case "linkedin": return <Linkedin className="w-3.5 h-3.5 text-sky-400" />;
    case "enrichment": return <Sparkles className="w-3.5 h-3.5 text-purple-400" />;
    case "sql": return <Target className="w-3.5 h-3.5 text-emerald-400" />;
    case "cadence": return <Clock className="w-3.5 h-3.5 text-amber-400" />;
    default: return <Mail className="w-3.5 h-3.5 text-[#9CA3AF]" />;
  }
}

export default function Dashboard() {
  const today = new Date().toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-semibold text-[#F9FAFB]" data-testid="text-page-title">GTM Dashboard</h1>
          <p className="text-sm text-[#6B7280] mt-0.5 capitalize">{today}</p>
        </div>
        <span className="text-xs font-medium bg-[#6366F1]/15 text-[#818CF8] px-3 py-1.5 rounded-md" data-testid="badge-fideltour">Fideltour</span>
      </div>

      <div className="grid grid-cols-4 gap-4" data-testid="kpi-cards">
        {kpiCards.map((kpi) => (
          <Card key={kpi.label} className="bg-[#1A1D27] border-[#2A2D3E] p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-[#9CA3AF] font-medium uppercase tracking-wider">{kpi.label}</p>
                <p className="text-2xl font-bold text-[#F9FAFB] mt-1" data-testid={`text-kpi-${kpi.label.toLowerCase()}`}>{kpi.value}</p>
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

      <Card className="bg-[#1A1D27] border-[#2A2D3E] p-5" data-testid="pipeline-funnel">
        <h2 className="text-sm font-semibold text-[#F9FAFB] mb-4">Pipeline</h2>
        <div className="flex items-center justify-between">
          {funnelData.map((stage, i) => (
            <div key={stage.stage} className="flex items-center">
              <div className="text-center">
                <div
                  className="rounded-lg px-5 py-3 min-w-[130px]"
                  style={{ backgroundColor: `${stage.color}15`, border: `1px solid ${stage.color}30` }}
                >
                  <p className="text-lg font-bold text-[#F9FAFB]">{stage.count}</p>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">{stage.stage}</p>
                </div>
              </div>
              {i < funnelData.length - 1 && (
                <div className="flex flex-col items-center mx-2">
                  <div className="text-[10px] font-medium text-[#6B7280] mb-0.5">{funnelData[i + 1].rate}</div>
                  <div className="w-8 h-[1px] bg-[#2A2D3E]" />
                  <svg className="w-2 h-2 text-[#2A2D3E] -mt-0.5" viewBox="0 0 8 8">
                    <path d="M0 0 L8 4 L0 8 Z" fill="currentColor" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          <Card className="bg-[#1A1D27] border-[#2A2D3E] p-5" data-testid="tasks-panel">
            <h2 className="text-sm font-semibold text-[#F9FAFB] mb-3">Tareas de Hoy</h2>
            <div className="space-y-2">
              {tasks.map((task, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[#0F1117]/60 hover:bg-[#0F1117] transition-colors cursor-pointer" data-testid={`task-item-${i}`}>
                  <task.icon className={`w-4 h-4 flex-shrink-0 ${task.iconColor}`} />
                  <span className="text-sm text-[#E5E7EB] flex-1">{task.text}</span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${task.badgeColor}`}>{task.badge}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-[#1A1D27] border-[#2A2D3E] p-5" data-testid="activity-feed">
            <h2 className="text-sm font-semibold text-[#F9FAFB] mb-3">Actividad Reciente</h2>
            <div className="space-y-3">
              {recentActivity.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#0F1117] flex items-center justify-center flex-shrink-0 mt-0.5">
                    {activityIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#E5E7EB]">{item.description}</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">{item.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="bg-[#1A1D27] border-[#2A2D3E] p-5" data-testid="sql-target">
            <h2 className="text-sm font-semibold text-[#F9FAFB] mb-3">Objetivo SQL Semanal</h2>
            <div className="text-center py-4">
              <p className="text-4xl font-bold text-[#F9FAFB]">8<span className="text-lg text-[#6B7280]">/10</span></p>
              <p className="text-sm text-[#9CA3AF] mt-1">SQLs esta semana</p>
            </div>
            <div className="w-full bg-[#0F1117] rounded-full h-2 mt-2">
              <div className="h-2 rounded-full bg-gradient-to-r from-[#6366F1] to-[#10B981]" style={{ width: "80%" }} />
            </div>
            <p className="text-xs text-[#10B981] mt-2 text-center font-medium">80% del objetivo alcanzado</p>
          </Card>

          <Card className="bg-[#1A1D27] border-[#2A2D3E] p-5" data-testid="quick-stats">
            <h2 className="text-sm font-semibold text-[#F9FAFB] mb-3">Resumen Rápido</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#9CA3AF]">Tasa Respuesta</span>
                <span className="text-sm font-medium text-[#F9FAFB]">14.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#9CA3AF]">Emails Hoy</span>
                <span className="text-sm font-medium text-[#F9FAFB]">45</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#9CA3AF]">LinkedIn Hoy</span>
                <span className="text-sm font-medium text-[#F9FAFB]">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#9CA3AF]">Leads Activos</span>
                <span className="text-sm font-medium text-[#F9FAFB]">183</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#9CA3AF]">Tiempo Medio Resp.</span>
                <span className="text-sm font-medium text-[#F9FAFB]">2.4h</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
