import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Settings,
  Building2,
  Link2,
  Mail,
  Target,
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  Plus,
} from "lucide-react";
import { suppressionList, exclusionRules, searchJobs } from "@/lib/mockData";
import type { SuppressionEntry, ExclusionRule } from "@/lib/mockData";

const zohoFieldMappings = [
  { local: "name", zoho: "Full_Name", synced: true },
  { local: "email", zoho: "Email", synced: true },
  { local: "title", zoho: "Title", synced: true },
  { local: "company", zoho: "Company", synced: true },
  { local: "phone", zoho: "Phone", synced: true },
  { local: "website", zoho: "Website", synced: true },
  { local: "country", zoho: "Mailing_Country", synced: true },
  { local: "city", zoho: "Mailing_City", synced: true },
  { local: "industry", zoho: "Industry", synced: true },
  { local: "score", zoho: "Lead_Score", synced: true },
  { local: "source", zoho: "Lead_Source", synced: false },
  { local: "employeeCount", zoho: "No_of_Employees", synced: false },
];

function GeneralTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold" data-testid="text-general-title">General</h3>
        <p className="text-sm text-muted-foreground">Configuración general del tenant y marca</p>
      </div>
      <Card className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tenant-name">Nombre del Tenant</Label>
            <Input id="tenant-name" defaultValue="Fideltour" data-testid="input-tenant-name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company-name">Nombre de la Empresa</Label>
            <Input id="company-name" defaultValue="Fideltour S.L." data-testid="input-company-name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sender-name">Nombre del Remitente</Label>
            <Input id="sender-name" defaultValue="Equipo Fideltour" data-testid="input-sender-name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sender-email">Email del Remitente</Label>
            <Input id="sender-email" defaultValue="growth@fideltour.com" data-testid="input-sender-email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Zona Horaria</Label>
            <Select defaultValue="europe-madrid">
              <SelectTrigger data-testid="select-timezone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="europe-madrid">Europe/Madrid (CET)</SelectItem>
                <SelectItem value="europe-lisbon">Europe/Lisbon (WET)</SelectItem>
                <SelectItem value="america-mexico">America/Mexico_City (CST)</SelectItem>
                <SelectItem value="america-bogota">America/Bogota (COT)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Idioma</Label>
            <Select defaultValue="es">
              <SelectTrigger data-testid="select-language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="pt">Portugués</SelectItem>
                <SelectItem value="en">Inglés</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="pt-2">
            <Button data-testid="button-save-general">Guardar cambios</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ZohoTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold" data-testid="text-zoho-title">Zoho CRM</h3>
        <p className="text-sm text-muted-foreground">Conexión OAuth y mapeo de campos con Zoho CRM</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-emerald-100 dark:bg-emerald-900/40">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="font-medium" data-testid="text-zoho-status">Conectado</p>
                <p className="text-sm text-muted-foreground">zoho-org-fideltour@fideltour.com</p>
              </div>
            </div>
            <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400" data-testid="badge-zoho-connected">
              OAuth 2.0 Activo
            </Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <p className="text-xs text-muted-foreground">Organización</p>
              <p className="text-sm font-medium" data-testid="text-zoho-org">Fideltour S.L.</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Última sincronización</p>
              <p className="text-sm font-medium" data-testid="text-zoho-last-sync">Hace 2 horas</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Leads sincronizados</p>
              <p className="text-sm font-medium" data-testid="text-zoho-synced-count">5</p>
            </div>
          </div>
          <div className="flex gap-2 pt-2 flex-wrap">
            <Button variant="outline" data-testid="button-zoho-reconnect">Reconectar</Button>
            <Button variant="outline" data-testid="button-zoho-test">Probar conexión</Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h4 className="font-medium mb-4">Mapeo de Campos</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campo Local</TableHead>
              <TableHead>Campo Zoho</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {zohoFieldMappings.map((m, i) => (
              <TableRow key={i} data-testid={`row-field-mapping-${i}`}>
                <TableCell className="font-mono text-sm">{m.local}</TableCell>
                <TableCell className="font-mono text-sm">{m.zoho}</TableCell>
                <TableCell>
                  {m.synced ? (
                    <Badge variant="secondary" className="text-emerald-600 dark:text-emerald-400">Activo</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-muted-foreground">Inactivo</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function SmtpTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold" data-testid="text-smtp-title">Configuración SMTP</h3>
        <p className="text-sm text-muted-foreground">Servidor de correo para envío de secuencias</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-emerald-100 dark:bg-emerald-900/40">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="font-medium" data-testid="text-smtp-status">SMTP Configurado</p>
              <p className="text-sm text-muted-foreground">Conexión verificada correctamente</p>
            </div>
          </div>
          <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400" data-testid="badge-smtp-active">
            Activo
          </Badge>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtp-host">Servidor SMTP</Label>
              <Input id="smtp-host" defaultValue="smtp.gmail.com" data-testid="input-smtp-host" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-port">Puerto</Label>
              <Input id="smtp-port" defaultValue="587" data-testid="input-smtp-port" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtp-user">Usuario</Label>
              <Input id="smtp-user" defaultValue="growth@fideltour.com" data-testid="input-smtp-user" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-pass">Contraseña</Label>
              <Input id="smtp-pass" type="password" defaultValue="••••••••••" data-testid="input-smtp-pass" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtp-encryption">Cifrado</Label>
            <Select defaultValue="tls">
              <SelectTrigger data-testid="select-smtp-encryption">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tls">STARTTLS</SelectItem>
                <SelectItem value="ssl">SSL/TLS</SelectItem>
                <SelectItem value="none">Sin cifrado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="daily-limit">Límite diario de envíos</Label>
              <Input id="daily-limit" type="number" defaultValue="200" data-testid="input-smtp-daily-limit" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hourly-limit">Límite por hora</Label>
              <Input id="hourly-limit" type="number" defaultValue="30" data-testid="input-smtp-hourly-limit" />
            </div>
          </div>
          <div className="flex gap-2 pt-2 flex-wrap">
            <Button data-testid="button-save-smtp">Guardar SMTP</Button>
            <Button variant="outline" data-testid="button-test-smtp">Enviar email de prueba</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ScoringTab() {
  const [icpWeight, setIcpWeight] = useState([40]);
  const [completenessWeight, setCompletenessWeight] = useState([30]);
  const [signalWeight, setSignalWeight] = useState([30]);
  const [minScore, setMinScore] = useState([60]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold" data-testid="text-scoring-title">Scoring</h3>
        <p className="text-sm text-muted-foreground">Pesos del ICP, umbrales de cualificación y criterios de puntuación</p>
      </div>

      <Card className="p-6">
        <h4 className="font-medium mb-4">Pesos del Score Compuesto</h4>
        <p className="text-sm text-muted-foreground mb-6">
          El score final es una media ponderada de ICP, completitud y señales. Los pesos deben sumar 100%.
        </p>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <Label>ICP Score</Label>
              <span className="text-sm font-medium" data-testid="text-icp-weight">{icpWeight[0]}%</span>
            </div>
            <Slider value={icpWeight} onValueChange={setIcpWeight} max={100} step={5} data-testid="slider-icp-weight" />
            <p className="text-xs text-muted-foreground">Coincidencia con el perfil de cliente ideal (industria, tamaño, geografía)</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <Label>Completeness Score</Label>
              <span className="text-sm font-medium" data-testid="text-completeness-weight">{completenessWeight[0]}%</span>
            </div>
            <Slider value={completenessWeight} onValueChange={setCompletenessWeight} max={100} step={5} data-testid="slider-completeness-weight" />
            <p className="text-xs text-muted-foreground">Nivel de completitud de datos del contacto (email, teléfono, LinkedIn, etc.)</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <Label>Signal Score</Label>
              <span className="text-sm font-medium" data-testid="text-signal-weight">{signalWeight[0]}%</span>
            </div>
            <Slider value={signalWeight} onValueChange={setSignalWeight} max={100} step={5} data-testid="slider-signal-weight" />
            <p className="text-xs text-muted-foreground">Señales de intención e interacción (visitas web, aperturas, etc.)</p>
          </div>
          <div className="text-sm text-muted-foreground">
            Total: <span className={icpWeight[0] + completenessWeight[0] + signalWeight[0] === 100 ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-red-500 font-medium"}>
              {icpWeight[0] + completenessWeight[0] + signalWeight[0]}%
            </span>
            {icpWeight[0] + completenessWeight[0] + signalWeight[0] !== 100 && " (debe ser 100%)"}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h4 className="font-medium mb-4">Umbrales de Cualificación</h4>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <Label>Score mínimo para cualificación</Label>
              <span className="text-sm font-medium" data-testid="text-min-score">{minScore[0]}</span>
            </div>
            <Slider value={minScore} onValueChange={setMinScore} max={100} step={5} data-testid="slider-min-score" />
            <p className="text-xs text-muted-foreground">Leads con score inferior serán descartados automáticamente</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h4 className="font-medium mb-4">Criterios ICP</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Criterio</TableHead>
              <TableHead>Valor Ideal</TableHead>
              <TableHead>Puntos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { criterion: "Industria", ideal: "Hospitality, Resorts", points: "25" },
              { criterion: "Tamaño empresa", ideal: "50 - 500 empleados", points: "20" },
              { criterion: "Geografía", ideal: "España, México, Colombia, Portugal, Perú", points: "20" },
              { criterion: "Rol del contacto", ideal: "Director General, CEO, CMO, Revenue Manager", points: "20" },
              { criterion: "Dominio corporativo", ideal: "Email con dominio propio", points: "10" },
              { criterion: "Presencia online", ideal: "Web activa + redes sociales", points: "5" },
            ].map((row, i) => (
              <TableRow key={i} data-testid={`row-icp-criteria-${i}`}>
                <TableCell className="font-medium">{row.criterion}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{row.ideal}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{row.points} pts</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div>
        <Button data-testid="button-save-scoring">Guardar configuración de scoring</Button>
      </div>
    </div>
  );
}

function ExclusionTab() {
  const [rules, setRules] = useState<ExclusionRule[]>(exclusionRules);
  const [entries] = useState<SuppressionEntry[]>(suppressionList);

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold" data-testid="text-exclusion-title">Exclusión</h3>
        <p className="text-sm text-muted-foreground">Reglas de exclusión y lista de supresión</p>
      </div>

      <Card className="p-6">
        <h4 className="font-medium mb-4">Reglas de Exclusión</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Cada lead pasa por estas verificaciones antes de ser elegible para secuencias.
        </p>
        <div className="space-y-3">
          {rules.map((rule) => (
            <div key={rule.id} className="flex items-center justify-between gap-4 py-3 border-b last:border-0" data-testid={`row-exclusion-rule-${rule.id}`}>
              <div className="flex items-center gap-3 min-w-0 flex-wrap">
                {rule.enabled ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium">{rule.name}</p>
                  <p className="text-xs text-muted-foreground">{rule.description}</p>
                </div>
              </div>
              <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} data-testid={`switch-rule-${rule.id}`} />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
          <div>
            <h4 className="font-medium">Lista de Supresión</h4>
            <p className="text-sm text-muted-foreground">{entries.length} entradas</p>
          </div>
          <Button variant="outline" size="sm" data-testid="button-add-suppression">
            <Plus className="w-4 h-4 mr-1" />
            Añadir
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Razón</TableHead>
              <TableHead>Fuente</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id} data-testid={`row-suppression-${entry.id}`}>
                <TableCell>
                  <Badge variant="secondary">
                    {entry.type === "email" ? "Email" : "Dominio"}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">{entry.value}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{entry.reason}</TableCell>
                <TableCell>
                  <Badge variant="outline">{entry.source}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(entry.addedAt).toLocaleDateString("es-ES")}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" data-testid={`button-delete-suppression-${entry.id}`}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function DiscoveryTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold" data-testid="text-discovery-title">Discovery</h3>
        <p className="text-sm text-muted-foreground">Criterios por defecto, fuentes y límites de velocidad</p>
      </div>

      <Card className="p-6">
        <h4 className="font-medium mb-4">Criterios por Defecto</h4>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Geografías objetivo</Label>
            <Input defaultValue="España, México, Colombia, Portugal, Perú" data-testid="input-default-geos" />
            <p className="text-xs text-muted-foreground">Separadas por comas</p>
          </div>
          <div className="space-y-2">
            <Label>Industrias objetivo</Label>
            <Input defaultValue="Hospitality, Hotels, Resorts, All-Inclusive" data-testid="input-default-industries" />
          </div>
          <div className="space-y-2">
            <Label>Roles objetivo</Label>
            <Input defaultValue="Director General, CEO, CMO, Revenue Manager, Director Comercial, Director de Ventas" data-testid="input-default-roles" />
          </div>
          <div className="space-y-2">
            <Label>Palabras clave por defecto</Label>
            <Input defaultValue="hotel, resort, boutique hotel, cadena hotelera" data-testid="input-default-keywords" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h4 className="font-medium mb-4">Fuentes de Datos</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fuente</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Leads Descubiertos</TableHead>
              <TableHead>Jobs Activos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { name: "Google Search", enabled: true, leads: 218, jobs: 3 },
              { name: "Booking.com", enabled: true, leads: 52, jobs: 1 },
              { name: "TripAdvisor", enabled: true, leads: 34, jobs: 1 },
              { name: "Directorios sectoriales", enabled: true, leads: 67, jobs: 2 },
              { name: "Turismo de Portugal", enabled: true, leads: 45, jobs: 1 },
              { name: "LinkedIn Sales Navigator", enabled: false, leads: 0, jobs: 0 },
            ].map((source, i) => (
              <TableRow key={i} data-testid={`row-source-${i}`}>
                <TableCell className="font-medium">{source.name}</TableCell>
                <TableCell>
                  {source.enabled ? (
                    <Badge variant="secondary" className="text-emerald-600 dark:text-emerald-400">Activa</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-muted-foreground">Inactiva</Badge>
                  )}
                </TableCell>
                <TableCell>{source.leads}</TableCell>
                <TableCell>{source.jobs}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Card className="p-6">
        <h4 className="font-medium mb-4">Límites de Velocidad</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="global-daily">Límite diario global</Label>
              <Input id="global-daily" type="number" defaultValue="100" data-testid="input-global-daily-limit" />
              <p className="text-xs text-muted-foreground">Máximo de leads a descubrir por día entre todos los jobs</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="per-job-daily">Límite diario por job</Label>
              <Input id="per-job-daily" type="number" defaultValue="50" data-testid="input-per-job-daily-limit" />
              <p className="text-xs text-muted-foreground">Máximo de leads por job individual al día</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="request-delay">Delay entre peticiones (ms)</Label>
              <Input id="request-delay" type="number" defaultValue="2000" data-testid="input-request-delay" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="concurrent">Peticiones concurrentes</Label>
              <Input id="concurrent" type="number" defaultValue="3" data-testid="input-concurrent-requests" />
            </div>
          </div>
          <div className="pt-2">
            <Button data-testid="button-save-discovery">Guardar configuración de discovery</Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h4 className="font-medium mb-4">Jobs Activos</h4>
        <p className="text-sm text-muted-foreground mb-4">
          {searchJobs.filter(j => j.status === "active").length} jobs activos de {searchJobs.length} totales
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Descubiertos</TableHead>
              <TableHead>Límite/día</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {searchJobs.map((job) => (
              <TableRow key={job.id} data-testid={`row-job-${job.id}`}>
                <TableCell className="font-medium">{job.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={
                    job.status === "active" ? "text-emerald-600 dark:text-emerald-400" :
                    job.status === "paused" ? "text-amber-600 dark:text-amber-400" :
                    "text-muted-foreground"
                  }>
                    {job.status === "active" ? "Activo" :
                     job.status === "paused" ? "Pausado" :
                     job.status === "completed" ? "Completado" : "Borrador"}
                  </Badge>
                </TableCell>
                <TableCell>{job.totalDiscovered}</TableCell>
                <TableCell>{job.dailyLimit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <Settings className="w-5 h-5 text-muted-foreground" />
          <h1 className="text-2xl font-bold" data-testid="text-settings-heading">Configuración</h1>
        </div>
        <p className="text-sm text-muted-foreground" data-testid="text-settings-description">
          Gestiona la configuración del tenant, integraciones y reglas de negocio
        </p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-6 flex-wrap">
          <TabsTrigger value="general" data-testid="tab-general">
            <Building2 className="w-4 h-4 mr-1.5" />
            General
          </TabsTrigger>
          <TabsTrigger value="zoho" data-testid="tab-zoho">
            <Link2 className="w-4 h-4 mr-1.5" />
            Zoho CRM
          </TabsTrigger>
          <TabsTrigger value="smtp" data-testid="tab-smtp">
            <Mail className="w-4 h-4 mr-1.5" />
            SMTP
          </TabsTrigger>
          <TabsTrigger value="scoring" data-testid="tab-scoring">
            <Target className="w-4 h-4 mr-1.5" />
            Scoring
          </TabsTrigger>
          <TabsTrigger value="exclusion" data-testid="tab-exclusion">
            <ShieldCheck className="w-4 h-4 mr-1.5" />
            Exclusión
          </TabsTrigger>
          <TabsTrigger value="discovery" data-testid="tab-discovery">
            <Search className="w-4 h-4 mr-1.5" />
            Discovery
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general"><GeneralTab /></TabsContent>
        <TabsContent value="zoho"><ZohoTab /></TabsContent>
        <TabsContent value="smtp"><SmtpTab /></TabsContent>
        <TabsContent value="scoring"><ScoringTab /></TabsContent>
        <TabsContent value="exclusion"><ExclusionTab /></TabsContent>
        <TabsContent value="discovery"><DiscoveryTab /></TabsContent>
      </Tabs>
    </div>
  );
}