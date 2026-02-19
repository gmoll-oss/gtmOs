import { Card } from "@/components/ui/card";
import { analyticsData } from "@/lib/mockData";
import { ArrowUpRight, ArrowDownRight, ChevronDown } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";

function statusColor(status: string) {
  switch (status) {
    case "success": return "text-[#10B981]";
    case "warning": return "text-[#F59E0B]";
    case "danger": return "text-[#EF4444]";
    default: return "text-[#9CA3AF]";
  }
}

function statusBg(status: string) {
  switch (status) {
    case "success": return "bg-[#10B981]/15";
    case "warning": return "bg-[#F59E0B]/15";
    case "danger": return "bg-[#EF4444]/15";
    default: return "bg-[#2A2D3E]";
  }
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1A1D27] border border-[#2A2D3E] rounded-lg p-2 text-xs">
      <p className="text-[#9CA3AF]">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-[#F9FAFB]">{p.name}: {p.value}{typeof p.value === "number" && p.value < 100 ? "%" : ""}</p>
      ))}
    </div>
  );
};

export default function Analytics() {
  return (
    <div className="p-6 space-y-5 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-xl font-semibold text-[#F9FAFB]" data-testid="text-page-title">GTM Analytics</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select className="appearance-none bg-[#1A1D27] border border-[#2A2D3E] text-[#E5E7EB] text-xs rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-[#6366F1]" data-testid="select-date-range">
              <option>Últimos 7 días</option>
              <option>Últimos 30 días</option>
              <option>Este mes</option>
              <option>Este trimestre</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B7280] pointer-events-none" />
          </div>
        </div>
      </div>

      <Card className="bg-[#1A1D27] border-[#2A2D3E] p-5" data-testid="chart-funnel-conversion">
        <h2 className="text-sm font-semibold text-[#F9FAFB] mb-4">Conversión del Funnel</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={analyticsData.funnelConversion} barSize={48}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2D3E" vertical={false} />
            <XAxis dataKey="stage" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="rate" radius={[4, 4, 0, 0]} name="Tasa">
              {analyticsData.funnelConversion.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
            <Bar dataKey="target" radius={[4, 4, 0, 0]} fill="#2A2D3E" name="Objetivo" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-2 gap-5">
        <Card className="bg-[#1A1D27] border-[#2A2D3E] p-5" data-testid="chart-cadence-performance">
          <h2 className="text-sm font-semibold text-[#F9FAFB] mb-4">Rendimiento de Cadencias</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analyticsData.cadencePerformance} layout="vertical" barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2D3E" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={140} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="rate" fill="#6366F1" radius={[0, 4, 4, 0]} name="Tasa Respuesta" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="bg-[#1A1D27] border-[#2A2D3E] p-5" data-testid="chart-channel-effectiveness">
          <h2 className="text-sm font-semibold text-[#F9FAFB] mb-4">Efectividad por Canal</h2>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={analyticsData.channelEffectiveness}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {analyticsData.channelEffectiveness.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  formatter={(value: string) => <span className="text-[11px] text-[#9CA3AF]">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <Card className="bg-[#1A1D27] border-[#2A2D3E] p-5" data-testid="chart-cv-distribution">
          <h2 className="text-sm font-semibold text-[#F9FAFB] mb-4">Distribución Contact Value</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analyticsData.contactValueDistribution} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2D3E" vertical={false} />
              <XAxis dataKey="range" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Leads" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="bg-[#1A1D27] border-[#2A2D3E] p-5" data-testid="chart-weekly-sqls">
          <h2 className="text-sm font-semibold text-[#F9FAFB] mb-4">SQLs Generados - Semanal</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={analyticsData.weeklySQLs}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2D3E" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="sqls" stroke="#10B981" strokeWidth={2} dot={{ fill: "#10B981", r: 3 }} name="SQLs" />
              <Line type="monotone" dataKey="target" stroke="#EF4444" strokeWidth={1} strokeDasharray="5 5" dot={false} name="Objetivo" />
              <Legend formatter={(value: string) => <span className="text-[11px] text-[#9CA3AF]">{value}</span>} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="bg-[#1A1D27] border-[#2A2D3E] p-5" data-testid="kpi-table">
        <h2 className="text-sm font-semibold text-[#F9FAFB] mb-4">KPIs del Framework GTM</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#2A2D3E]">
                <th className="text-left p-3 text-[#6B7280] font-medium uppercase tracking-wider text-[10px]">Categoría</th>
                <th className="text-left p-3 text-[#6B7280] font-medium uppercase tracking-wider text-[10px]">Métrica</th>
                <th className="text-left p-3 text-[#6B7280] font-medium uppercase tracking-wider text-[10px]">Actual</th>
                <th className="text-left p-3 text-[#6B7280] font-medium uppercase tracking-wider text-[10px]">Objetivo</th>
                <th className="text-left p-3 text-[#6B7280] font-medium uppercase tracking-wider text-[10px]">Tendencia</th>
                <th className="text-left p-3 text-[#6B7280] font-medium uppercase tracking-wider text-[10px]">Estado</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.kpiTable.map((row, i) => (
                <tr key={i} className="border-b border-[#2A2D3E]/50">
                  <td className="p-3 text-[#6B7280]">{row.category}</td>
                  <td className="p-3 text-[#E5E7EB] font-medium">{row.metric}</td>
                  <td className="p-3 text-[#F9FAFB] font-medium">{row.current}</td>
                  <td className="p-3 text-[#9CA3AF]">{row.target}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-0.5 ${statusColor(row.status)}`}>
                      {row.trend.startsWith("+") || row.trend.startsWith("-") ? (
                        row.trend.startsWith("+") ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />
                      ) : null}
                      {row.trend}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${statusBg(row.status)} ${statusColor(row.status)}`}>
                      {row.status === "success" ? "On Track" : row.status === "warning" ? "Atención" : "Por debajo"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
