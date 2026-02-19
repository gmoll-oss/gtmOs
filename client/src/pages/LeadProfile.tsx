import { useRoute, useLocation } from "wouter";
import { ArrowLeft, ExternalLink, Linkedin, Mail, Shield, CheckCircle2, Bot, RefreshCw, Plus, Calendar, Ban, ArrowRightCircle, Pause, Pencil } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { hotels } from "@/lib/mockData";

function ScoreCircle({ score, max }: { score: number; max: number }) {
  const pct = (score / max) * 100;
  const color = score >= 50 ? "#10B981" : score >= 30 ? "#F59E0B" : "#EF4444";
  const r = 40;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative w-28 h-28 mx-auto">
      <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" className="stroke-border" strokeWidth="6" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="6" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-foreground">{score}</span>
        <span className="text-[10px] text-muted-foreground">/ {max}</span>
      </div>
    </div>
  );
}

function SubScore({ label, score, max, items }: { label: string; score: number; max: number; items: string[] }) {
  const pct = (score / max) * 100;
  const color = pct >= 70 ? "#10B981" : pct >= 40 ? "#F59E0B" : "#EF4444";
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs font-medium" style={{ color }}>{score}/{max}</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-background">
        <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <div className="space-y-0.5">
        {items.map((item, i) => (
          <p key={i} className="text-[10px] text-muted-foreground">{item}</p>
        ))}
      </div>
    </div>
  );
}

const contactTimeline = [
  { date: "19 Feb 2026", action: "Email #2 programado", type: "scheduled" },
  { date: "18 Feb 2026", action: "LinkedIn - Mensaje de seguimiento enviado", type: "linkedin" },
  { date: "15 Feb 2026", action: "Email #1 - Abierto (2 veces)", type: "opened" },
  { date: "15 Feb 2026", action: "Email #1 - Introducción personalizada enviada", type: "sent" },
  { date: "14 Feb 2026", action: "LinkedIn - Solicitud de conexión enviada", type: "linkedin" },
  { date: "12 Feb 2026", action: "Lead enriquecido con datos de AI", type: "enrichment" },
  { date: "10 Feb 2026", action: "Lead importado a la base de datos", type: "import" },
];

