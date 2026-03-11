"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Plug, RefreshCw, CheckCircle2, XCircle, Clock, ArrowRightLeft, AlertTriangle, ExternalLink, ChevronRight, Building2 } from "lucide-react";
import { SiZoho } from "react-icons/si";

interface SyncLogEntry {
  id: string;
  type: "contact_synced" | "contact_updated" | "error" | "field_mapped" | "webhook_sent";
  description: string;
  timestamp: string;
  status: "success" | "error" | "warning";
}

interface FieldMapping {
  fideltourField: string;
  zohoField: string;
  direction: "bidirectional" | "to_zoho" | "from_zoho";
  enabled: boolean;
}

const syncLog: SyncLogEntry[] = [
  { id: "sl-001", type: "contact_synced", description: "Carlos Mart\u00ednez sincronizado como Lead (ZL-4829103)", timestamp: "2026-02-23T11:00:00Z", status: "success" },
  { id: "sl-002", type: "contact_synced", description: "Isabel Torres sincronizada como Lead (ZL-4829205)", timestamp: "2026-02-23T10:45:00Z", status: "success" },
  { id: "sl-003", type: "contact_updated", description: "Pablo Mart\u00edn - campos actualizados en Zoho (ZL-4829310)", timestamp: "2026-02-22T11:00:00Z", status: "success" },
  { id: "sl-004", type: "error", description: "Error al sincronizar Diego Vargas - campo 'industry' no mapeado", timestamp: "2026-02-22T09:30:00Z", status: "error" },
  { id: "sl-005", type: "contact_synced", description: "Patricia Navarro sincronizada como Lead", timestamp: "2026-02-21T14:00:00Z", status: "success" },
  { id: "sl-006", type: "field_mapped", description: "Campo 'score' mapeado a 'Lead_Score' en Zoho", timestamp: "2026-02-20T10:00:00Z", status: "success" },
  { id: "sl-007", type: "error", description: "Timeout en conexi\u00f3n con Zoho API - reintentando", timestamp: "2026-02-20T08:15:00Z", status: "warning" },
  { id: "sl-008", type: "contact_synced", description: "Mar\u00eda Garc\u00eda Hern\u00e1ndez sincronizada como Lead", timestamp: "2026-02-19T16:00:00Z", status: "success" },
  { id: "sl-009", type: "webhook_sent", description: "Webhook enviado a Zapier - nuevo lead cualificado", timestamp: "2026-02-19T14:30:00Z", status: "success" },
  { id: "sl-010", type: "contact_synced", description: "Roberto Silva Mej\u00eda sincronizado como Lead", timestamp: "2026-02-19T12:00:00Z", status: "success" },
];

const fieldMappings: FieldMapping[] = [
  { fideltourField: "Nombre", zohoField: "First_Name + Last_Name", direction: "to_zoho", enabled: true },
  { fideltourField: "Email", zohoField: "Email", direction: "bidirectional", enabled: true },
  { fideltourField: "Tel\u00e9fono", zohoField: "Phone", direction: "to_zoho", enabled: true },
  { fideltourField: "Empresa", zohoField: "Company", direction: "to_zoho", enabled: true },
  { fideltourField: "Cargo", zohoField: "Designation", direction: "to_zoho", enabled: true },
  { fideltourField: "Pa\u00eds", zohoField: "Country", direction: "to_zoho", enabled: true },
  { fideltourField: "Ciudad", zohoField: "City", direction: "to_zoho", enabled: true },
  { fideltourField: "Score", zohoField: "Lead_Score", direction: "to_zoho", enabled: true },
  { fideltourField: "Estado", zohoField: "Lead_Status", direction: "bidirectional", enabled: true },
  { fideltourField: "Industria", zohoField: "Industry", direction: "to_zoho", enabled: false },
  { fideltourField: "Website", zohoField: "Website", direction: "to_zoho", enabled: true },
  { fideltourField: "Fuente", zohoField: "Lead_Source", direction: "to_zoho", enabled: true },
];

