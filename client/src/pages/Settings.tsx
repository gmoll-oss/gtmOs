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
  Building2,
  Link2,
  Mail,
  Target,
  ShieldCheck,
  Search,
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
    <div className="space-y-5">
      <Card className="p-5">
        <h4 className="text-sm font-semibold mb-4" data-testid="text-general-title">Configuraci&oacute;n General</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="tenant-name" className="text-xs text-muted-foreground">Nombre del Tenant</Label>
              <Input id="tenant-name" defaultValue="Fideltour" className="rounded-lg" data-testid="input-tenant-name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="company-name" className="text-xs text-muted-foreground">Nombre de la Empresa</Label>
              <Input id="company-name" defaultValue="Fideltour S.L." className="rounded-lg" data-testid="input-company-name" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="sender-name" className="text-xs text-muted-foreground">Nombre del Remitente</Label>
              <Input id="sender-name" defaultValue="Equipo Fideltour" className="rounded-lg" data-testid="input-sender-name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sender-email" className="text-xs text-muted-foreground">Email del Remitente</Label>
              <Input id="sender-email" defaultValue="growth@fideltour.com" className="rounded-lg" data-testid="input-sender-email" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="timezone" className="text-xs text-muted-foreground">Zona Horaria</Label>
              <Select defaultValue="europe-madrid">
                <SelectTrigger className="rounded-lg" data-testid="select-timezone">
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
            <div className="space-y-1.5">
              <Label htmlFor="language" className="text-xs text-muted-foreground">Idioma</Label>
              <Select defaultValue="es">
                <SelectTrigger className="rounded-lg" data-testid="select-language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Espa&ntilde;ol</SelectItem>
                  <SelectItem value="pt">Portugu&eacute;s</SelectItem>
                  <SelectItem value="en">Ingl&eacute;s</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="pt-1">
            <Button size="sm" data-testid="button-save-general">Guardar cambios</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ZohoTab() {
  return (
    <div className="space-y-5">
      <Card className="p-5">
        <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center justify-center w-2 h-2 rounded-full bg-emerald-500" />
            <div>
              <p className="text-sm font-medium" data-testid="text-zoho-status">Conectado</p>
              <p className="text-xs text-muted-foreground">zoho-org-fideltour@fideltour.com</p>
            </div>
          </div>
          <Badge variant="secondary" className="rounded-full text-xs text-emerald-600 dark:text-emerald-400" data-testid="badge-zoho-connected">
            OAuth 2.0 Activo
          </Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Organizaci&oacute;n</p>
            <p className="text-sm font-medium mt-0.5" data-testid="text-zoho-org">Fideltour S.L.</p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wide">&Uacute;ltima sincronizaci&oacute;n</p>
            <p className="text-sm font-medium mt-0.5" data-testid="text-zoho-last-sync">Hace 2 horas</p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Leads sincronizados</p>
            <p className="text-sm font-medium mt-0.5" data-testid="text-zoho-synced-count">5</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" data-testid="button-zoho-reconnect">Reconectar</Button>
          <Button variant="outline" size="sm" data-testid="button-zoho-test">Probar conexi&oacute;n</Button>
        </div>
      </Card>

      <Card className="p-5">
        <h4 className="text-sm font-semibold mb-4">Mapeo de Campos</h4>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="text-[11px] uppercase tracking-wide font-medium">Campo Local</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wide font-medium">Campo Zoho</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wide font-medium">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {zohoFieldMappings.map((m, i) => (
                <TableRow key={i} data-testid={`row-field-mapping-${i}`}>
                  <TableCell className="font-mono text-xs">{m.local}</TableCell>
                  <TableCell className="font-mono text-xs">{m.zoho}</TableCell>
                  <TableCell>
                    {m.synced ? (
                      <Badge variant="secondary" className="rounded-full text-xs text-emerald-600 dark:text-emerald-400">Activo</Badge>
                    ) : (
                      <Badge variant="secondary" className="rounded-full text-xs text-muted-foreground">Inactivo</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

function SmtpTab() {
  return (
    <div className="space-y-5">
      <Card className="p-5">
        <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center justify-center w-2 h-2 rounded-full bg-emerald-500" />
            <div>
              <p className="text-sm font-medium" data-testid="text-smtp-status">SMTP Configurado</p>
              <p className="text-xs text-muted-foreground">Conexi&oacute;n verificada correctamente</p>
            </div>
          </div>
          <Badge variant="secondary" className="rounded-full text-xs text-emerald-600 dark:text-emerald-400" data-testid="badge-smtp-active">
            Activo
          </Badge>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="smtp-host" className="text-xs text-muted-foreground">Servidor SMTP</Label>
              <Input id="smtp-host" defaultValue="smtp.gmail.com" className="rounded-lg" data-testid="input-smtp-host" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="smtp-port" className="text-xs text-muted-foreground">Puerto</Label>
              <Input id="smtp-port" defaultValue="587" className="rounded-lg" data-testid="input-smtp-port" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="smtp-user" className="text-xs text-muted-foreground">Usuario</Label>
              <Input id="smtp-user" defaultValue="growth@fideltour.com" className="rounded-lg" data-testid="input-smtp-user" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="smtp-pass" className="text-xs text-muted-foreground">Contrase&ntilde;a</Label>
              <Input id="smtp-pass" type="password" defaultValue="••••••••••" className="rounded-lg" data-testid="input-smtp-pass" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="smtp-encryption" className="text-xs text-muted-foreground">Cifrado</Label>
            <Select defaultValue="tls">
              <SelectTrigger className="rounded-lg" data-testid="select-smtp-encryption">
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
            <div className="space-y-1.5">
              <Label htmlFor="daily-limit" className="text-xs text-muted-foreground">L&iacute;mite diario de env&iacute;os</Label>
              <Input id="daily-limit" type="number" defaultValue="200" className="rounded-lg" data-testid="input-smtp-daily-limit" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="hourly-limit" className="text-xs text-muted-foreground">L&iacute;mite por hora</Label>
              <Input id="hourly-limit" type="number" defaultValue="30" className="rounded-lg" data-testid="input-smtp-hourly-limit" />
            </div>
          </div>
          <div className="flex gap-2 pt-1 flex-wrap">
            <Button size="sm" data-testid="button-save-smtp">Guardar SMTP</Button>
            <Button variant="outline" size="sm" data-testid="button-test-smtp">Enviar email de prueba</Button>
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
    <div className="space-y-5">
      <Card className="p-5">
        <h4 className="text-sm font-semibold mb-1" data-testid="text-scoring-title">Pesos del Score Compuesto</h4>
        <p className="text-xs text-muted-foreground mb-5">
          El score final es una media ponderada de ICP, completitud y se&ntilde;ales. Los pesos deben sumar 100%.
        </p>
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <Label className="text-xs">ICP Score</Label>
              <span className="text-xs font-semibold" data-testid="text-icp-weight">{icpWeight[0]}%</span>
            </div>
            <Slider value={icpWeight} onValueChange={setIcpWeight} max={100} step={5} data-testid="slider-icp-weight" />
            <p className="text-[11px] text-muted-foreground">Coincidencia con el perfil de cliente ideal (industria, tama&ntilde;o, geograf&iacute;a)</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <Label className="text-xs">Completeness Score</Label>
              <span className="text-xs font-semibold" data-testid="text-completeness-weight">{completenessWeight[0]}%</span>
            </div>
            <Slider value={completenessWeight} onValueChange={setCompletenessWeight} max={100} step={5} data-testid="slider-completeness-weight" />
            <p className="text-[11px] text-muted-foreground">Nivel de completitud de datos del contacto (email, tel&eacute;fono, LinkedIn, etc.)</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <Label className="text-xs">Signal Score</Label>
              <span className="text-xs font-semibold" data-testid="text-signal-weight">{signalWeight[0]}%</span>
            </div>
            <Slider value={signalWeight} onValueChange={setSignalWeight} max={100} step={5} data-testid="slider-signal-weight" />
            <p className="text-[11px] text-muted-foreground">Se&ntilde;ales de intenci&oacute;n e interacci&oacute;n (visitas web, aperturas, etc.)</p>
          </div>
          <div className="text-xs text-muted-foreground">
            Total: <span className={icpWeight[0] + completenessWeight[0] + signalWeight[0] === 100 ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-red-500 font-semibold"}>
              {icpWeight[0] + completenessWeight[0] + signalWeight[0]}%
            </span>
            {icpWeight[0] + completenessWeight[0] + signalWeight[0] !== 100 && " (debe ser 100%)"}
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <h4 className="text-sm font-semibold mb-1">Umbrales de Cualificaci&oacute;n</h4>
        <p className="text-xs text-muted-foreground mb-5">Score m&iacute;nimo requerido para que un lead sea cualificado autom&aacute;ticamente.</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <Label className="text-xs">Score m&iacute;nimo</Label>
            <span className="text-xs font-semibold" data-testid="text-min-score">{minScore[0]}</span>
          </div>
          <Slider value={minScore} onValueChange={setMinScore} max={100} step={5} data-testid="slider-min-score" />
          <p className="text-[11px] text-muted-foreground">Leads con score inferior ser&aacute;n descartados autom&aacute;ticamente</p>
        </div>
      </Card>

      <Card className="p-5">
        <h4 className="text-sm font-semibold mb-4">Criterios ICP</h4>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="text-[11px] uppercase tracking-wide font-medium">Criterio</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wide font-medium">Valor Ideal</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wide font-medium">Puntos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { criterion: "Industria", ideal: "Hospitality, Resorts", points: "25" },
                { criterion: "Tama\u00f1o empresa", ideal: "50 - 500 empleados", points: "20" },
                { criterion: "Geograf\u00eda", ideal: "Espa\u00f1a, M\u00e9xico, Colombia, Portugal, Per\u00fa", points: "20" },
                { criterion: "Rol del contacto", ideal: "Director General, CEO, CMO, Revenue Manager", points: "20" },
                { criterion: "Dominio corporativo", ideal: "Email con dominio propio", points: "10" },
                { criterion: "Presencia online", ideal: "Web activa + redes sociales", points: "5" },
              ].map((row, i) => (
                <TableRow key={i} data-testid={`row-icp-criteria-${i}`}>
                  <TableCell className="text-sm font-medium">{row.criterion}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{row.ideal}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="rounded-full text-xs">{row.points} pts</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <div>
        <Button size="sm" data-testid="button-save-scoring">Guardar configuraci&oacute;n de scoring</Button>
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
    <div className="space-y-5">
      <Card className="p-5">
        <h4 className="text-sm font-semibold mb-1">Reglas de Exclusi&oacute;n</h4>
        <p className="text-xs text-muted-foreground mb-4">
          Cada lead pasa por estas verificaciones antes de ser elegible para secuencias.
        </p>
        <div className="space-y-0">
          {rules.map((rule) => (
            <div key={rule.id} className="flex items-center justify-between gap-4 py-3 border-b last:border-0" data-testid={`row-exclusion-rule-${rule.id}`}>
              <div className="flex items-center gap-3 min-w-0 flex-wrap">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${rule.enabled ? "bg-emerald-500" : "bg-muted-foreground/40"}`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium">{rule.name}</p>
                  <p className="text-[11px] text-muted-foreground">{rule.description}</p>
                </div>
              </div>
              <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} data-testid={`switch-rule-${rule.id}`} />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
          <div>
            <h4 className="text-sm font-semibold">Lista de Supresi&oacute;n</h4>
            <p className="text-xs text-muted-foreground mt-0.5">{entries.length} entradas</p>
          </div>
          <Button variant="outline" size="sm" data-testid="button-add-suppression">
            <Plus className="w-4 h-4 mr-1" />
            A&ntilde;adir
          </Button>
        </div>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="text-[11px] uppercase tracking-wide font-medium">Tipo</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wide font-medium">Valor</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wide font-medium">Raz&oacute;n</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wide font-medium">Fuente</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wide font-medium">Fecha</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id} data-testid={`row-suppression-${entry.id}`}>
                  <TableCell>
                    <Badge variant="secondary" className="rounded-full text-xs">
                      {entry.type === "email" ? "Email" : "Dominio"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{entry.value}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{entry.reason}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="rounded-full text-xs">{entry.source}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
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
        </div>
      </Card>
    </div>
  );
}

function DiscoveryTab() {
  return (
    <div className="space-y-5">
      <Card className="p-5">
        <h4 className="text-sm font-semibold mb-4" data-testid="text-discovery-title">Criterios por Defecto</h4>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Geograf&iacute;as objetivo</Label>
            <Input defaultValue="Espa\u00f1a, M\u00e9xico, Colombia, Portugal, Per\u00fa" className="rounded-lg" data-testid="input-default-geos" />
            <p className="text-[11px] text-muted-foreground">Separadas por comas</p>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Industrias objetivo</Label>
            <Input defaultValue="Hospitality, Hotels, Resorts, All-Inclusive" className="rounded-lg" data-testid="input-default-industries" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Roles objetivo</Label>
            <Input defaultValue="Director General, CEO, CMO, Revenue Manager, Director Comercial, Director de Ventas" className="rounded-lg" data-testid="input-default-roles" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Palabras clave por defecto</Label>
            <Input defaultValue="hotel, resort, boutique hotel, cadena hotelera" className="rounded-lg" data-testid="input-default-keywords" />
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <h4 className="text-sm font-semibold mb-4">Fuentes de Datos</h4>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="text-[11px] uppercase tracking-wide font-medium">Fuente</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wide font-medium">Estado</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wide font-medium">Leads</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wide font-medium">Jobs</TableHead>
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
                  <TableCell className="text-sm font-medium">{source.name}</TableCell>
                  <TableCell>
                    {source.enabled ? (
                      <Badge variant="secondary" className="rounded-full text-xs text-emerald-600 dark:text-emerald-400">Activa</Badge>
                    ) : (
                      <Badge variant="secondary" className="rounded-full text-xs text-muted-foreground">Inactiva</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{source.leads}</TableCell>
                  <TableCell className="text-sm">{source.jobs}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Card className="p-5">
        <h4 className="text-sm font-semibold mb-4">L&iacute;mites de Velocidad</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="global-daily" className="text-xs text-muted-foreground">L&iacute;mite diario global</Label>
              <Input id="global-daily" type="number" defaultValue="100" className="rounded-lg" data-testid="input-global-daily-limit" />
              <p className="text-[11px] text-muted-foreground">M&aacute;ximo de leads a descubrir por d&iacute;a entre todos los jobs</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="per-job-daily" className="text-xs text-muted-foreground">L&iacute;mite diario por job</Label>
              <Input id="per-job-daily" type="number" defaultValue="50" className="rounded-lg" data-testid="input-per-job-daily-limit" />
              <p className="text-[11px] text-muted-foreground">M&aacute;ximo de leads por job individual al d&iacute;a</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="request-delay" className="text-xs text-muted-foreground">Delay entre peticiones (ms)</Label>
              <Input id="request-delay" type="number" defaultValue="2000" className="rounded-lg" data-testid="input-request-delay" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="concurrent" className="text-xs text-muted-foreground">Peticiones concurrentes</Label>
              <Input id="concurrent" type="number" defaultValue="3" className="rounded-lg" data-testid="input-concurrent-requests" />
            </div>
          </div>
          <div className="pt-1">
            <Button size="sm" data-testid="button-save-discovery">Guardar configuraci&oacute;n de discovery</Button>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <h4 className="text-sm font-semibold mb-1">Jobs Activos</h4>
        <p className="text-xs text-muted-foreground mb-4">
          {searchJobs.filter(j => j.status === "active").length} jobs activos de {searchJobs.length} totales
        </p>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="text-[11px] uppercase tracking-wide font-medium">Job</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wide font-medium">Estado</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wide font-medium">Descubiertos</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wide font-medium">L&iacute;mite/d&iacute;a</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {searchJobs.map((job) => (
                <TableRow key={job.id} data-testid={`row-job-${job.id}`}>
                  <TableCell className="text-sm font-medium">{job.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`rounded-full text-xs ${
                      job.status === "active" ? "text-emerald-600 dark:text-emerald-400" :
                      job.status === "paused" ? "text-amber-600 dark:text-amber-400" :
                      "text-muted-foreground"
                    }`}>
                      {job.status === "active" ? "Activo" :
                       job.status === "paused" ? "Pausado" :
                       job.status === "completed" ? "Completado" : "Borrador"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{job.totalDiscovered}</TableCell>
                  <TableCell className="text-sm">{job.dailyLimit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold" data-testid="text-settings-heading">Configuraci&oacute;n</h1>
        <p className="text-sm text-muted-foreground mt-1" data-testid="text-settings-description">
          Gestiona la configuraci&oacute;n del tenant, integraciones y reglas de negocio
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
            Exclusi&oacute;n
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