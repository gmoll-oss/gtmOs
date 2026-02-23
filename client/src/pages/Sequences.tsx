import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  Play,
  Pause,
  Plus,
  Send,
  Eye,
  MessageSquare,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Clock,
  ArrowRight,
  Users,
  Pencil,
  MailPlus,
  CornerDownRight,
  Flag,
} from "lucide-react";
import { sequences as mockSequences, leads, type Sequence, type SequenceStep } from "@/lib/mockData";

const STEP_TYPE_CONFIG: Record<string, { label: string; icon: typeof Mail; color: string; bgClass: string; textClass: string }> = {
  email: { label: "Email Inicial", icon: MailPlus, color: "#3b82f6", bgClass: "bg-blue-100 dark:bg-blue-900/40", textClass: "text-blue-700 dark:text-blue-300" },
  follow_up: { label: "Follow-up", icon: CornerDownRight, color: "#8b5cf6", bgClass: "bg-violet-100 dark:bg-violet-900/40", textClass: "text-violet-700 dark:text-violet-300" },
  breakup: { label: "Breakup", icon: Flag, color: "#f97316", bgClass: "bg-orange-100 dark:bg-orange-900/40", textClass: "text-orange-700 dark:text-orange-300" },
};

const STATUS_CONFIG: Record<string, { label: string; bgClass: string; textClass: string }> = {
  active: { label: "Activa", bgClass: "bg-emerald-100 dark:bg-emerald-900/40", textClass: "text-emerald-700 dark:text-emerald-300" },
  paused: { label: "Pausada", bgClass: "bg-amber-100 dark:bg-amber-900/40", textClass: "text-amber-700 dark:text-amber-300" },
  draft: { label: "Borrador", bgClass: "bg-slate-100 dark:bg-slate-800", textClass: "text-slate-700 dark:text-slate-300" },
};

const TEMPLATE_VARIABLES = ["{empresa}", "{nombre}", "{rol}", "{ciudad}", "{pain}", "{propuesta}"];

