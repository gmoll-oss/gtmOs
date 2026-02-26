import { useState, useMemo } from "react";
import { Search, Inbox as InboxIcon, Circle, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { inboxThreads, AI_TAG_CONFIG, type InboxThread, type InboxMessage } from "@/lib/mockData";

type AiTagFilter = "all" | "meeting_requested" | "interested" | "not_interested" | "auto_reply" | "question" | "out_of_office";

const AI_TAG_FILTERS: { value: AiTagFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "meeting_requested", label: "Reunión" },
  { value: "interested", label: "Interesado" },
  { value: "not_interested", label: "No interesado" },
  { value: "auto_reply", label: "Auto-respuesta" },
  { value: "question", label: "Pregunta" },
  { value: "out_of_office", label: "Fuera de oficina" },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) {
    return d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  }
  if (diffDays === 1) return "Ayer";
  if (diffDays < 7) return `Hace ${diffDays}d`;
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

function formatFullDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getLastMessagePreview(thread: InboxThread): string {
  const last = thread.messages[thread.messages.length - 1];
  if (!last) return "";
  const prefix = last.direction === "outbound" ? "Tú: " : "";
  const text = last.body.replace(/\n/g, " ").slice(0, 80);
  return `${prefix}${text}${last.body.length > 80 ? "..." : ""}`;
}

