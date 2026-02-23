import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import {
  Search,
  Globe,
  Sparkles,
  Send,
  MessageSquare,
  Play,
  RefreshCw,
  Ban,
  UserPlus,
  TrendingUp,
  Users,
  Mail,
  Target,
  BarChart3,
  ArrowRight,
  Zap,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  leads,
  campaigns,
  activityFeed,
  companies,
  inboxThreads,
  identities,
  LEAD_STATUS_CONFIG,
  type ActivityItem,
  type LeadStatus,
} from "@/lib/mockData";

type FilterType = "all" | "discovery" | "enrichment" | "email" | "sync";

const ACTIVITY_TYPE_CONFIG: Record<
  ActivityItem["type"],
  { icon: typeof Globe; label: string; filterGroup: FilterType; bgClass: string; textClass: string }
> = {
  discovery: { icon: Globe, label: "Descubrimiento", filterGroup: "discovery", bgClass: "bg-blue-100 dark:bg-blue-900/40", textClass: "text-blue-700 dark:text-blue-300" },
  enrichment: { icon: Sparkles, label: "Enriquecimiento", filterGroup: "enrichment", bgClass: "bg-violet-100 dark:bg-violet-900/40", textClass: "text-violet-700 dark:text-violet-300" },
  email_sent: { icon: Send, label: "Email enviado", filterGroup: "email", bgClass: "bg-teal-100 dark:bg-teal-900/40", textClass: "text-teal-700 dark:text-teal-300" },
  email_replied: { icon: MessageSquare, label: "Respuesta", filterGroup: "email", bgClass: "bg-green-100 dark:bg-green-900/40", textClass: "text-green-700 dark:text-green-300" },
  campaign_started: { icon: Play, label: "Campaña", filterGroup: "email", bgClass: "bg-amber-100 dark:bg-amber-900/40", textClass: "text-amber-700 dark:text-amber-300" },
  sync: { icon: RefreshCw, label: "Sync", filterGroup: "sync", bgClass: "bg-emerald-100 dark:bg-emerald-900/40", textClass: "text-emerald-700 dark:text-emerald-300" },
  exclusion: { icon: Ban, label: "Exclusión", filterGroup: "discovery", bgClass: "bg-red-100 dark:bg-red-900/40", textClass: "text-red-700 dark:text-red-300" },
  contact_added: { icon: UserPlus, label: "Contacto añadido", filterGroup: "discovery", bgClass: "bg-sky-100 dark:bg-sky-900/40", textClass: "text-sky-700 dark:text-sky-300" },
};

const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "discovery", label: "Descubrimientos" },
  { value: "enrichment", label: "Enriquecimientos" },
  { value: "email", label: "Emails" },
  { value: "sync", label: "Syncs" },
];

const PIPELINE_ORDER: LeadStatus[] = [
  "discovered",
  "qualified",
  "enriched",
  "eligible",
  "in_sequence",
  "engaged",
  "ready_to_sync",
  "synced",
  "excluded",
  "archived",
];

function formatTimestamp(ts: string): string {
  const date = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return "Hace unos minutos";
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays < 7) return `Hace ${diffDays}d`;
  return date.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
}

