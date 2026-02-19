import { useState, useEffect } from "react";
import { Mail, Linkedin, MessageCircle, Send, CheckCircle, ArrowRightCircle, AlertTriangle, Ban, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRegionContext } from "@/contexts/RegionContext";
import { getConversationsByZone } from "@/lib/zoneFilters";

function channelIcon(channel: string) {
  switch (channel) {
    case "email": return <Mail className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />;
    case "linkedin": return <Linkedin className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />;
    case "whatsapp": return <MessageCircle className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />;
    default: return <Mail className="w-3.5 h-3.5 text-muted-foreground" />;
  }
}

function priorityDot(priority: string) {
  switch (priority) {
    case "urgent": return "bg-red-500";
    case "normal": return "bg-amber-500";
    default: return "bg-muted-foreground/30";
  }
}

function cvColor(value: number) {
  if (value >= 40) return "text-emerald-600 dark:text-emerald-400";
  if (value >= 20) return "text-amber-600 dark:text-amber-400";
  return "text-muted-foreground";
}

export default function Unibox() {
  const { region, currentZone } = useRegionContext();
  const zoneConversations = getConversationsByZone(region);
  const [selectedId, setSelectedId] = useState(zoneConversations[0]?.id);
  const [filter, setFilter] = useState<"all" | "unread" | "action" | "handled">("all");

  useEffect(() => {
    setSelectedId(zoneConversations[0]?.id);
  }, [region]);

  const selected = zoneConversations.find((c) => c.id === selectedId);

  const filtered = zoneConversations.filter((c) => {
    if (filter === "unread") return c.unread;
    if (filter === "action") return c.requiresAction;
    if (filter === "handled") return !c.requiresAction && !c.unread;
    return true;
  });

  const tabs = [
    { key: "all" as const, label: "Todos", count: zoneConversations.length },
    { key: "unread" as const, label: "No leídos", count: zoneConversations.filter((c) => c.unread).length },
    { key: "action" as const, label: "Requiere Acción", count: zoneConversations.filter((c) => c.requiresAction).length },
    { key: "handled" as const, label: "Gestionados", count: 0 },
  ];

  return (
    <div className="p-6 h-screen max-w-[1400px] mx-auto">
      <h1 className="text-xl font-semibold text-foreground mb-5" data-testid="text-page-title">
        Unified Inbox {currentZone ? `- ${currentZone.name}` : ""}
      </h1>
      <div className="grid grid-cols-5 gap-4 h-[calc(100%-70px)]">
        <div className="col-span-2 flex flex-col">
          <div className="flex items-center gap-1 mb-3 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`text-[11px] font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
                  filter === tab.key
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid={`tab-filter-${tab.key}`}
              >
                {tab.label} {tab.count > 0 && <span className="ml-1 text-[10px]">{tab.count}</span>}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5">
            {filtered.map((conv) => (
              <Card
                key={conv.id}
                className={`p-3 cursor-pointer transition-colors ${
                  selectedId === conv.id
                    ? "border-primary/40"
                    : "hover:border-muted-foreground/30"
                }`}
                onClick={() => setSelectedId(conv.id)}
                data-testid={`card-conversation-${conv.id}`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="flex flex-col items-center gap-1 pt-0.5">
                    <div className={`w-2 h-2 rounded-full ${priorityDot(conv.priority)}`} />
                    {channelIcon(conv.channel)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs font-medium truncate ${conv.unread ? "text-foreground" : "text-foreground/80"}`}>{conv.contactName}</span>
                      <span className="text-[10px] text-muted-foreground flex-shrink-0">{conv.timeAgo}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">{conv.hotelName}</p>
                    <p className={`text-xs mt-1 truncate ${conv.unread ? "text-foreground/80" : "text-muted-foreground"}`}>{conv.preview}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[10px] font-medium ${cvColor(conv.contactValue)}`}>CV: {conv.contactValue}</span>
                      {conv.requiresAction && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-red-500/15 text-red-600 dark:text-red-400">Acción</span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="col-span-3 flex flex-col">
          {selected ? (
            <Card className="flex flex-col h-full">
              <div className="p-4 border-b border-border flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-xs text-primary font-semibold">
                    {selected.contactName.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{selected.contactName}</p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span>{selected.hotelName}</span>
                      <span className={`font-medium ${cvColor(selected.contactValue)}`}>CV: {selected.contactValue}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {channelIcon(selected.channel)}
                  <span className="text-xs text-muted-foreground capitalize">{selected.channel}</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selected.messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.isOutbound ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-xl p-3 ${
                      msg.isOutbound
                        ? "bg-primary/15 border border-primary/20"
                        : "bg-background border border-border"
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-medium text-muted-foreground">{msg.from}</span>
                        <span className="text-[10px] text-muted-foreground/60">{msg.timestamp}</span>
                      </div>
                      <p className="text-xs text-foreground/80 leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))}

                {selected.suggestedReply && (
                  <div className="border border-dashed border-primary/30 rounded-xl p-3 bg-primary/5">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Sparkles className="w-3 h-3 text-primary" />
                      <span className="text-[10px] font-medium text-primary">Respuesta sugerida por AI</span>
                    </div>
                    <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-line">{selected.suggestedReply}</p>
                    <Button variant="outline" size="sm" className="mt-3 bg-primary/15 border-primary/30 text-primary text-[11px] gap-1">
                      <Send className="w-3 h-3" /> Usar esta respuesta
                    </Button>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Escribe tu respuesta..."
                    className="flex-1 bg-background border border-border text-foreground text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
                    data-testid="input-reply"
                  />
                  <Button size="icon" className="bg-primary text-primary-foreground" data-testid="button-send">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button variant="outline" size="sm" className="text-[10px] gap-1">
                    <CheckCircle className="w-3 h-3" /> Marcar gestionado
                  </Button>
                  <Button variant="outline" size="sm" className="text-[10px] gap-1">
                    <ArrowRightCircle className="w-3 h-3" /> Mover a nurturing
                  </Button>
                  <Button variant="outline" size="sm" className="text-[10px] gap-1">
                    <AlertTriangle className="w-3 h-3" /> Escalar a AE
                  </Button>
                  <Button variant="outline" size="sm" className="text-[10px] gap-1">
                    <Ban className="w-3 h-3" /> Blacklist
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">Selecciona una conversación</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
