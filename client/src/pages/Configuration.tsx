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
  ShieldCheck,
  Target,
  Gauge,
  Trash2,
  Plus,
} from "lucide-react";
import { suppressionList, exclusionRules } from "@/lib/mockData";
import type { ExclusionRule } from "@/lib/mockData";

function GeneralTab() {
  return (
    <div className="space-y-5">
      <Card className="p-5">
        <h4 className="text-sm font-semibold mb-4" data-testid="text-general-title">Informaci&oacute;n del Tenant</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="tenant-name" className="text-xs text-muted-foreground">Nombre del Tenant</Label>
              <Input id="tenant-name" defaultValue="Fideltour" data-testid="input-tenant-name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="company-name" className="text-xs text-muted-foreground">Nombre de la Empresa</Label>
              <Input id="company-name" defaultValue="Fideltour S.L." data-testid="input-company-name" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="company-domain" className="text-xs text-muted-foreground">Dominio</Label>
              <Input id="company-domain" defaultValue="fideltour.com" data-testid="input-company-domain" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="company-website" className="text-xs text-muted-foreground">Sitio Web</Label>
              <Input id="company-website" defaultValue="https://fideltour.com" data-testid="input-company-website" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="timezone" className="text-xs text-muted-foreground">Zona Horaria</Label>
              <Select defaultValue="europe-madrid">
                <SelectTrigger data-testid="select-timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="europe-madrid">Europe/Madrid (CET)</SelectItem>
                  <SelectItem value="europe-lisbon">Europe/Lisbon (WET)</SelectItem>
                  <SelectItem value="america-mexico">America/Mexico_City (CST)</SelectItem>
                  <SelectItem value="america-bogota">America/Bogota (COT)</SelectItem>
                  <SelectItem value="america-lima">America/Lima (PET)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="language" className="text-xs text-muted-foreground">Idioma</Label>
              <Select defaultValue="es">
                <SelectTrigger data-testid="select-language">
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

function ExclusionTab() {
  const [rules, setRules] = useState<ExclusionRule[]>(exclusionRules);
  const [entries] = useState(suppressionList);

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <h4 className="text-sm font-semibold mb-1">Reglas de Exclusi&oacute;n</h4>
        <p className="text-xs text-muted-foreground mb-4">
          Cada lead pasa por estas verificaciones antes de ser elegible para campa&ntilde;as.
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
            <h4 className="text-sm font-semibold">Lista de Supresi&oacute;n (Blocklist)</h4>
            <p className="text-xs text-muted-foreground mt-0.5">{entries.length} entradas en la lista de bloqueo</p>
          </div>
          <Button variant="outline" size="sm" data-testid="button-add-suppression">
            <Plus className="w-4 h-4 mr-1" />
            A&ntilde;adir
          </Button>
        </div>
        <div className="rounded-md border overflow-hidden">
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
        <div className="rounded-md border overflow-hidden">
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

function UsageLimitsTab() {
  return (
    <div className="space-y-5">
      <Card className="p-5">
        <h4 className="text-sm font-semibold mb-1" data-testid="text-usage-title">Uso Actual del Plan</h4>
        <p className="text-xs text-muted-foreground mb-5">Resumen de consumo de cr&eacute;ditos y l&iacute;mites del plan actual.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <Card className="p-4">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Cr&eacute;ditos restantes</p>
            <p className="text-2xl font-bold mt-1" data-testid="text-credits-remaining">12,000</p>
            <p className="text-xs text-muted-foreground mt-0.5">de 20,000 / mes</p>
            <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: "60%" }} />
            </div>
          </Card>
          <Card className="p-4">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Emails enviados</p>
            <p className="text-2xl font-bold mt-1" data-testid="text-emails-sent-usage">204</p>
            <p className="text-xs text-muted-foreground mt-0.5">de 5,000 / mes</p>
            <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: "4%" }} />
            </div>
          </Card>
          <Card className="p-4">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Enriquecimientos</p>
            <p className="text-2xl font-bold mt-1" data-testid="text-enrichments-usage">347</p>
            <p className="text-xs text-muted-foreground mt-0.5">de 3,000 / mes</p>
            <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: "12%" }} />
            </div>
          </Card>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="rounded-full text-xs" data-testid="badge-plan-name">Plan Growth</Badge>
          <span className="text-xs text-muted-foreground">Renueva en 7 d&iacute;as</span>
        </div>
      </Card>

      <Card className="p-5">
        <h4 className="text-sm font-semibold mb-4">L&iacute;mites de Velocidad</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="global-daily" className="text-xs text-muted-foreground">L&iacute;mite diario de descubrimiento</Label>
              <Input id="global-daily" type="number" defaultValue="100" data-testid="input-global-daily-limit" />
              <p className="text-[11px] text-muted-foreground">M&aacute;ximo de leads a descubrir por d&iacute;a entre todos los jobs</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="per-job-daily" className="text-xs text-muted-foreground">L&iacute;mite diario por job</Label>
              <Input id="per-job-daily" type="number" defaultValue="50" data-testid="input-per-job-daily-limit" />
              <p className="text-[11px] text-muted-foreground">M&aacute;ximo de leads por job individual al d&iacute;a</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="email-daily-limit" className="text-xs text-muted-foreground">L&iacute;mite diario de emails</Label>
              <Input id="email-daily-limit" type="number" defaultValue="200" data-testid="input-email-daily-limit" />
              <p className="text-[11px] text-muted-foreground">M&aacute;ximo de emails a enviar por d&iacute;a</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email-hourly-limit" className="text-xs text-muted-foreground">L&iacute;mite por hora de emails</Label>
              <Input id="email-hourly-limit" type="number" defaultValue="30" data-testid="input-email-hourly-limit" />
              <p className="text-[11px] text-muted-foreground">M&aacute;ximo de emails por hora</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="enrichment-daily-limit" className="text-xs text-muted-foreground">L&iacute;mite diario de enriquecimiento</Label>
              <Input id="enrichment-daily-limit" type="number" defaultValue="100" data-testid="input-enrichment-daily-limit" />
              <p className="text-[11px] text-muted-foreground">M&aacute;ximo de enriquecimientos por d&iacute;a</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="concurrent-requests" className="text-xs text-muted-foreground">Peticiones concurrentes</Label>
              <Input id="concurrent-requests" type="number" defaultValue="3" data-testid="input-concurrent-requests" />
              <p className="text-[11px] text-muted-foreground">N&uacute;mero m&aacute;ximo de peticiones simult&aacute;neas</p>
            </div>
          </div>
          <div className="pt-1">
            <Button size="sm" data-testid="button-save-limits">Guardar l&iacute;mites</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function ConfigurationPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold" data-testid="text-configuration-heading">Configuraci&oacute;n</h1>
        <p className="text-sm text-muted-foreground mt-1" data-testid="text-configuration-description">
          Ajustes generales, reglas de exclusi&oacute;n, scoring y l&iacute;mites de uso
        </p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-6 flex-wrap">
          <TabsTrigger value="general" data-testid="tab-general">
            <Building2 className="w-4 h-4 mr-1.5" />
            General
          </TabsTrigger>
          <TabsTrigger value="exclusion" data-testid="tab-exclusion">
            <ShieldCheck className="w-4 h-4 mr-1.5" />
            Exclusi&oacute;n
          </TabsTrigger>
          <TabsTrigger value="scoring" data-testid="tab-scoring">
            <Target className="w-4 h-4 mr-1.5" />
            Scoring
          </TabsTrigger>
          <TabsTrigger value="usage" data-testid="tab-usage">
            <Gauge className="w-4 h-4 mr-1.5" />
            L&iacute;mites
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general"><GeneralTab /></TabsContent>
        <TabsContent value="exclusion"><ExclusionTab /></TabsContent>
        <TabsContent value="scoring"><ScoringTab /></TabsContent>
        <TabsContent value="usage"><UsageLimitsTab /></TabsContent>
      </Tabs>
    </div>
  );
}