function statusBadge(status: string) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    new: { bg: "bg-blue-500/15", text: "text-blue-600 dark:text-blue-400", label: "Nuevo" },
    in_cadence: { bg: "bg-purple-500/15", text: "text-purple-600 dark:text-purple-400", label: "En Cadencia" },
    nurturing: { bg: "bg-amber-500/15", text: "text-amber-600 dark:text-amber-400", label: "Nurturing" },
    sql: { bg: "bg-emerald-500/15", text: "text-emerald-600 dark:text-emerald-400", label: "SQL" },
    hibernated: { bg: "bg-gray-500/15", text: "text-gray-600 dark:text-gray-400", label: "Hibernado" },
    disqualified: { bg: "bg-red-500/15", text: "text-red-600 dark:text-red-400", label: "Descartado" },
  };
  const s = map[status] || map.new;
  return <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${s.bg} ${s.text}`}>{s.label}</span>;
}

export default function LeadProfile() {
  const [, params] = useRoute("/lead/:id");
  const [, navigate] = useLocation();
  const hotel = hotels.find((h) => h.id === params?.id);

  if (!hotel) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Hotel no encontrado</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/database")}>Volver</Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5 max-w-[1400px] mx-auto">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/database")} className="text-muted-foreground hover:text-foreground transition-colors" data-testid="button-back">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold text-foreground" data-testid="text-hotel-name">{hotel.name}</h1>
        {statusBadge(hotel.status)}
      </div>

      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-3 space-y-5">
          <Card className="p-5" data-testid="hotel-info">
            <h2 className="text-sm font-semibold text-foreground mb-4">Información del Hotel</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-foreground">{hotel.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-amber-600 dark:text-amber-400">{hotel.category === "GL" ? "Gran Lujo" : `${hotel.category}\u2605`}</span>
                  <span className="text-sm text-muted-foreground">{hotel.city}, {hotel.country}</span>
                </div>
                <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-md bg-primary/15 text-primary">{hotel.type}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Habitaciones</span><span className="text-foreground/80">{hotel.rooms}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">PMS</span><span className="text-foreground/80">{hotel.pms}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Web</span><span className="text-primary">{hotel.website}</span></div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Programa Loyalty</span>
                  <span className={hotel.hasLoyalty ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400 font-medium"}>{hotel.hasLoyalty ? "Si" : "No"}</span>
                </div>
                <div className="flex justify-between"><span className="text-muted-foreground">Ingresos anuales est.</span><span className="text-foreground/80">{hotel.annualRevenue}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">TripAdvisor</span><span className="text-foreground/80">{hotel.tripAdvisorRating}/5</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Booking</span><span className="text-foreground/80">{hotel.bookingRating}/10</span></div>
              </div>
            </div>
          </Card>

          <Card className="border-primary/30 p-5" data-testid="ai-briefing">
            <div className="flex items-center gap-2 mb-3">
              <Bot className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">AI Hotel Agent Briefing</h2>
            </div>
            <div className="bg-background rounded-lg p-4 text-sm text-foreground/80 leading-relaxed">
              {hotel.aiBriefing}
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-[10px] text-muted-foreground">Generado hace 2h</span>
              <Button variant="outline" size="sm" className="text-[11px] gap-1">
                <RefreshCw className="w-3 h-3" /> Regenerar
              </Button>
            </div>
          </Card>

          <Card className="p-5" data-testid="contact-timeline">
            <h2 className="text-sm font-semibold text-foreground mb-4">Historial de Contacto</h2>
            <div className="space-y-0">
              {contactTimeline.map((item, i) => (
                <div key={i} className="flex items-start gap-3 pb-4 relative">
                  {i < contactTimeline.length - 1 && (
                    <div className="absolute left-[11px] top-6 bottom-0 w-[1px] bg-border" />
                  )}
                  <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.type === "scheduled" ? "bg-primary/15" :
                    item.type === "opened" ? "bg-emerald-500/15" :
                    item.type === "linkedin" ? "bg-blue-500/15" :
                    "bg-muted"
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      item.type === "scheduled" ? "bg-primary" :
                      item.type === "opened" ? "bg-emerald-500" :
                      item.type === "sent" ? "bg-amber-500" :
                      item.type === "linkedin" ? "bg-blue-500" :
                      "bg-muted-foreground"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${item.type === "scheduled" ? "text-primary" : "text-foreground/80"}`}>{item.action}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="col-span-2 space-y-5">
          <Card className="p-5" data-testid="decision-maker">
            <h2 className="text-sm font-semibold text-foreground mb-4">Decision Maker</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center text-primary font-semibold text-sm">
                {hotel.decisionMaker.initials}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{hotel.decisionMaker.name}</p>
                <p className="text-xs text-muted-foreground">{hotel.decisionMaker.title}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Linkedin className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                <span className="text-xs text-primary">{hotel.decisionMaker.linkedIn}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{hotel.decisionMaker.email}</span>
              </div>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {hotel.decisionMaker.emailVerified && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <Shield className="w-2.5 h-2.5" /> Email verificado
                  </span>
                )}
                {hotel.decisionMaker.confirmed && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-primary/15 text-primary">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Decision maker confirmado
                  </span>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-5" data-testid="contact-value">
            <h2 className="text-sm font-semibold text-foreground mb-4">Contact Value Score</h2>
            <ScoreCircle score={hotel.contactValue} max={100} />
            <div className="mt-5 space-y-4">
              <SubScore
                label="Company Score (ICP fit)"
                score={hotel.companyScore}
                max={40}
                items={[
                  `${hotel.rooms} habitaciones (${hotel.rooms < 50 ? "ideal" : hotel.rooms < 200 ? "bueno" : "grande"})`,
                  `${hotel.hasLoyalty ? "Tiene" : "Sin"} programa loyalty`,
                  `${hotel.category}\u2605 - ${hotel.type}`,
                ]}
              />
              <SubScore
                label="Person Score"
                score={hotel.personScore}
                max={30}
                items={[
                  `${hotel.decisionMaker.title}`,
                  `${hotel.decisionMaker.yearsInRole} años en el cargo`,
                  `Email ${hotel.decisionMaker.emailVerified ? "verificado" : "no verificado"}`,
                ]}
              />
              <SubScore
                label="Behavior Score"
                score={hotel.behaviorScore}
                max={30}
                items={[
                  hotel.behaviorScore === 0 ? "Sin interacciones registradas" : `${hotel.behaviorScore} puntos de engagement`,
                  hotel.behaviorScore < 5 ? "Engagement bajo" : "Engagement activo",
                ]}
              />
            </div>
          </Card>

          {hotel.cadence && (
            <Card className="p-5" data-testid="current-cadence">
              <h2 className="text-sm font-semibold text-foreground mb-3">Cadencia Actual</h2>
              <p className="text-sm text-primary font-medium">{hotel.cadence}</p>
              <p className="text-xs text-muted-foreground mt-1">Paso {hotel.cadenceStep} de {hotel.cadenceTotalSteps} - Email #{hotel.cadenceStep && hotel.cadenceStep > 1 ? "2" : "1"} programado</p>
              <p className="text-xs text-muted-foreground mt-1">Próxima acción: mañana a las 10:00</p>
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" className="text-[11px] gap-1">
                  <Pencil className="w-3 h-3" /> Cambiar
                </Button>
                <Button variant="outline" size="sm" className="text-[11px] gap-1">
                  <Pause className="w-3 h-3" /> Pausar
                </Button>
              </div>
            </Card>
          )}

          <Card className="p-5" data-testid="quick-actions">
            <h2 className="text-sm font-semibold text-foreground mb-3">Acciones Rápidas</h2>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="text-[11px] gap-1.5 justify-start">
                <Plus className="w-3 h-3" /> Añadir nota
              </Button>
              <Button variant="outline" size="sm" className="text-[11px] gap-1.5 justify-start">
                <Calendar className="w-3 h-3" /> Programar tarea
              </Button>
              <Button variant="outline" size="sm" className="text-[11px] gap-1.5 justify-start">
                <Ban className="w-3 h-3" /> Blacklist
              </Button>
              <Button variant="outline" size="sm" className="text-emerald-600 dark:text-emerald-400 text-[11px] gap-1.5 justify-start border-emerald-500/30">
                <ArrowRightCircle className="w-3 h-3" /> Mover a SQL
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
