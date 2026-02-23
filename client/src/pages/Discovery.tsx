import { useState } from "react";
import { Search, Plus, Play, Pause, Square, Eye, Globe, Factory, Users, Clock, Calendar, ChevronRight, Zap, MapPin, Briefcase, Pencil } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { searchJobs, leads, LEAD_STATUS_CONFIG, type SearchJob } from "@/lib/mockData";

const JOB_STATUS_DOT: Record<string, string> = {
  active: "bg-emerald-500",
  paused: "bg-amber-500",
  completed: "bg-blue-500",
  draft: "bg-slate-400 dark:bg-slate-500",
};

const JOB_STATUS_LABEL: Record<string, string> = {
  active: "Activo",
  paused: "Pausado",
  completed: "Completado",
  draft: "Borrador",
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "---";
  return new Date(dateStr).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function StatusDot({ status }: { status: string }) {
  const dot = JOB_STATUS_DOT[status] || JOB_STATUS_DOT.draft;
  const label = JOB_STATUS_LABEL[status] || status;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground" data-testid={`badge-status-${status}`}>
      <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
      {label}
    </span>
  );
}

interface JobFormData {
  name: string;
  geo: string;
  industry: string;
  keywords: string;
  targetRoles: string;
  dailyLimit: number;
  schedule: string;
  sources: string;
}

const emptyForm: JobFormData = {
  name: "",
  geo: "",
  industry: "",
  keywords: "",
  targetRoles: "",
  dailyLimit: 25,
  schedule: "Diario - 09:00 CET",
  sources: "Google Search",
};

function jobToForm(job: SearchJob): JobFormData {
  return {
    name: job.name,
    geo: job.geo.join(", "),
    industry: job.industry.join(", "),
    keywords: job.keywords.join(", "),
    targetRoles: job.targetRoles.join(", "),
    dailyLimit: job.dailyLimit,
    schedule: job.schedule,
    sources: job.sources.join(", "),
  };
}