function ThreadListItem({
  thread,
  isSelected,
  onClick,
}: {
  thread: InboxThread;
  isSelected: boolean;
  onClick: () => void;
}) {
  const tagConfig = thread.aiTag ? AI_TAG_CONFIG[thread.aiTag] : null;

  return (
    <div
      data-testid={`thread-item-${thread.id}`}
      onClick={onClick}
      className={`flex items-start gap-3 p-3 cursor-pointer hover-elevate rounded-md transition-colors ${
        isSelected ? "bg-accent" : ""
      }`}
    >
      <div className="relative flex-shrink-0">
        <Avatar>
          <AvatarFallback className="text-xs">{getInitials(thread.leadName)}</AvatarFallback>
        </Avatar>
        {thread.unread && (
          <Circle
            className="absolute -top-0.5 -right-0.5 w-3 h-3 fill-primary text-primary"
            data-testid={`unread-indicator-${thread.id}`}
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span
            className={`text-sm truncate ${thread.unread ? "font-semibold" : "font-medium"}`}
            data-testid={`thread-name-${thread.id}`}
          >
            {thread.leadName}
          </span>
          <span className="text-xs text-muted-foreground flex-shrink-0" data-testid={`thread-time-${thread.id}`}>
            {formatTime(thread.lastMessageAt)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5" data-testid={`thread-company-${thread.id}`}>
          {thread.leadCompany}
        </p>
        <p
          className={`text-xs mt-1 truncate ${thread.unread ? "text-foreground" : "text-muted-foreground"}`}
          data-testid={`thread-preview-${thread.id}`}
        >
          {getLastMessagePreview(thread)}
        </p>
        {tagConfig && (
          <Badge
            variant="secondary"
            className={`mt-1.5 text-[10px] ${tagConfig.bgClass} ${tagConfig.textClass}`}
            data-testid={`thread-tag-${thread.id}`}
          >
            {tagConfig.label}
          </Badge>
        )}
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: InboxMessage }) {
  const isOutbound = message.direction === "outbound";

  return (
    <div
      className={`flex ${isOutbound ? "justify-end" : "justify-start"} mb-4`}
      data-testid={`message-${message.id}`}
    >
      <div
        className={`max-w-[75%] rounded-md p-3 ${
          isOutbound
            ? "bg-teal-50 dark:bg-teal-900/30"
            : "bg-muted"
        }`}
      >
        <p className="text-xs font-medium mb-1 text-muted-foreground">
          {message.subject}
        </p>
        <div className="text-sm whitespace-pre-line" data-testid={`message-body-${message.id}`}>
          {message.body}
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 text-right">
          {formatFullDate(message.timestamp)}
        </p>
      </div>
    </div>
  );
}

function ConversationPanel({ thread }: { thread: InboxThread }) {
  const tagConfig = thread.aiTag ? AI_TAG_CONFIG[thread.aiTag] : null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-2 p-4 border-b flex-wrap">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="text-xs">{getInitials(thread.leadName)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm" data-testid="conversation-name">
              {thread.leadName}
            </h3>
            <p className="text-xs text-muted-foreground" data-testid="conversation-company">
              {thread.leadCompany}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {tagConfig && (
            <Badge
              variant="secondary"
              className={`${tagConfig.bgClass} ${tagConfig.textClass}`}
              data-testid="conversation-tag"
            >
              {tagConfig.label}
            </Badge>
          )}
          {thread.unread && (
            <Badge variant="secondary" data-testid="conversation-unread-badge">
              No leído
            </Badge>
          )}
        </div>
      </div>
      <ScrollArea className="flex-1 p-4">
        {thread.messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </ScrollArea>
    </div>
  );
}

export default function InboxPage() {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(
    inboxThreads.length > 0 ? inboxThreads[0].id : null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [tagFilter, setTagFilter] = useState<AiTagFilter>("all");

  const filteredThreads = useMemo(() => {
    let threads = [...inboxThreads].sort(
      (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    );

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      threads = threads.filter(
        (t) =>
          t.leadName.toLowerCase().includes(q) ||
          t.leadCompany.toLowerCase().includes(q) ||
          t.messages.some((m) => m.body.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q))
      );
    }

    if (tagFilter !== "all") {
      threads = threads.filter((t) => t.aiTag === tagFilter);
    }

    return threads;
  }, [searchQuery, tagFilter]);

  const selectedThread = useMemo(
    () => inboxThreads.find((t) => t.id === selectedThreadId) || null,
    [selectedThreadId]
  );

  const unreadCount = inboxThreads.filter((t) => t.unread).length;

  return (
    <div className="flex flex-col h-full" data-testid="inbox-page">
      <div className="flex items-center gap-3 p-4 border-b flex-wrap">
        <InboxIcon className="w-5 h-5 text-muted-foreground" />
        <h1 className="text-lg font-semibold" data-testid="text-page-title">Inbox</h1>
        {unreadCount > 0 && (
          <Badge variant="default" data-testid="badge-unread-count">
            {unreadCount} sin leer
          </Badge>
        )}
      </div>

      <div className="flex flex-1 min-h-0">
        <div className="w-full md:w-[360px] flex-shrink-0 border-r flex flex-col">
          <div className="p-3 border-b space-y-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar conversaciones..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-conversations"
              />
            </div>
            <div className="flex gap-1 overflow-x-auto pb-1 flex-wrap">
              {AI_TAG_FILTERS.map((f) => (
                <Button
                  key={f.value}
                  size="sm"
                  variant={tagFilter === f.value ? "default" : "ghost"}
                  onClick={() => setTagFilter(f.value)}
                  data-testid={`filter-tag-${f.value}`}
                  className="toggle-elevate"
                >
                  {f.label}
                </Button>
              ))}
            </div>
          </div>

          <ScrollArea className="flex-1">
            {filteredThreads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <InboxIcon className="w-10 h-10 mb-2" />
                <p className="text-sm" data-testid="text-no-conversations">No hay conversaciones</p>
              </div>
            ) : (
              <div className="p-2 space-y-0.5">
                {filteredThreads.map((thread) => (
                  <ThreadListItem
                    key={thread.id}
                    thread={thread}
                    isSelected={thread.id === selectedThreadId}
                    onClick={() => setSelectedThreadId(thread.id)}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        <div className="hidden md:flex flex-1 flex-col min-w-0">
          {selectedThread ? (
            <ConversationPanel thread={selectedThread} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <InboxIcon className="w-12 h-12 mb-3" />
              <p className="text-sm" data-testid="text-select-conversation">
                Selecciona una conversación para ver los mensajes
              </p>
            </div>
          )}
        </div>

        {selectedThread && (
          <div className="flex md:hidden flex-1 flex-col min-w-0 absolute inset-0 bg-background z-10">
            <div className="p-2 border-b">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedThreadId(null)}
                data-testid="button-back-to-list"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Volver
              </Button>
            </div>
            <ConversationPanel thread={selectedThread} />
          </div>
        )}
      </div>
    </div>
  );
}