function formatTimestamp(ts: string): string {
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffH < 1) return "Hace menos de 1h";
  if (diffH < 24) return `Hace ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return "Ayer";
  if (diffD < 7) return `Hace ${diffD} d\u00edas`;
  return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

function formatDateTime(ts: string): string {
  const d = new Date(ts);
  return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function DirectionBadge({ direction }: { direction: FieldMapping["direction"] }) {
  if (direction === "bidirectional") {
    return <Badge variant="secondary" data-testid="badge-direction-bidirectional"><ArrowRightLeft className="w-3 h-3 mr-1" />Bidireccional</Badge>;
  }
  if (direction === "to_zoho") {
    return <Badge variant="outline" data-testid="badge-direction-to-zoho"><ChevronRight className="w-3 h-3 mr-1" />A Zoho</Badge>;
  }
  return <Badge variant="outline" data-testid="badge-direction-from-zoho"><ChevronRight className="w-3 h-3 mr-1 rotate-180" />Desde Zoho</Badge>;
}

function SyncStatusIcon({ status }: { status: SyncLogEntry["status"] }) {
  if (status === "success") return <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" />;
  if (status === "error") return <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />;
  return <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />;
}

export default function Integrations() {
  const [zohoConnected] = useState(true);
  const [showAllLogs, setShowAllLogs] = useState(false);
  const [mappings, setMappings] = useState(fieldMappings);

  const displayedLogs = showAllLogs ? syncLog : syncLog.slice(0, 6);

  const toggleMapping = (index: number) => {
    setMappings(prev => prev.map((m, i) => i === index ? { ...m, enabled: !m.enabled } : m));
  };

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">Integraciones</h1>
          <p className="text-muted-foreground mt-1" data-testid="text-page-description">Conecta tus herramientas y sincroniza datos autom\u00e1ticamente</p>
        </div>

        <Card data-testid="card-zoho-integration">
          <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-red-100 dark:bg-red-900/30">
                <SiZoho className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <CardTitle className="text-lg">Zoho CRM</CardTitle>
                <CardDescription>Sincroniza leads y contactos con tu CRM</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {zohoConnected ? (
                <>
                  <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300" data-testid="badge-zoho-status">
                    <CheckCircle2 className="w-3 h-3 mr-1" />Conectado
                  </Badge>
                  <Button variant="outline" size="sm" data-testid="button-zoho-disconnect">Desconectar</Button>
                </>
              ) : (
                <Button data-testid="button-zoho-connect">Conectar</Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Leads sincronizados</p>
                <p className="text-2xl font-semibold" data-testid="text-zoho-synced-count">4</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">\u00daltima sincronizaci\u00f3n</p>
                <p className="text-sm font-medium" data-testid="text-zoho-last-sync">23 Feb, 11:00</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Errores recientes</p>
                <p className="text-2xl font-semibold text-amber-600 dark:text-amber-400" data-testid="text-zoho-errors">1</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Frecuencia</p>
                <p className="text-sm font-medium" data-testid="text-zoho-frequency">Cada 30 min</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" size="sm" data-testid="button-zoho-sync-now">
                <RefreshCw className="w-4 h-4 mr-1" />Sincronizar ahora
              </Button>
              <Button variant="ghost" size="sm" data-testid="button-zoho-settings">
                <ExternalLink className="w-4 h-4 mr-1" />Abrir Zoho CRM
              </Button>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-3">Mapeo de campos</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-[1fr_auto_1fr_auto] gap-3 items-center px-3 py-2 text-xs text-muted-foreground font-medium">
                  <span>Fideltour</span>
                  <span></span>
                  <span>Zoho CRM</span>
                  <span>Activo</span>
                </div>
                {mappings.map((mapping, index) => (
                  <div
                    key={mapping.fideltourField}
                    className="grid grid-cols-[1fr_auto_1fr_auto] gap-3 items-center px-3 py-2 rounded-md bg-muted/40"
                    data-testid={`row-field-mapping-${index}`}
                  >
                    <span className="text-sm">{mapping.fideltourField}</span>
                    <DirectionBadge direction={mapping.direction} />
                    <span className="text-sm text-muted-foreground">{mapping.zohoField}</span>
                    <Switch
                      checked={mapping.enabled}
                      onCheckedChange={() => toggleMapping(index)}
                      data-testid={`switch-mapping-${index}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                <h3 className="font-medium">Historial de sincronizaci\u00f3n</h3>
                {!showAllLogs && syncLog.length > 6 && (
                  <Button variant="ghost" size="sm" onClick={() => setShowAllLogs(true)} data-testid="button-show-all-logs">
                    Ver todo
                  </Button>
                )}
              </div>
              <div className="space-y-1">
                {displayedLogs.map(entry => (
                  <div key={entry.id} className="flex items-start gap-3 px-3 py-2 rounded-md hover-elevate" data-testid={`row-sync-log-${entry.id}`}>
                    <SyncStatusIcon status={entry.status} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{entry.description}</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(entry.timestamp)}</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{formatTimestamp(entry.timestamp)}</span>
                  </div>
                ))}
              </div>
              {showAllLogs && syncLog.length > 6 && (
                <Button variant="ghost" size="sm" onClick={() => setShowAllLogs(false)} className="mt-2" data-testid="button-show-less-logs">
                  Ver menos
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card data-testid="card-zapier-integration">
            <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-md bg-orange-100 dark:bg-orange-900/30">
                  <Plug className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <CardTitle className="text-base">Zapier</CardTitle>
                  <CardDescription>Automatiza workflows con 5000+ apps</CardDescription>
                </div>
              </div>
              <Badge variant="outline" data-testid="badge-zapier-status">
                <Clock className="w-3 h-3 mr-1" />Pr\u00f3ximamente
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Conecta Fideltour con tu stack de herramientas mediante Zapier. Crea triggers cuando se descubran nuevos leads, se completen enriquecimientos o se reciban respuestas.
              </p>
              <Button variant="outline" size="sm" disabled data-testid="button-zapier-connect">Configurar</Button>
            </CardContent>
          </Card>

          <Card data-testid="card-webhooks-integration">
            <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-md bg-violet-100 dark:bg-violet-900/30">
                  <ArrowRightLeft className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <CardTitle className="text-base">Webhooks</CardTitle>
                  <CardDescription>Env\u00eda eventos a tus endpoints</CardDescription>
                </div>
              </div>
              <Badge variant="outline" data-testid="badge-webhooks-status">
                <Clock className="w-3 h-3 mr-1" />Pr\u00f3ximamente
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Configura webhooks personalizados para recibir notificaciones en tiempo real sobre eventos del sistema: nuevos leads, cambios de estado, respuestas de email.
              </p>
              <Button variant="outline" size="sm" disabled data-testid="button-webhooks-configure">Configurar</Button>
            </CardContent>
          </Card>

          <Card data-testid="card-pms-integration">
            <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-md bg-sky-100 dark:bg-sky-900/30">
                  <Building2 className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                </div>
                <div>
                  <CardTitle className="text-base">PMS</CardTitle>
                  <CardDescription>Conecta tu sistema de gestión hotelera</CardDescription>
                </div>
              </div>
              <Badge variant="outline" data-testid="badge-pms-status">
                <Clock className="w-3 h-3 mr-1" />Próximamente
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Integra tu Property Management System para sincronizar datos de reservas, huéspedes y disponibilidad directamente con Fideltour.
              </p>
              <Button variant="outline" size="sm" disabled data-testid="button-pms-configure">Configurar</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}