export default function Discovery() {
  const [jobs, setJobs] = useState<SearchJob[]>(searchJobs);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingJob, setEditingJob] = useState<SearchJob | null>(null);
  const [formData, setFormData] = useState<JobFormData>(emptyForm);

  const selectedJob = selectedJobId ? jobs.find(j => j.id === selectedJobId) : null;
  const jobLeads = selectedJob ? leads.filter(l => l.searchJobId === selectedJob.id) : [];

  function handleCreateNew() {
    setEditingJob(null);
    setFormData(emptyForm);
    setShowCreateModal(true);
  }

  function handleEditJob(job: SearchJob) {
    setEditingJob(job);
    setFormData(jobToForm(job));
    setShowCreateModal(true);
  }

  function handleSaveJob() {
    if (editingJob) {
      setJobs(prev => prev.map(j => j.id === editingJob.id ? {
        ...j,
        name: formData.name,
        geo: formData.geo.split(",").map(s => s.trim()).filter(Boolean),
        industry: formData.industry.split(",").map(s => s.trim()).filter(Boolean),
        keywords: formData.keywords.split(",").map(s => s.trim()).filter(Boolean),
        targetRoles: formData.targetRoles.split(",").map(s => s.trim()).filter(Boolean),
        dailyLimit: formData.dailyLimit,
        schedule: formData.schedule,
        sources: formData.sources.split(",").map(s => s.trim()).filter(Boolean),
      } : j));
    } else {
      const newJob: SearchJob = {
        id: `sj-${String(jobs.length + 1).padStart(3, "0")}`,
        name: formData.name,
        status: "draft",
        geo: formData.geo.split(",").map(s => s.trim()).filter(Boolean),
        industry: formData.industry.split(",").map(s => s.trim()).filter(Boolean),
        keywords: formData.keywords.split(",").map(s => s.trim()).filter(Boolean),
        targetRoles: formData.targetRoles.split(",").map(s => s.trim()).filter(Boolean),
        dailyLimit: formData.dailyLimit,
        schedule: formData.schedule,
        totalDiscovered: 0,
        totalQualified: 0,
        lastRunAt: null,
        nextRunAt: null,
        createdAt: new Date().toISOString(),
        sources: formData.sources.split(",").map(s => s.trim()).filter(Boolean),
      };
      setJobs(prev => [...prev, newJob]);
    }
    setShowCreateModal(false);
  }

  function handleToggleStatus(jobId: string) {
    setJobs(prev => prev.map(j => {
      if (j.id !== jobId) return j;
      if (j.status === "active") return { ...j, status: "paused" as const };
      if (j.status === "paused" || j.status === "draft") return { ...j, status: "active" as const, lastRunAt: new Date().toISOString() };
      return j;
    }));
  }

  function handleStopJob(jobId: string) {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: "completed" as const, nextRunAt: null } : j));
  }

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-semibold" data-testid="text-page-title">Discovery</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gestiona tus trabajos de descubrimiento de prospectos</p>
        </div>
        <Button onClick={handleCreateNew} data-testid="button-create-job">
          <Plus className="w-4 h-4 mr-1.5" />
          Nuevo Trabajo
        </Button>
      </div>

      {selectedJob ? (
        <JobDetailView
          job={selectedJob}
          jobLeads={jobLeads}
          onBack={() => setSelectedJobId(null)}
          onToggleStatus={() => handleToggleStatus(selectedJob.id)}
          onStop={() => handleStopJob(selectedJob.id)}
          onEdit={() => handleEditJob(selectedJob)}
        />
      ) : (
        <div className="grid gap-3">
          {jobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              onView={() => setSelectedJobId(job.id)}
              onToggleStatus={() => handleToggleStatus(job.id)}
              onStop={() => handleStopJob(job.id)}
              onEdit={() => handleEditJob(job)}
            />
          ))}
          {jobs.length === 0 && (
            <Card className="p-10 text-center">
              <Search className="w-8 h-8 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground" data-testid="text-empty-state">No hay trabajos de descubrimiento. Crea uno nuevo para empezar.</p>
            </Card>
          )}
        </div>
      )}

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle data-testid="text-modal-title">
              {editingJob ? "Editar Trabajo" : "Nuevo Trabajo de Descubrimiento"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="job-name" className="text-xs text-muted-foreground">Nombre</Label>
              <Input
                id="job-name"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ej: Hoteles Boutique España"
                data-testid="input-job-name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="job-geo" className="text-xs text-muted-foreground">Geografía</Label>
                <Input
                  id="job-geo"
                  value={formData.geo}
                  onChange={e => setFormData(prev => ({ ...prev, geo: e.target.value }))}
                  placeholder="España, México"
                  data-testid="input-job-geo"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="job-industry" className="text-xs text-muted-foreground">Industria</Label>
                <Input
                  id="job-industry"
                  value={formData.industry}
                  onChange={e => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                  placeholder="Hospitality, Hotels"
                  data-testid="input-job-industry"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="job-keywords" className="text-xs text-muted-foreground">Palabras clave (separar con comas)</Label>
              <Textarea
                id="job-keywords"
                value={formData.keywords}
                onChange={e => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                placeholder="hotel boutique, hotel independiente"
                className="resize-none"
                data-testid="input-job-keywords"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="job-roles" className="text-xs text-muted-foreground">Roles objetivo (separar con comas)</Label>
              <Input
                id="job-roles"
                value={formData.targetRoles}
                onChange={e => setFormData(prev => ({ ...prev, targetRoles: e.target.value }))}
                placeholder="Director General, Revenue Manager"
                data-testid="input-job-roles"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="job-limit" className="text-xs text-muted-foreground">Límite diario</Label>
                <Input
                  id="job-limit"
                  type="number"
                  value={formData.dailyLimit}
                  onChange={e => setFormData(prev => ({ ...prev, dailyLimit: parseInt(e.target.value) || 0 }))}
                  data-testid="input-job-limit"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="job-schedule" className="text-xs text-muted-foreground">Programación</Label>
                <Select value={formData.schedule} onValueChange={v => setFormData(prev => ({ ...prev, schedule: v }))}>
                  <SelectTrigger data-testid="select-job-schedule">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Diario - 09:00 CET">Diario - 09:00 CET</SelectItem>
                    <SelectItem value="Diario - 10:00 CST">Diario - 10:00 CST</SelectItem>
                    <SelectItem value="Lun-Vie - 08:00 WET">Lun-Vie - 08:00 WET</SelectItem>
                    <SelectItem value="Sin programar">Sin programar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="job-sources" className="text-xs text-muted-foreground">Fuentes (separar con comas)</Label>
              <Input
                id="job-sources"
                value={formData.sources}
                onChange={e => setFormData(prev => ({ ...prev, sources: e.target.value }))}
                placeholder="Google Search, Booking.com"
                data-testid="input-job-sources"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowCreateModal(false)} data-testid="button-cancel-job">
              Cancelar
            </Button>
            <Button onClick={handleSaveJob} disabled={!formData.name.trim()} data-testid="button-save-job">
              {editingJob ? "Guardar Cambios" : "Crear Trabajo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function JobCard({ job, onView, onToggleStatus, onStop, onEdit }: {
  job: SearchJob;
  onView: () => void;
  onToggleStatus: () => void;
  onStop: () => void;
  onEdit: () => void;
}) {
  return (
    <Card className="p-5 hover-elevate cursor-pointer" onClick={onView} data-testid={`card-job-${job.id}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-sm font-semibold" data-testid={`text-job-name-${job.id}`}>{job.name}</h3>
            <StatusDot status={job.status} />
          </div>

          <div className="flex items-center gap-3 mt-2.5 flex-wrap">
            {job.geo.map(g => (
              <Badge key={g} variant="secondary" className="rounded-full text-[11px]" data-testid={`badge-geo-${g}`}>
                <Globe className="w-3 h-3 mr-1 text-muted-foreground" />
                {g}
              </Badge>
            ))}
            {job.industry.map(i => (
              <Badge key={i} variant="secondary" className="rounded-full text-[11px]" data-testid={`badge-industry-${i}`}>
                <Factory className="w-3 h-3 mr-1 text-muted-foreground" />
                {i}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-5 mt-3 text-xs text-muted-foreground flex-wrap">
            <span>
              Descubiertos <span className="font-medium text-foreground ml-0.5">{job.totalDiscovered}</span>
            </span>
            <span>
              Cualificados <span className="font-medium text-foreground ml-0.5">{job.totalQualified}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {job.lastRunAt ? formatDate(job.lastRunAt) : "Sin ejecutar"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {(job.status === "active" || job.status === "paused" || job.status === "draft") && (
            <Button
              size="icon"
              variant="ghost"
              onClick={e => { e.stopPropagation(); onToggleStatus(); }}
              data-testid={`button-toggle-${job.id}`}
            >
              {job.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
          )}
          {(job.status === "active" || job.status === "paused") && (
            <Button
              size="icon"
              variant="ghost"
              onClick={e => { e.stopPropagation(); onStop(); }}
              data-testid={`button-stop-${job.id}`}
            >
              <Square className="w-4 h-4" />
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            onClick={e => { e.stopPropagation(); onEdit(); }}
            data-testid={`button-edit-${job.id}`}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={e => { e.stopPropagation(); onView(); }}
            data-testid={`button-view-${job.id}`}
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

function JobDetailView({ job, jobLeads, onBack, onToggleStatus, onStop, onEdit }: {
  job: SearchJob;
  jobLeads: typeof leads;
  onBack: () => void;
  onToggleStatus: () => void;
  onStop: () => void;
  onEdit: () => void;
}) {
  const qualificationRate = job.totalDiscovered > 0
    ? Math.round((job.totalQualified / job.totalDiscovered) * 100)
    : 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <button onClick={onBack} className="hover:text-foreground transition-colors" data-testid="button-back-to-list">
          Discovery
        </button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground font-medium">{job.name}</span>
      </div>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-lg font-semibold" data-testid="text-job-detail-name">{job.name}</h2>
            <StatusDot status={job.status} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Creado el {formatDate(job.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(job.status === "active" || job.status === "paused" || job.status === "draft") && (
            <Button variant="outline" size="sm" onClick={onToggleStatus} data-testid="button-detail-toggle">
              {job.status === "active" ? (
                <><Pause className="w-3.5 h-3.5 mr-1.5" /> Pausar</>
              ) : (
                <><Play className="w-3.5 h-3.5 mr-1.5" /> Ejecutar</>
              )}
            </Button>
          )}
          {(job.status === "active" || job.status === "paused") && (
            <Button variant="outline" size="sm" onClick={onStop} data-testid="button-detail-stop">
              <Square className="w-3.5 h-3.5 mr-1.5" /> Detener
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={onEdit} data-testid="button-detail-edit">
            <Pencil className="w-3.5 h-3.5 mr-1.5" /> Editar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-5">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Descubiertos</p>
          <p className="text-2xl font-semibold mt-1" data-testid="text-stat-discovered">{job.totalDiscovered}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Cualificados</p>
          <p className="text-2xl font-semibold mt-1" data-testid="text-stat-qualified">{job.totalQualified}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Tasa Cualificación</p>
          <p className="text-2xl font-semibold mt-1" data-testid="text-stat-rate">{qualificationRate}%</p>
        </Card>
        <Card className="p-5">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Límite Diario</p>
          <p className="text-2xl font-semibold mt-1" data-testid="text-stat-limit">{job.dailyLimit}/día</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="p-5">
          <h3 className="text-sm font-semibold mb-4">Criterios de Búsqueda</h3>
          <div className="space-y-4">
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Geografía
              </p>
              <div className="flex gap-1.5 flex-wrap">
                {job.geo.map(g => (
                  <Badge key={g} variant="secondary" className="rounded-full text-[11px]" data-testid={`badge-geo-${g}`}>{g}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" /> Industria
              </p>
              <div className="flex gap-1.5 flex-wrap">
                {job.industry.map(i => (
                  <Badge key={i} variant="secondary" className="rounded-full text-[11px]" data-testid={`badge-industry-${i}`}>{i}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" /> Palabras Clave
              </p>
              <div className="flex gap-1.5 flex-wrap">
                {job.keywords.map(k => (
                  <Badge key={k} variant="secondary" className="rounded-full text-[11px]" data-testid={`badge-keyword-${k}`}>{k}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Roles Objetivo
              </p>
              <div className="flex gap-1.5 flex-wrap">
                {job.targetRoles.map(r => (
                  <Badge key={r} variant="secondary" className="rounded-full text-[11px]" data-testid={`badge-role-${r}`}>{r}</Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold mb-4">Programación y Fuentes</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Programación
              </span>
              <span className="text-sm" data-testid="text-schedule">{job.schedule}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Última ejecución
              </span>
              <span className="text-sm" data-testid="text-last-run">{formatDate(job.lastRunAt)}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Próxima ejecución
              </span>
              <span className="text-sm" data-testid="text-next-run">{formatDate(job.nextRunAt)}</span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1.5">
                <Zap className="w-3.5 h-3.5" /> Fuentes de datos
              </p>
              <div className="flex gap-1.5 flex-wrap">
                {job.sources.map(s => (
                  <Badge key={s} variant="secondary" className="rounded-full text-[11px]" data-testid={`badge-source-${s}`}>{s}</Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Rate limit
              </span>
              <span className="text-sm" data-testid="text-rate-limit">{job.dailyLimit} prospectos/día</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="text-sm font-semibold mb-4">
          Leads Descubiertos <span className="text-muted-foreground font-normal">({jobLeads.length})</span>
        </h3>
        {jobLeads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2.5 pr-4 text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Nombre</th>
                  <th className="pb-2.5 pr-4 text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Empresa</th>
                  <th className="pb-2.5 pr-4 text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Email</th>
                  <th className="pb-2.5 pr-4 text-[11px] text-muted-foreground font-medium uppercase tracking-wide">País</th>
                  <th className="pb-2.5 pr-4 text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Estado</th>
                  <th className="pb-2.5 text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Score</th>
                </tr>
              </thead>
              <tbody>
                {jobLeads.map(lead => {
                  const statusCfg = LEAD_STATUS_CONFIG[lead.status];
                  return (
                    <tr key={lead.id} className="border-b last:border-0 hover-elevate" data-testid={`row-lead-${lead.id}`}>
                      <td className="py-2.5 pr-4 text-sm font-medium">{lead.name}</td>
                      <td className="py-2.5 pr-4 text-sm text-muted-foreground">{lead.company}</td>
                      <td className="py-2.5 pr-4 text-sm text-muted-foreground">{lead.email}</td>
                      <td className="py-2.5 pr-4 text-sm text-muted-foreground">{lead.country}</td>
                      <td className="py-2.5 pr-4">
                        <Badge variant="outline" className={`rounded-full border-transparent text-[11px] ${statusCfg.bgClass} ${statusCfg.textClass}`}>
                          {statusCfg.label}
                        </Badge>
                      </td>
                      <td className="py-2.5 text-sm font-medium">{lead.score}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground" data-testid="text-no-leads">
            No se han descubierto leads aún para este trabajo.
          </p>
        )}
      </Card>
    </div>
  );
}
