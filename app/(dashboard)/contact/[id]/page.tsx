"use client";

import { useRouter, useParams } from "next/navigation";
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
  User,
  Star,
  TrendingUp,
  Target,
  FileText,
  Percent,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LEAD_STATUS_CONFIG, getLeadExclusionChecks } from "@/lib/mockData";
import { useLead, useEnrichmentAttempts, useEventLogs, useCampaigns, useLists, useCompanies } from "@/lib/hooks/useData";

export default function ContactDetail() {
  const params = useParams();
  const router = useRouter();
  const leadId = (params?.id as string) || "";

  const { data: lead, isLoading } = useLead(leadId) as { data: any; isLoading: boolean };
  const { data: leadEnrichments = [] } = useEnrichmentAttempts(leadId) as { data: any[] };
  const { data: leadEvents = [] } = useEventLogs(leadId) as { data: any[] };
  const { data: campaigns = [] } = useCampaigns() as { data: any[] };
  const { data: prospectLists = [] } = useLists() as { data: any[] };
  const { data: companiesData = [] } = useCompanies() as { data: any[] };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Cargando contacto...</p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-8 text-center" data-testid="text-contact-not-found">
        <h2 className="text-lg font-semibold text-foreground">Contacto no encontrado</h2>
        <Button variant="ghost" className="mt-4" onClick={() => router.push("/contacts")} data-testid="button-back-contacts">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Contactos
        </Button>
      </div>
    );
  }

  const sortedEvents = [...leadEvents].sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const exclusionChecks = getLeadExclusionChecks(lead);
  const enrolledCampaign = campaigns.find((c: any) => c.id === lead.sequenceId);
  const leadLists = prospectLists.filter((l: any) => l.contactIds?.includes(lead.id));
  const company = companiesData.find((c: any) => c.contactIds?.includes(lead.id));

  const statusConfig = LEAD_STATUS_CONFIG[lead.status as keyof typeof LEAD_STATUS_CONFIG];

  const getEventIcon = (type: string) => {
    switch (type) {
      case "discovered": return <Globe className="w-3.5 h-3.5 text-slate-500" />;
      case "qualified": return <Target className="w-3.5 h-3.5 text-blue-500" />;
      case "enriched": return <Zap className="w-3.5 h-3.5 text-violet-500" />;
      case "excluded": return <XCircle className="w-3.5 h-3.5 text-red-500" />;
      case "enrolled": return <Send className="w-3.5 h-3.5 text-teal-500" />;
      case "email_sent": return <Mail className="w-3.5 h-3.5 text-blue-500" />;
      case "email_opened": return <Eye className="w-3.5 h-3.5 text-green-500" />;
      case "email_replied": return <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />;
      case "email_bounced": return <AlertTriangle className="w-3.5 h-3.5 text-red-500" />;
      case "synced": return <RefreshCw className="w-3.5 h-3.5 text-green-500" />;
      default: return <Clock className="w-3.5 h-3.5 text-gray-500" />;
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto" data-testid="contact-detail-page">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.push("/contacts")} data-testid="button-back">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-foreground" data-testid="text-contact-name">{lead.name}</h1>
            <Badge className={`${statusConfig.bgClass} ${statusConfig.textClass} border-0 text-xs`} data-testid="badge-status">
              {statusConfig.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{lead.title} · {lead.company}</p>
        </div>
        <div className="flex gap-2">
          {!lead.zohoCrmSynced && (
            <Button size="sm" data-testid="button-sync-zoho">
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Sincronizar con Zoho
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Información de contacto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground" data-testid="text-email">{lead.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground" data-testid="text-phone">{lead.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground" data-testid="text-company">{lead.company}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" data-testid="link-website">
                    {lead.domain}
                    <ExternalLink className="w-3 h-3 inline ml-1" />
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground" data-testid="text-location">{lead.city}, {lead.country}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{lead.employeeCount} empleados</span>
                </div>
              </div>

              {leadLists.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Listas</p>
                  <div className="flex flex-wrap gap-1.5">
                    {leadLists.map((list) => (
                      <Badge key={list.id} variant="secondary" className="text-xs" data-testid={`badge-list-${list.id}`}>
                        {list.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {company && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Empresa</p>
                  <p className="text-sm text-foreground">{company.name} · {company.industry} · {company.employees} empleados</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Enriquecimiento Waterfall</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leadEnrichments.map((attempt) => (
                  <div key={attempt.id} className="flex items-center justify-between py-2 border-b border-border last:border-0" data-testid={`enrichment-${attempt.id}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${attempt.status === "success" ? "bg-green-500" : attempt.status === "partial" ? "bg-amber-500" : attempt.status === "failed" ? "bg-red-500" : "bg-gray-400"}`} />
                      <div>
                        <p className="text-sm font-medium text-foreground">{attempt.provider}</p>
                        <p className="text-xs text-muted-foreground">{attempt.fieldsFound.join(", ")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="text-xs">
                        {Math.round(attempt.confidence * 100)}%
                      </Badge>
                      <span className="text-xs text-muted-foreground">{formatDate(attempt.timestamp)}</span>
                    </div>
                  </div>
                ))}
                {leadEnrichments.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">Sin intentos de enriquecimiento</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Verificaciones de exclusión
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {exclusionChecks.map((check: ExclusionCheckResult, i: number) => (
                  <div key={i} className="flex items-center justify-between py-1.5" data-testid={`exclusion-check-${i}`}>
                    <div className="flex items-center gap-2">
                      {check.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm text-foreground">{check.rule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{check.source}</Badge>
                      {check.reason && <span className="text-xs text-red-500">{check.reason}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {enrolledCampaign && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Campaña activa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-foreground" data-testid="text-campaign-name">{enrolledCampaign.name}</p>
                  <Badge variant="secondary" className="text-xs">
                    Paso {lead.sequenceStep || 1} de {enrolledCampaign.steps.filter(s => s.type !== "wait" && s.type !== "condition").length}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {enrolledCampaign.steps.filter(s => s.type !== "wait" && s.type !== "condition").map((step, i) => (
                    <div key={step.id} className={`flex items-center gap-3 p-2 rounded-lg ${i + 1 <= (lead.sequenceStep || 0) ? "bg-muted/50" : ""}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${i + 1 <= (lead.sequenceStep || 0) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{step.subject || `Paso ${step.order}`}</p>
                        <p className="text-xs text-muted-foreground capitalize">{step.type === "follow_up" ? "Seguimiento" : step.type === "breakup" ? "Cierre" : "Email"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Puntuación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
                  <span className="text-2xl font-bold text-primary" data-testid="text-score">{lead.score}</span>
                </div>
                <p className="text-xs text-muted-foreground">Puntuación total</p>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">ICP Fit</span>
                    <span className="font-medium text-foreground">{lead.icpScore}/100</span>
                  </div>
                  <Progress value={lead.icpScore} className="h-1.5" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Completitud</span>
                    <span className="font-medium text-foreground">{lead.completenessScore}/100</span>
                  </div>
                  <Progress value={lead.completenessScore} className="h-1.5" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Señales</span>
                    <span className="font-medium text-foreground">{lead.signalScore}/100</span>
                  </div>
                  <Progress value={lead.signalScore} className="h-1.5" />
                </div>
              </div>
            </CardContent>
          </Card>

          {lead.zohoCrmSynced && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Zoho CRM</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-foreground">Sincronizado</span>
                  </div>
                  {lead.zohoLeadId && (
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">ID:</span>
                      <span className="text-foreground font-mono text-xs" data-testid="text-zoho-id">{lead.zohoLeadId}</span>
                    </div>
                  )}
                  {lead.matchedZohoAccountName && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground" data-testid="text-zoho-account">{lead.matchedZohoAccountName}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Confianza enriquecimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-3">
                <span className={`text-2xl font-bold ${lead.enrichmentConfidence >= 0.8 ? "text-green-500" : lead.enrichmentConfidence >= 0.5 ? "text-amber-500" : "text-red-500"}`} data-testid="text-enrichment-confidence">
                  {Math.round(lead.enrichmentConfidence * 100)}%
                </span>
              </div>
              <Progress value={lead.enrichmentConfidence * 100} className="h-2" />
              {lead.lastEnrichedAt && (
                <p className="text-xs text-muted-foreground mt-2">Último enriquecimiento: {formatDate(lead.lastEnrichedAt)}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Línea temporal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {sortedEvents.slice(0, 15).map((event: any) => (
                  <div key={event.id} className="flex gap-3" data-testid={`event-${event.id}`}>
                    <div className="mt-0.5">{getEventIcon(event.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground">{event.description}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{formatDate(event.timestamp)}</p>
                    </div>
                  </div>
                ))}
                {sortedEvents.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">Sin eventos registrados</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
