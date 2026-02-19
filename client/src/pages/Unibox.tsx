import { useState } from "react";
import { Mail, Linkedin, MessageCircle, Send, CheckCircle, ArrowRightCircle, AlertTriangle, Ban, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { conversations } from "@/lib/mockData";

function channelIcon(channel: string) {
  switch (channel) {
    case "email": return <Mail className="w-3.5 h-3.5 text-blue-400" />;
    case "linkedin": return <Linkedin className="w-3.5 h-3.5 text-sky-400" />;
    case "whatsapp": return <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />;
    default: return <Mail className="w-3.5 h-3.5 text-[#9CA3AF]" />;
  }
}

function priorityDot(priority: string) {
  switch (priority) {
    case "urgent": return "bg-red-500";
    case "normal": return "bg-amber-500";
    default: return "bg-[#3A3D4E]";
  }
}

function cvColor(value: number) {
  if (value >= 40) return "text-[#10B981]";
  if (value >= 20) return "text-[#F59E0B]";
  return "text-[#6B7280]";
}

export default function Unibox() {
  const [selectedId, setSelectedId] = useState(conversations[0]?.id);
  const [filter, setFilter] = useState<"all" | "unread" | "action" | "handled">("all");
  const selected = conversations.find((c) => c.id === selectedId);

  const filtered = conversations.filter((c) => {
    if (filter === "unread") return c.unread;
    if (filter === "action") return c.requiresAction;
    if (filter === "handled") return !c.requiresAction && !c.unread;
    return true;
  });

  const tabs = [
    { key: "all" as const, label: "Todos", count: conversations.length },
    { key: "unread" as const, label: "No leídos", count: conversations.filter((c) => c.unread).length },
    { key: "action" as const, label: "Requiere Acción", count: conversations.filter((c) => c.requiresAction).length },
    { key: "handled" as const, label: "Gestionados", count: 0 },
  ];

  return (
    <div className="p-6 h-screen max-w-[1400px] mx-auto">
      <h1 className="text-xl font-semibold text-[#F9FAFB] mb-5" data-testid="text-page-title">Unified Inbox</h1>
      <div className="grid grid-cols-5 gap-4 h-[calc(100%-70px)]">
        <div className="col-span-2 flex flex-col">
          <div className="flex items-center gap-1 mb-3 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`text-[11px] font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
                  filter === tab.key
                    ? "bg-[#6366F1]/15 text-[#818CF8]"
                    : "text-[#6B7280] hover:text-[#E5E7EB]"
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
                    ? "bg-[#1A1D27] border-[#6366F1]/40"
                    : "bg-[#1A1D27] border-[#2A2D3E] hover:border-[#3A3D4E]"
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
                      <span className={`text-xs font-medium truncate ${conv.unread ? "text-[#F9FAFB]" : "text-[#E5E7EB]"}`}>{conv.contactName}</span>
                      <span className="text-[10px] text-[#6B7280] flex-shrink-0">{conv.timeAgo}</span>
                    </div>
                    <p className="text-[10px] text-[#6B7280] truncate">{conv.hotelName}</p>
                    <p className={`text-xs mt-1 truncate ${conv.unread ? "text-[#E5E7EB]" : "text-[#9CA3AF]"}`}>{conv.preview}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[10px] font-medium ${cvColor(conv.contactValue)}`}>CV: {conv.contactValue}</span>
                      {conv.requiresAction && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-red-500/15 text-red-400">Acción</span>
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
            <Card className="bg-[#1A1D27] border-[#2A2D3E] flex flex-col h-full">
              <div className="p-4 border-b border-[#2A2D3E] flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#6366F1]/15 flex items-center justify-center text-xs text-[#818CF8] font-semibold">
                    {selected.contactName.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#F9FAFB]">{selected.contactName}</p>
                    <div className="flex items-center gap-2 text-[10px] text-[#6B7280]">
                      <span>{selected.hotelName}</span>
                      <span className={`font-medium ${cvColor(selected.contactValue)}`}>CV: {selected.contactValue}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {channelIcon(selected.channel)}
                  <span className="text-xs text-[#9CA3AF] capitalize">{selected.channel}</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selected.messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.isOutbound ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-xl p-3 ${
                      msg.isOutbound
                        ? "bg-[#6366F1]/15 border border-[#6366F1]/20"
                        : "bg-[#0F1117] border border-[#2A2D3E]"
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-medium text-[#9CA3AF]">{msg.from}</span>
                        <span className="text-[10px] text-[#6B7280]">{msg.timestamp}</span>
                      </div>
                      <p className="text-xs text-[#E5E7EB] leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))}

                {selected.suggestedReply && (
                  <div className="border border-dashed border-[#6366F1]/30 rounded-xl p-3 bg-[#6366F1]/5">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Sparkles className="w-3 h-3 text-[#818CF8]" />
                      <span className="text-[10px] font-medium text-[#818CF8]">Respuesta sugerida por AI</span>
                    </div>
                    <p className="text-xs text-[#E5E7EB] leading-relaxed whitespace-pre-line">{selected.suggestedReply}</p>
                    <Button variant="outline" size="sm" className="mt-3 bg-[#6366F1]/15 border-[#6366F1]/30 text-[#818CF8] text-[11px] gap-1">
                      <Send className="w-3 h-3" /> Usar esta respuesta
                    </Button>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-[#2A2D3E]">
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Escribe tu respuesta..."
                    className="flex-1 bg-[#0F1117] border border-[#2A2D3E] text-[#E5E7EB] text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#6366F1] placeholder:text-[#6B7280]"
                    data-testid="input-reply"
                  />
                  <Button size="icon" className="bg-[#6366F1] text-white" data-testid="button-send">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button variant="outline" size="sm" className="bg-transparent border-[#2A2D3E] text-[#9CA3AF] text-[10px] gap-1">
                    <CheckCircle className="w-3 h-3" /> Marcar gestionado
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent border-[#2A2D3E] text-[#9CA3AF] text-[10px] gap-1">
                    <ArrowRightCircle className="w-3 h-3" /> Mover a nurturing
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent border-[#2A2D3E] text-[#9CA3AF] text-[10px] gap-1">
                    <AlertTriangle className="w-3 h-3" /> Escalar a AE
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent border-[#2A2D3E] text-[#9CA3AF] text-[10px] gap-1">
                    <Ban className="w-3 h-3" /> Blacklist
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="bg-[#1A1D27] border-[#2A2D3E] flex items-center justify-center h-full">
              <p className="text-sm text-[#6B7280]">Selecciona una conversación</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
