import { useRoute, useLocation } from "wouter";
import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  Building2,
  MapPin,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  Send,
  Eye,
  MessageSquare,
  AlertTriangle,
  RefreshCw,
  Zap,
  ChevronRight,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  leads,
  sequences,
  enrichmentAttempts,
  eventLogs,
  getLeadExclusionChecks,
  LEAD_STATUS_CONFIG,
  type Lead,
} from "@/lib/mockData";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatShortDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function ScoreBar({ label, value, max = 100 }: { label: string; value: number; max?: number }) {
  const pct = (value / max) * 100;
  const color = pct >= 75 ? "bg-emerald-500 dark:bg-emerald-400" : pct >= 50 ? "bg-amber-500 dark:bg-amber-400" : "bg-red-500 dark:bg-red-400";
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] text-muted-foreground">{label}</span>
        <span className="text-[13px] font-medium text-foreground">{value}/{max}</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-muted">
        <div className={`h-1.5 rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Lead["status"] }) {
  const config = LEAD_STATUS_CONFIG[status];
  return (
    <Badge variant="outline" className={`${config.bgClass} ${config.textClass} border-transparent rounded-full text-[11px]`} data-testid="badge-lead-status">
      {config.label}
    </Badge>
  );
}

function EventIcon({ type }: { type: string }) {
  const iconClass = "w-3.5 h-3.5";
  switch (type) {
    case "discovered":
      return <Zap className={`${iconClass} text-slate-500 dark:text-slate-400`} />;
    case "qualified":
      return <CheckCircle2 className={`${iconClass} text-blue-500 dark:text-blue-400`} />;
    case "enriched":
      return <RefreshCw className={`${iconClass} text-violet-500 dark:text-violet-400`} />;
    case "exclusion_check":
      return <Shield className={`${iconClass} text-amber-500 dark:text-amber-400`} />;
    case "excluded":
      return <XCircle className={`${iconClass} text-red-500 dark:text-red-400`} />;
    case "enrolled":
      return <Users className={`${iconClass} text-teal-500 dark:text-teal-400`} />;
    case "email_sent":
      return <Send className={`${iconClass} text-blue-500 dark:text-blue-400`} />;
    case "email_opened":
      return <Eye className={`${iconClass} text-emerald-500 dark:text-emerald-400`} />;
    case "email_replied":
      return <MessageSquare className={`${iconClass} text-green-500 dark:text-green-400`} />;
    case "email_bounced":
      return <AlertTriangle className={`${iconClass} text-red-500 dark:text-red-400`} />;
    case "ready_to_sync":
      return <Clock className={`${iconClass} text-orange-500 dark:text-orange-400`} />;
    case "synced":
      return <CheckCircle2 className={`${iconClass} text-green-500 dark:text-green-400`} />;
    case "score_updated":
      return <Zap className={`${iconClass} text-violet-500 dark:text-violet-400`} />;
    default:
      return <Clock className={`${iconClass} text-muted-foreground`} />;
  }
}

function InfoRow({ label, value, testId }: { label: string; value: string; testId?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="text-[13px] text-muted-foreground">{label}</span>
      <span className="text-[13px] text-foreground text-right" data-testid={testId}>{value}</span>
    </div>
  );
}

export default function LeadDetail() {
  const [, params] = useRoute("/lead/:id");
  const [, navigate] = useLocation();
  const lead = leads.find((l) => l.id === params?.id);

  if (!lead) {
    return (
      <div className="p-8 text-center" data-testid="text-lead-not-found">
        <p className="text-sm text-muted-foreground">Lead no encontrado</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/leads")} data-testid="button-back-to-leads">
          Volver a Leads
        </Button>
      </div>
    );
  }

  const leadEnrichments = enrichmentAttempts.filter((ea) => ea.leadId === lead.id);
  const leadEvents = eventLogs
    .filter((ev) => ev.leadId === lead.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const exclusionChecks = getLeadExclusionChecks(lead);
  const currentSequence = lead.sequenceId ? sequences.find((s) => s.id === lead.sequenceId) : null;

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground flex-wrap" data-testid="breadcrumb-nav">
          <button onClick={() => navigate("/leads")} className="hover:underline" data-testid="breadcrumb-leads">Leads</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">{lead.name}</span>
        </div>

        <div className="flex items-center gap-3 pt-1 flex-wrap">
          <Button variant="ghost" size="icon" onClick={() => navigate("/leads")} data-testid="button-back">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-semibold text-foreground" data-testid="text-lead-name">{lead.name}</h1>
              <StatusBadge status={lead.status} />
              <Badge variant="secondary" className="rounded-full text-[11px]" data-testid="badge-lead-score">Score: {lead.score}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5" data-testid="text-lead-title">
              {lead.title} en {lead.company}
            </p>
          </div>
        </div>
      </div>

      <Card className="p-5" data-testid="section-header-card">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground">Email</p>
              <p className="text-[13px] text-foreground truncate" data-testid="text-lead-email">{lead.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
              <Phone className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground">Tel</p>
              <p className="text-[13px] text-foreground" data-testid="text-lead-phone">{lead.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
              <Building2 className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground">Empresa</p>
              <p className="text-[13px] text-foreground" data-testid="text-lead-company">{lead.company}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground">Ubicacion</p>
              <p className="text-[13px] text-foreground" data-testid="text-lead-location">{lead.city}, {lead.country}</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card className="p-5" data-testid="section-contact-info">
            <h2 className="text-sm font-semibold text-foreground mb-4">Informacion de Contacto y Empresa</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              <div className="divide-y divide-border">
                <InfoRow label="Email" value={lead.email} testId="text-detail-email" />
                <InfoRow label="Telefono" value={lead.phone} testId="text-detail-phone" />
                <InfoRow label="Empresa" value={lead.company} testId="text-detail-company" />
                <InfoRow label="Ubicacion" value={`${lead.city}, ${lead.country}`} testId="text-detail-location" />
              </div>
              <div className="divide-y divide-border">
                <div className="flex items-center justify-between gap-4 py-2">
                  <span className="text-[13px] text-muted-foreground">Web</span>
                  <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-[13px] text-primary truncate flex items-center gap-1" data-testid="link-lead-website">
                    {lead.domain}
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>
                <InfoRow label="Industria" value={lead.industry} testId="text-lead-industry" />
                <InfoRow label="Empleados" value={lead.employeeCount.toString()} testId="text-lead-employees" />
                <InfoRow label="Fuente" value={lead.source} testId="text-lead-source" />
              </div>
            </div>
          </Card>

          <Card className="p-5" data-testid="section-enrichment">
            <h2 className="text-sm font-semibold text-foreground mb-4">Datos de Enriquecimiento (Waterfall)</h2>
            {leadEnrichments.length === 0 ? (
              <p className="text-[13px] text-muted-foreground" data-testid="text-no-enrichment">Sin intentos de enriquecimiento registrados</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left" data-testid="table-enrichment">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-[11px] font-medium text-muted-foreground pb-2 pr-4">Proveedor</th>
                      <th className="text-[11px] font-medium text-muted-foreground pb-2 pr-4">Estado</th>
                      <th className="text-[11px] font-medium text-muted-foreground pb-2 pr-4">Confianza</th>
                      <th className="text-[11px] font-medium text-muted-foreground pb-2 pr-4">Campos</th>
                      <th className="text-[11px] font-medium text-muted-foreground pb-2 text-right">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leadEnrichments.map((ea) => (
                      <tr key={ea.id} className="border-b border-border last:border-0" data-testid={`enrichment-attempt-${ea.id}`}>
                        <td className="py-2.5 pr-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                              ea.status === "success" ? "bg-emerald-500" :
                              ea.status === "partial" ? "bg-amber-500" :
                              ea.status === "failed" ? "bg-red-500" :
                              "bg-slate-400"
                            }`} />
                            <span className="text-[13px] font-medium text-foreground">{ea.provider}</span>
                          </div>
                        </td>
                        <td className="py-2.5 pr-4">
                          <Badge variant="outline" className={`text-[10px] rounded-full border-transparent ${
                            ea.status === "success" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" :
                            ea.status === "partial" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" :
                            ea.status === "failed" ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" :
                            "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          }`}>
                            {ea.status === "success" ? "Exitoso" : ea.status === "partial" ? "Parcial" : ea.status === "failed" ? "Fallido" : "Pendiente"}
                          </Badge>
                        </td>
                        <td className="py-2.5 pr-4">
                          <span className="text-[13px] text-muted-foreground">{Math.round(ea.confidence * 100)}%</span>
                        </td>
                        <td className="py-2.5 pr-4">
                          <div className="flex gap-1 flex-wrap">
                            {ea.fieldsFound.map((field) => (
                              <Badge key={field} variant="secondary" className="text-[10px] rounded-full">
                                {field}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="py-2.5 text-right">
                          <span className="text-[12px] text-muted-foreground">{formatShortDate(ea.timestamp)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <Card className="p-5" data-testid="section-exclusion-checks">
            <h2 className="text-sm font-semibold text-foreground mb-4">Verificacion de Exclusion</h2>
            <div className="space-y-0 divide-y divide-border">
              {exclusionChecks.map((check, i) => (
                <div key={i} className="flex items-center justify-between gap-3 py-2.5" data-testid={`exclusion-check-${i}`}>
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    {check.passed ? (
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                    )}
                    <span className="text-[13px] text-foreground">{check.rule}</span>
                  </div>
                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <Badge variant="secondary" className="text-[10px] rounded-full">{check.source}</Badge>
                    {check.passed ? (
                      <span className="text-[12px] text-emerald-600 dark:text-emerald-400 font-medium">OK</span>
                    ) : (
                      <span className="text-[12px] text-red-600 dark:text-red-400 font-medium">Bloqueado</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {lead.excluded && lead.exclusionReason && (
              <div className="mt-4 p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-[13px] text-red-700 dark:text-red-300 font-medium" data-testid="text-exclusion-reason">
                  Motivo de exclusion: {lead.exclusionReason}
                </p>
                {lead.exclusionTimestamp && (
                  <p className="text-[12px] text-red-600 dark:text-red-400 mt-1">
                    Excluido el {formatShortDate(lead.exclusionTimestamp)}
                  </p>
                )}
              </div>
            )}
          </Card>

          <Card className="p-5" data-testid="section-event-timeline">
            <h2 className="text-sm font-semibold text-foreground mb-4">Timeline de Eventos</h2>
            {leadEvents.length === 0 ? (
              <p className="text-[13px] text-muted-foreground" data-testid="text-no-events">Sin eventos registrados</p>
            ) : (
              <div className="space-y-0">
                {leadEvents.map((event, i) => (
                  <div key={event.id} className="flex items-start gap-3 pb-4 relative" data-testid={`event-${event.id}`}>
                    {i < leadEvents.length - 1 && (
                      <div className="absolute left-[9px] top-6 bottom-0 w-px bg-border" />
                    )}
                    <div className="w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0 bg-muted mt-0.5">
                      <EventIcon type={event.type} />
                    </div>
                    <div className="flex-1 min-w-0 pt-px">
                      <p className="text-[13px] text-foreground">{event.description}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{formatDate(event.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-5" data-testid="section-scoring">
            <h2 className="text-sm font-semibold text-foreground mb-5">Desglose de Scoring</h2>
            <div className="flex items-center justify-center mb-5">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" className="stroke-muted" strokeWidth="5" />
                  <circle
                    cx="50" cy="50" r="42" fill="none"
                    className="stroke-primary"
                    strokeWidth="5"
                    strokeDasharray={2 * Math.PI * 42}
                    strokeDashoffset={2 * Math.PI * 42 * (1 - lead.score / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-foreground" data-testid="text-total-score">{lead.score}</span>
                  <span className="text-[10px] text-muted-foreground">/ 100</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <ScoreBar label="ICP Score" value={lead.icpScore} />
              <ScoreBar label="Completeness Score" value={lead.completenessScore} />
              <ScoreBar label="Signal Score" value={lead.signalScore} />
            </div>
            <div className="mt-4 pt-3 border-t border-border space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[13px] text-muted-foreground">Confianza de enriquecimiento</span>
                <span className="text-[13px] font-medium text-foreground" data-testid="text-enrichment-confidence">{Math.round(lead.enrichmentConfidence * 100)}%</span>
              </div>
              {lead.lastEnrichedAt && (
                <p className="text-[11px] text-muted-foreground" data-testid="text-last-enriched">
                  Ultimo enriquecimiento: {formatShortDate(lead.lastEnrichedAt)}
                </p>
              )}
            </div>
          </Card>

          <Card className="p-5" data-testid="section-sequence">
            <h2 className="text-sm font-semibold text-foreground mb-4">Inscripcion en Secuencia</h2>
            {currentSequence ? (
              <div className="space-y-3">
                <div>
                  <p className="text-[13px] font-medium text-primary" data-testid="text-sequence-name">{currentSequence.name}</p>
                  <Badge variant="outline" className="mt-1.5 text-[10px] rounded-full border-transparent bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                    {currentSequence.status === "active" ? "Activa" : currentSequence.status === "paused" ? "Pausada" : "Borrador"}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2 pb-2">
                    <span className="text-[12px] text-muted-foreground">Paso actual</span>
                    <span className="text-[12px] font-medium text-foreground" data-testid="text-sequence-step">
                      {lead.sequenceStep} de {currentSequence.steps.length}
                    </span>
                  </div>
                  {currentSequence.steps.map((step) => (
                    <div key={step.id} className={`flex items-center gap-2 p-2 rounded-md text-[12px] ${
                      step.order === lead.sequenceStep
                        ? "bg-primary/10 text-primary font-medium"
                        : step.order < (lead.sequenceStep || 0)
                        ? "text-muted-foreground"
                        : "text-muted-foreground/60"
                    }`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${
                        step.order === lead.sequenceStep
                          ? "bg-primary text-primary-foreground"
                          : step.order < (lead.sequenceStep || 0)
                          ? "bg-muted text-muted-foreground"
                          : "bg-muted/50 text-muted-foreground/60"
                      }`}>
                        {step.order}
                      </div>
                      <span className="truncate">
                        {step.type === "email" ? "Email inicial" : step.type === "follow_up" ? "Follow-up" : "Breakup"}
                        {step.order < (lead.sequenceStep || 0) && " (completado)"}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-border space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] text-muted-foreground flex items-center gap-1.5"><Send className="w-3 h-3" /> Enviados</span>
                    <span className="text-[12px] text-foreground">{currentSequence.totalSent}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] text-muted-foreground flex items-center gap-1.5"><Eye className="w-3 h-3" /> Abiertos</span>
                    <span className="text-[12px] text-foreground">{currentSequence.totalOpened}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] text-muted-foreground flex items-center gap-1.5"><MessageSquare className="w-3 h-3" /> Respondidos</span>
                    <span className="text-[12px] text-foreground">{currentSequence.totalReplied}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[13px] text-muted-foreground" data-testid="text-no-sequence">No inscrito en ninguna secuencia</p>
            )}
          </Card>

          <Card className="p-5" data-testid="section-zoho-sync">
            <h2 className="text-sm font-semibold text-foreground mb-4">Estado de Sincronizacion Zoho</h2>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5">
                {lead.zohoCrmSynced ? (
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
                )}
                <span className="text-[13px] font-medium text-foreground" data-testid="text-zoho-sync-status">
                  {lead.zohoCrmSynced ? "Sincronizado" : "No sincronizado"}
                </span>
              </div>
              {lead.zohoLeadId && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[12px] text-muted-foreground">Zoho Lead ID</span>
                  <span className="text-[12px] font-mono text-foreground" data-testid="text-zoho-lead-id">{lead.zohoLeadId}</span>
                </div>
              )}
              {lead.matchedZohoAccountId && (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] text-muted-foreground">Account ID</span>
                    <span className="text-[12px] font-mono text-foreground" data-testid="text-zoho-account-id">{lead.matchedZohoAccountId}</span>
                  </div>
                  {lead.matchedZohoAccountName && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[12px] text-muted-foreground">Account</span>
                      <span className="text-[12px] text-foreground" data-testid="text-zoho-account-name">{lead.matchedZohoAccountName}</span>
                    </div>
                  )}
                </>
              )}
              {!lead.zohoCrmSynced && !lead.zohoLeadId && !lead.matchedZohoAccountId && (
                <p className="text-[12px] text-muted-foreground">Sin datos de sincronizacion con Zoho CRM</p>
              )}
            </div>
          </Card>

          {lead.sourceUrls.length > 0 && (
            <Card className="p-5" data-testid="section-sources">
              <h2 className="text-sm font-semibold text-foreground mb-4">URLs de Origen</h2>
              <div className="space-y-2">
                {lead.sourceUrls.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[12px] text-primary hover:underline truncate"
                    data-testid={`link-source-url-${i}`}
                  >
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{url}</span>
                  </a>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
