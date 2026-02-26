import { useState, useMemo } from "react";
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
  Clock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  activityFeed,
  type ActivityItem,
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
  { value: "sync", label: "Sincronizaciones" },
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
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

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

  const filterCounts = useMemo(() => {
    const counts: Record<FilterType, number> = { all: sortedFeed.length, discovery: 0, enrichment: 0, email: 0, sync: 0 };
    for (const item of sortedFeed) {
      const config = ACTIVITY_TYPE_CONFIG[item.type];
      counts[config.filterGroup]++;
    }
    return counts;
  }, [sortedFeed]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-semibold" data-testid="text-page-title">Actividad</h1>
            <p className="text-sm text-muted-foreground mt-1">Feed de actividad reciente en todo el sistema</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span data-testid="text-total-events">{sortedFeed.length} eventos registrados</span>
          </div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-1 flex-wrap">
            {FILTER_OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                variant={filter === opt.value ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter(opt.value)}
                data-testid={`button-filter-${opt.value}`}
              >
                {opt.label}
                <Badge variant="secondary" className="ml-1.5 text-[10px]">
                  {filterCounts[opt.value]}
                </Badge>
              </Button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Buscar actividad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-[240px]"
              data-testid="input-search-activity"
            />
          </div>
        </div>

        {groupedByDate.length === 0 ? (
          <Card className="p-8 text-center">
            <Search className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="text-sm text-muted-foreground" data-testid="text-no-results">No se encontraron actividades</p>
            {(filter !== "all" || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => { setFilter("all"); setSearchQuery(""); }}
                data-testid="button-clear-filters"
              >
                Limpiar filtros
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-5">
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
                        <div className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center mt-0.5 ${config.bgClass}`}>
                          <IconComponent className={`w-4 h-4 ${config.textClass}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm leading-relaxed" data-testid={`text-description-${item.id}`}>
                            {item.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
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
                          <Badge variant="secondary" className={`text-[10px] ${config.bgClass} ${config.textClass}`} data-testid={`badge-type-${item.id}`}>
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
  );
}