function StepTimeline({ steps }: { steps: SequenceStep[] }) {
  return (
    <div className="space-y-0">
      {steps.map((step, index) => {
        const config = STEP_TYPE_CONFIG[step.type] || STEP_TYPE_CONFIG.email;
        const Icon = config.icon;
        const totalActivity = step.sent;
        const openRate = totalActivity > 0 ? Math.round((step.opened / totalActivity) * 100) : 0;
        const replyRate = totalActivity > 0 ? Math.round((step.replied / totalActivity) * 100) : 0;

        return (
          <div key={step.id} className="relative" data-testid={`step-timeline-${step.id}`}>
            {index < steps.length - 1 && (
              <div className="absolute left-5 top-12 bottom-0 w-px bg-border" />
            )}
            <div className="flex gap-3 pb-4">
              <div
                className="w-10 h-10 rounded-md flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${config.color}15` }}
              >
                <Icon className="w-4 h-4" style={{ color: config.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={`${config.bgClass} ${config.textClass} text-xs`}>
                    {config.label}
                  </Badge>
                  {step.delayDays > 0 && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      +{step.delayDays} días
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium mt-1 truncate" data-testid={`text-step-subject-${step.id}`}>
                  {step.subject}
                </p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {step.body.substring(0, 120)}...
                </p>
                {totalActivity > 0 && (
                  <div className="flex items-center gap-4 mt-2 flex-wrap">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Send className="w-3 h-3" /> {step.sent}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {step.opened} ({openRate}%)
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> {step.replied} ({replyRate}%)
                    </span>
                    {step.bounced > 0 && (
                      <span className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> {step.bounced}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SequenceCard({ sequence, onEdit }: { sequence: Sequence; onEdit: (seq: Sequence) => void }) {
  const [expanded, setExpanded] = useState(false);
  const statusConfig = STATUS_CONFIG[sequence.status] || STATUS_CONFIG.draft;
  const enrolledLeads = leads.filter((l) => l.sequenceId === sequence.id);
  const openRate = sequence.totalSent > 0 ? Math.round((sequence.totalOpened / sequence.totalSent) * 100) : 0;
  const replyRate = sequence.totalSent > 0 ? Math.round((sequence.totalReplied / sequence.totalSent) * 100) : 0;

  return (
    <Card className="p-4" data-testid={`card-sequence-${sequence.id}`}>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold" data-testid={`text-sequence-name-${sequence.id}`}>
              {sequence.name}
            </h3>
            <Badge className={`${statusConfig.bgClass} ${statusConfig.textClass} text-xs`} data-testid={`badge-sequence-status-${sequence.id}`}>
              {statusConfig.label}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {sequence.steps.length} pasos · Creada {new Date(sequence.createdAt).toLocaleDateString("es-ES")}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onEdit(sequence)}
            data-testid={`button-edit-sequence-${sequence.id}`}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          {sequence.status === "active" ? (
            <Button size="icon" variant="ghost" data-testid={`button-pause-sequence-${sequence.id}`}>
              <Pause className="w-4 h-4" />
            </Button>
          ) : (
            <Button size="icon" variant="ghost" data-testid={`button-play-sequence-${sequence.id}`}>
              <Play className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
        <div className="text-center">
          <p className="text-lg font-semibold" data-testid={`text-enrolled-${sequence.id}`}>{sequence.enrolledCount}</p>
          <p className="text-[11px] text-muted-foreground">Inscritos</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold" data-testid={`text-sent-${sequence.id}`}>{sequence.totalSent}</p>
          <p className="text-[11px] text-muted-foreground">Enviados</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold" data-testid={`text-open-rate-${sequence.id}`}>{openRate}%</p>
          <p className="text-[11px] text-muted-foreground">Apertura</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold" data-testid={`text-reply-rate-${sequence.id}`}>{replyRate}%</p>
          <p className="text-[11px] text-muted-foreground">Respuesta</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-red-500 dark:text-red-400" data-testid={`text-bounced-${sequence.id}`}>{sequence.totalBounced}</p>
          <p className="text-[11px] text-muted-foreground">Rebotados</p>
        </div>
      </div>

      {enrolledLeads.length > 0 && (
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <Users className="w-3.5 h-3.5 text-muted-foreground" />
          <div className="flex items-center gap-1 flex-wrap">
            {enrolledLeads.slice(0, 4).map((lead) => (
              <span key={lead.id} className="text-xs text-muted-foreground">
                {lead.name.split(" ")[0]}
              </span>
            ))}
            {enrolledLeads.length > 4 && (
              <span className="text-xs text-muted-foreground">
                +{enrolledLeads.length - 4} más
              </span>
            )}
          </div>
        </div>
      )}

      <Button
        variant="ghost"
        className="w-full mt-3 text-xs"
        onClick={() => setExpanded(!expanded)}
        data-testid={`button-toggle-steps-${sequence.id}`}
      >
        {expanded ? (
          <>
            <ChevronUp className="w-3.5 h-3.5 mr-1" /> Ocultar pasos
          </>
        ) : (
          <>
            <ChevronDown className="w-3.5 h-3.5 mr-1" /> Ver pasos ({sequence.steps.length})
          </>
        )}
      </Button>

      {expanded && (
        <div className="mt-3 pt-3 border-t">
          <StepTimeline steps={sequence.steps} />
        </div>
      )}
    </Card>
  );
}

function StepEditor({
  step,
  index,
  onChange,
}: {
  step: SequenceStep;
  index: number;
  onChange: (updated: SequenceStep) => void;
}) {
  const config = STEP_TYPE_CONFIG[step.type] || STEP_TYPE_CONFIG.email;

  return (
    <div className="relative" data-testid={`editor-step-${index}`}>
      {index > 0 && (
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Esperar</span>
          <Input
            type="number"
            min={1}
            value={step.delayDays}
            onChange={(e) => onChange({ ...step, delayDays: parseInt(e.target.value) || 1 })}
            className="w-16"
            data-testid={`input-delay-${index}`}
          />
          <span className="text-xs text-muted-foreground">días</span>
        </div>
      )}
      <Card className="p-3">
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <Badge className={`${config.bgClass} ${config.textClass} text-xs`}>
            {config.label} {step.type === "follow_up" ? `#${index}` : ""}
          </Badge>
          <Select
            value={step.type}
            onValueChange={(val) => onChange({ ...step, type: val as SequenceStep["type"] })}
          >
            <SelectTrigger className="w-36" data-testid={`select-step-type-${index}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email Inicial</SelectItem>
              <SelectItem value="follow_up">Follow-up</SelectItem>
              <SelectItem value="breakup">Breakup</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Input
            placeholder="Asunto del email..."
            value={step.subject}
            onChange={(e) => onChange({ ...step, subject: e.target.value })}
            data-testid={`input-subject-${index}`}
          />
          <Textarea
            placeholder="Cuerpo del email..."
            value={step.body}
            onChange={(e) => onChange({ ...step, body: e.target.value })}
            rows={5}
            className="resize-none text-sm"
            data-testid={`textarea-body-${index}`}
          />
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[11px] text-muted-foreground mr-1">Variables:</span>
            {TEMPLATE_VARIABLES.map((v) => (
              <Badge
                key={v}
                variant="secondary"
                className="text-[10px] cursor-pointer"
                onClick={() => onChange({ ...step, body: step.body + " " + v })}
                data-testid={`badge-variable-${v}`}
              >
                {v}
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function Sequences() {
  const [sequencesList] = useState<Sequence[]>(mockSequences);
  const [editingSequence, setEditingSequence] = useState<Sequence | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newName, setNewName] = useState("");
  const [editSteps, setEditSteps] = useState<SequenceStep[]>([]);

  const handleEdit = (seq: Sequence) => {
    setEditingSequence(seq);
    setEditSteps(seq.steps.map((s) => ({ ...s })));
  };

  const handleStepChange = (index: number, updated: SequenceStep) => {
    setEditSteps((prev) => prev.map((s, i) => (i === index ? updated : s)));
  };

  const handleAddStep = () => {
    const newStep: SequenceStep = {
      id: `step-new-${Date.now()}`,
      order: editSteps.length + 1,
      type: editSteps.length === 0 ? "email" : editSteps.length < 3 ? "follow_up" : "breakup",
      delayDays: editSteps.length === 0 ? 0 : 5,
      subject: "",
      body: "",
      sent: 0,
      opened: 0,
      replied: 0,
      bounced: 0,
    };
    setEditSteps((prev) => [...prev, newStep]);
  };

  const handleCreateNew = () => {
    setShowCreateDialog(false);
    const newSeq: Sequence = {
      id: `seq-new-${Date.now()}`,
      name: newName || "Nueva Secuencia",
      status: "draft",
      steps: [
        {
          id: `step-new-${Date.now()}-1`,
          order: 1,
          type: "email",
          delayDays: 0,
          subject: "",
          body: "",
          sent: 0,
          opened: 0,
          replied: 0,
          bounced: 0,
        },
      ],
      enrolledCount: 0,
      totalSent: 0,
      totalOpened: 0,
      totalReplied: 0,
      totalBounced: 0,
      createdAt: new Date().toISOString(),
    };
    setNewName("");
    handleEdit(newSeq);
  };

  const totalEnrolled = sequencesList.reduce((sum, s) => sum + s.enrolledCount, 0);
  const totalSent = sequencesList.reduce((sum, s) => sum + s.totalSent, 0);
  const totalReplied = sequencesList.reduce((sum, s) => sum + s.totalReplied, 0);
  const avgReplyRate = totalSent > 0 ? Math.round((totalReplied / totalSent) * 100) : 0;

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-semibold text-foreground" data-testid="text-page-title">
            Secuencias
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gestiona tus secuencias de email outreach
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} data-testid="button-create-sequence">
          <Plus className="w-4 h-4 mr-1" /> Nueva Secuencia
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4 text-center">
          <p className="text-2xl font-semibold" data-testid="text-kpi-sequences">{sequencesList.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Secuencias</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-semibold" data-testid="text-kpi-enrolled">{totalEnrolled}</p>
          <p className="text-xs text-muted-foreground mt-1">Inscritos Total</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-semibold" data-testid="text-kpi-sent">{totalSent}</p>
          <p className="text-xs text-muted-foreground mt-1">Emails Enviados</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-semibold" data-testid="text-kpi-reply-rate">{avgReplyRate}%</p>
          <p className="text-xs text-muted-foreground mt-1">Tasa de Respuesta</p>
        </Card>
      </div>

      <div className="space-y-4">
        {sequencesList.map((seq) => (
          <SequenceCard key={seq.id} sequence={seq} onEdit={handleEdit} />
        ))}
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva Secuencia</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium">Nombre de la secuencia</label>
              <Input
                placeholder="Ej: Outreach Hoteles Q2"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="mt-1"
                data-testid="input-new-sequence-name"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)} data-testid="button-cancel-create">
                Cancelar
              </Button>
              <Button onClick={handleCreateNew} data-testid="button-confirm-create">
                Crear y Editar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingSequence} onOpenChange={(open) => !open && setEditingSequence(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSequence?.name || "Editar Secuencia"}
            </DialogTitle>
          </DialogHeader>
          {editingSequence && (
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-sm font-medium">Nombre</label>
                <Input
                  value={editingSequence.name}
                  onChange={(e) =>
                    setEditingSequence({ ...editingSequence, name: e.target.value })
                  }
                  className="mt-1"
                  data-testid="input-edit-sequence-name"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <h3 className="text-sm font-semibold">Pasos de la secuencia</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddStep}
                    data-testid="button-add-step"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Agregar Paso
                  </Button>
                </div>
                <div className="space-y-3">
                  {editSteps.map((step, idx) => (
                    <StepEditor
                      key={step.id}
                      step={step}
                      index={idx}
                      onChange={(updated) => handleStepChange(idx, updated)}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  onClick={() => setEditingSequence(null)}
                  data-testid="button-cancel-edit"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => setEditingSequence(null)}
                  data-testid="button-save-sequence"
                >
                  Guardar Secuencia
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