function formatDateGroup(ts: string): string {
  const date = new Date(ts);
  return date.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export default function Activity() {
  const [, navigate] = useLocation();
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const statusCounts = useMemo(() => {
    const counts: Record<LeadStatus, number> = {} as Record<LeadStatus, number>;
    for (const s of PIPELINE_ORDER) counts[s] = 0;
    for (const lead of leads) counts[lead.status]++;
    return counts;
  }, []);

  const totalContacts = leads.length;
  const totalCompanies = companies.length;
  const totalEmailsSent = campaigns.reduce((sum, c) => sum + c.totalSent, 0);
  const totalReplied = campaigns.reduce((sum, c) => sum + c.totalReplied, 0);
  const overallReplyRate = totalEmailsSent > 0 ? Math.round((totalReplied / totalEmailsSent) * 100) : 0;
  const unreadInbox = inboxThreads.filter((t) => t.unread).length;
  const activeCampaigns = campaigns.filter((c) => c.status === "active").length;
  const todaySent = identities.reduce((sum, i) => sum + i.sentToday, 0);
  const dailyLimit = identities.reduce((sum, i) => sum + i.dailyLimit, 0);

  const sortedFeed = useMemo(() => {
    return [...activityFeed].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, []);

  const filteredFeed = useMemo(() => {
    return sortedFeed.filter((item) => {
      if (filter !== "all") {
        const config = ACTIVITY_TYPE_CONFIG[item.type];
        if (config.filterGroup !== filter) return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          item.description.toLowerCase().includes(q) ||
          (item.leadName && item.leadName.toLowerCase().includes(q)) ||
          (item.companyName && item.companyName.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [sortedFeed, filter, searchQuery]);

  const groupedByDate = useMemo(() => {
    const groups: { date: string; items: ActivityItem[] }[] = [];
    let currentDate = "";
    for (const item of filteredFeed) {
      const dateKey = new Date(item.timestamp).toDateString();
      if (dateKey !== currentDate) {
        currentDate = dateKey;
        groups.push({ date: item.timestamp, items: [item] });
      } else {
        groups[groups.length - 1].items.push(item);
      }
    }
    return groups;
  }, [filteredFeed]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold" data-testid="text-page-title">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Panel operacional del pipeline</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs gap-1.5" data-testid="badge-unread-inbox">
              <Mail className="w-3 h-3" />
              {unreadInbox} sin leer
            </Badge>
            <Badge variant="secondary" className="text-xs gap-1.5" data-testid="badge-active-campaigns">
              <Send className="w-3 h-3" />
              {activeCampaigns} campañas activas
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3" data-testid="kpi-cards">
          <Card className="cursor-pointer hover:border-primary/40 transition-colors" onClick={() => navigate("/contacts")} data-testid="kpi-contacts">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold text-foreground">{totalContacts}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Contactos totales</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary/40 transition-colors" onClick={() => navigate("/companies")} data-testid="kpi-companies">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold text-foreground">{totalCompanies}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Empresas</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary/40 transition-colors" onClick={() => navigate("/campaigns")} data-testid="kpi-emails">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold text-foreground">{totalEmailsSent}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Emails enviados</p>
            </CardContent>
          </Card>
          <Card data-testid="kpi-reply-rate">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <Badge variant="secondary" className="text-[10px] h-5">{totalReplied} resp.</Badge>
              </div>
              <p className="text-2xl font-bold text-foreground">{overallReplyRate}%</p>
              <p className="text-xs text-muted-foreground mt-0.5">Tasa de respuesta</p>
            </CardContent>
          </Card>
          <Card data-testid="kpi-sending">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-4 h-4 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">{todaySent}/{dailyLimit}</span>
              </div>
              <Progress value={(todaySent / dailyLimit) * 100} className="h-1.5 mb-1.5" />
              <p className="text-xs text-muted-foreground">Envíos hoy</p>
            </CardContent>
          </Card>
        </div>

        <Card data-testid="pipeline-states">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Pipeline por estado
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/contacts")} data-testid="button-view-all-contacts">
                Ver todos
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-1" data-testid="pipeline-bar">
              {PIPELINE_ORDER.filter((s) => statusCounts[s] > 0).map((status) => {
                const config = LEAD_STATUS_CONFIG[status];
                const count = statusCounts[status];
                const pct = Math.round((count / totalContacts) * 100);
                return (
                  <button
                    key={status}
                    className="group relative cursor-pointer transition-all hover:opacity-80"
                    style={{
                      flex: count,
                      backgroundColor: config.color,
                      height: "32px",
                      borderRadius: "4px",
                      minWidth: count > 0 ? "28px" : "0px",
                    }}
                    onClick={() => navigate("/contacts")}
                    data-testid={`pipeline-segment-${status}`}
                    title={`${config.label}: ${count} (${pct}%)`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white drop-shadow-sm">
                        {count}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-5 gap-x-4 gap-y-2 mt-4">
              {PIPELINE_ORDER.map((status) => {
                const config = LEAD_STATUS_CONFIG[status];
                const count = statusCounts[status];
                if (count === 0) return null;
                return (
                  <button
                    key={status}
                    className="flex items-center gap-2 p-1.5 rounded-md hover:bg-muted/50 transition-colors cursor-pointer text-left"
                    onClick={() => navigate("/contacts")}
                    data-testid={`pipeline-state-${status}`}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: config.color }}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{config.label}</p>
                      <p className="text-[11px] text-muted-foreground">{count} contactos</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:border-primary/40 transition-colors" onClick={() => navigate("/campaigns")} data-testid="card-campaigns-summary">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Send className="w-4 h-4 text-primary" />
                Campañas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {campaigns.map((camp) => {
                const openRate = camp.totalSent > 0 ? Math.round((camp.totalOpened / camp.totalSent) * 100) : 0;
                const replyRate = camp.totalSent > 0 ? Math.round((camp.totalReplied / camp.totalSent) * 100) : 0;
                return (
                  <div key={camp.id} className="flex items-center justify-between py-1.5" data-testid={`campaign-summary-${camp.id}`}>
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${camp.status === "active" ? "bg-green-500" : camp.status === "paused" ? "bg-amber-500" : "bg-gray-400"}`} />
                      <span className="text-sm text-foreground truncate">{camp.name}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant="secondary" className="text-[10px]">{openRate}% apert.</Badge>
                      <Badge variant="secondary" className="text-[10px]">{replyRate}% resp.</Badge>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-primary/40 transition-colors" onClick={() => navigate("/inbox")} data-testid="card-inbox-summary">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                Inbox reciente
                {unreadInbox > 0 && (
                  <Badge className="text-[10px] h-5 bg-primary text-primary-foreground">{unreadInbox}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {inboxThreads.slice(0, 5).map((thread) => (
                <div key={thread.id} className="flex items-center justify-between py-1.5" data-testid={`inbox-summary-${thread.id}`}>
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {thread.unread && <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />}
                    <span className={`text-sm truncate ${thread.unread ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                      {thread.leadName}
                    </span>
                  </div>
                  {thread.aiTag && (
                    <Badge variant="secondary" className="text-[10px] flex-shrink-0">
                      {thread.aiTag === "meeting_requested" ? "Reunión" :
                       thread.aiTag === "interested" ? "Interesado" :
                       thread.aiTag === "not_interested" ? "No interesado" :
                       thread.aiTag === "question" ? "Pregunta" :
                       thread.aiTag === "auto_reply" ? "Auto" : thread.aiTag}
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card data-testid="card-pipeline-funnel">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Funnel de conversión
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "Descubiertos", count: leads.length, icon: Globe },
                { label: "Enriquecidos", count: leads.filter((l) => ["enriched", "eligible", "in_sequence", "engaged", "ready_to_sync", "synced"].includes(l.status)).length, icon: Sparkles },
                { label: "En campaña", count: leads.filter((l) => ["in_sequence", "engaged", "ready_to_sync", "synced"].includes(l.status)).length, icon: Send },
                { label: "Contactados", count: leads.filter((l) => ["engaged", "ready_to_sync", "synced"].includes(l.status)).length, icon: CheckCircle2 },
                { label: "Sincronizados", count: leads.filter((l) => l.status === "synced").length, icon: RefreshCw },
              ].map((stage, i, arr) => {
                const pct = leads.length > 0 ? Math.round((stage.count / leads.length) * 100) : 0;
                return (
                  <div key={stage.label} className="flex items-center gap-3" data-testid={`funnel-stage-${i}`}>
                    <stage.icon className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs text-foreground">{stage.label}</span>
                        <span className="text-xs font-medium text-foreground">{stage.count}</span>
                      </div>
                      <Progress value={pct} className="h-1" />
                    </div>
                    <span className="text-[10px] text-muted-foreground w-8 text-right">{pct}%</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">Actividad reciente</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-8 text-xs w-[200px]"
                  data-testid="input-search-activity"
                />
              </div>
              <div className="flex items-center gap-0.5">
                {FILTER_OPTIONS.map((opt) => (
                  <Button
                    key={opt.value}
                    variant={filter === opt.value ? "default" : "ghost"}
                    size="sm"
                    className="h-8 text-xs px-2.5"
                    onClick={() => setFilter(opt.value)}
                    data-testid={`button-filter-${opt.value}`}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {groupedByDate.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-sm text-muted-foreground" data-testid="text-no-results">No se encontraron actividades</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {groupedByDate.map((group) => (
                <div key={group.date}>
                  <p className="text-xs font-medium text-muted-foreground mb-2 capitalize" data-testid={`text-date-group-${group.date}`}>
                    {formatDateGroup(group.date)}
                  </p>
                  <Card className="divide-y divide-border">
                    {group.items.map((item) => {
                      const config = ACTIVITY_TYPE_CONFIG[item.type];
                      const IconComponent = config.icon;
                      return (
                        <div
                          key={item.id}
                          className="flex items-start gap-3 px-4 py-3"
                          data-testid={`activity-item-${item.id}`}
                        >
                          <div className={`flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center ${config.bgClass}`}>
                            <IconComponent className={`w-3.5 h-3.5 ${config.textClass}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm leading-relaxed" data-testid={`text-description-${item.id}`}>
                              {item.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              {item.leadName && (
                                <span className="text-xs text-muted-foreground" data-testid={`text-lead-${item.id}`}>
                                  {item.leadName}
                                </span>
                              )}
                              {item.leadName && item.companyName && (
                                <span className="text-xs text-muted-foreground">·</span>
                              )}
                              {item.companyName && (
                                <span className="text-xs text-muted-foreground" data-testid={`text-company-${item.id}`}>
                                  {item.companyName}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-shrink-0 items-center gap-2">
                            <Badge variant="secondary" className="text-[10px]" data-testid={`badge-type-${item.id}`}>
                              {config.label}
                            </Badge>
                            <span className="text-[11px] text-muted-foreground whitespace-nowrap" data-testid={`text-time-${item.id}`}>
                              {formatTimestamp(item.timestamp)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
