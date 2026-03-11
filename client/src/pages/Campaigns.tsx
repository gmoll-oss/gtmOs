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
  Pencil,
  MailPlus,
  CornerDownRight,
  Flag,
  GitBranch,
  Timer,
  Trash2,
  ArrowDown,
} from "lucide-react";
import { campaigns as mockCampaigns, type Campaign, type CampaignStep } from "@/lib/mockData";

const STEP_TYPE_CONFIG: Record<string, { label: string; icon: typeof Mail; color: string }> = {
  email: { label: "Email Inicial", icon: MailPlus, color: "#3b82f6" },
  follow_up: { label: "Follow-up", icon: CornerDownRight, color: "#8b5cf6" },
  breakup: { label: "Breakup", icon: Flag, color: "#f97316" },
  wait: { label: "Esperar", icon: Timer, color: "#6b7280" },
  condition: { label: "Condición", icon: GitBranch, color: "#10b981" },
};

const STATUS_DOT: Record<string, string> = {
  active: "bg-emerald-500",
  paused: "bg-amber-500",
  draft: "bg-slate-400",
  completed: "bg-blue-500",
};

const STATUS_LABEL: Record<string, string> = {
  active: "Activa",
  paused: "Pausada",
  draft: "Borrador",
  completed: "Completada",
};

const TEMPLATE_VARIABLES = ["{empresa}", "{nombre}", "{rol}", "{ciudad}", "{pain}", "{propuesta}"];

function VisualFlowBuilder({ steps }: { steps: CampaignStep[] }) {
  return (
    <div className="relative flex flex-col items-center gap-0">
      {steps.map((step, index) => {
        const config = STEP_TYPE_CONFIG[step.type] || STEP_TYPE_CONFIG.email;
        const Icon = config.icon;
        const totalActivity = step.sent;
        const openRate = totalActivity > 0 ? Math.round((step.opened / totalActivity) * 100) : 0;
        const replyRate = totalActivity > 0 ? Math.round((step.replied / totalActivity) * 100) : 0;

        if (step.type === "wait") {
          return (
            <div key={step.id} className="flex flex-col items-center" data-testid={`flow-step-${step.id}`}>
              {index > 0 && (
                <div className="w-px h-3 bg-border" />
              )}
              <div className="flex items-center gap-2 px-4 py-2 rounded-md border border-dashed border-muted-foreground/30 bg-muted/30">
                <Timer className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Esperar {step.delayDays} días</span>
              </div>
              {index < steps.length - 1 && (
                <div className="w-px h-3 bg-border" />
              )}
            </div>
          );
        }

        if (step.type === "condition") {
          return (
            <div key={step.id} className="flex flex-col items-center" data-testid={`flow-step-${step.id}`}>
              {index > 0 && (
                <div className="w-px h-3 bg-border" />
              )}
              <div className="relative flex flex-col items-center">
                <div
                  className="w-36 py-2.5 flex flex-col items-center gap-1 rounded-md border"
                  style={{ borderColor: `${config.color}40`, backgroundColor: `${config.color}08` }}
                >
                  <GitBranch className="w-4 h-4" style={{ color: config.color }} />
                  <span className="text-[11px] font-medium" style={{ color: config.color }}>
                    {step.conditionField === "replied" ? "¿Respondió?" : step.conditionField === "opened" ? "¿Abrió?" : "Condición"}
                  </span>
                </div>
                <div className="flex items-start gap-6 mt-1">
                  <div className="flex flex-col items-center">
                    <div className="w-px h-2 bg-emerald-400" />
                    <Badge variant="secondary" className="text-[10px]">
                      Sí: {step.conditionYesBranch === "stop" ? "Detener" : "Continuar"}
                    </Badge>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-px h-2 bg-red-400" />
                    <Badge variant="secondary" className="text-[10px]">
                      No: {step.conditionNoBranch === "stop" ? "Detener" : "Continuar"}
                    </Badge>
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="w-px h-3 bg-border mt-1" />
              )}
            </div>
          );
        }

        return (
          <div key={step.id} className="flex flex-col items-center" data-testid={`flow-step-${step.id}`}>
            {index > 0 && (
              <div className="w-px h-3 bg-border" />
            )}
            <div
              className="w-full max-w-xs rounded-md border p-3"
              style={{ borderColor: `${config.color}30`, backgroundColor: `${config.color}06` }}
            >
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <Icon className="w-3.5 h-3.5" style={{ color: config.color }} />
                <span className="text-xs font-medium" style={{ color: config.color }}>
                  {config.label}
                </span>
              </div>
              <p className="text-[13px] font-medium truncate" data-testid={`text-step-subject-${step.id}`}>
                {step.subject}
              </p>
              {step.body && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                  {step.body.substring(0, 80)}...
                </p>
              )}
              {totalActivity > 0 && (
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Send className="w-3 h-3" /> {step.sent}
                  </span>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {openRate}%
                  </span>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> {replyRate}%
                  </span>
                  {step.bounced > 0 && (
                    <span className="text-[11px] text-red-500 dark:text-red-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> {step.bounced}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CampaignCard({ campaign, onEdit }: { campaign: Campaign; onEdit: (c: Campaign) => void }) {
  const [expanded, setExpanded] = useState(false);
  const openRate = campaign.totalSent > 0 ? Math.round((campaign.totalOpened / campaign.totalSent) * 100) : 0;
  const replyRate = campaign.totalSent > 0 ? Math.round((campaign.totalReplied / campaign.totalSent) * 100) : 0;

  return (
    <Card className="p-5" data-testid={`card-campaign-${campaign.id}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[13px] font-semibold" data-testid={`text-campaign-name-${campaign.id}`}>
              {campaign.name}
            </h3>
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[campaign.status] || STATUS_DOT.draft}`} />
              <span className="text-[11px] text-muted-foreground" data-testid={`badge-campaign-status-${campaign.id}`}>
                {STATUS_LABEL[campaign.status] || "Borrador"}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {campaign.steps.length} pasos · {new Date(campaign.createdAt).toLocaleDateString("es-ES")}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onEdit(campaign)}
            data-testid={`button-edit-campaign-${campaign.id}`}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          {campaign.status === "active" ? (
            <Button size="icon" variant="ghost" data-testid={`button-pause-campaign-${campaign.id}`}>
              <Pause className="w-4 h-4" />
            </Button>
          ) : (
            <Button size="icon" variant="ghost" data-testid={`button-play-campaign-${campaign.id}`}>
              <Play className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-4 pt-4 border-t">
        <div>
          <p className="text-lg font-semibold" data-testid={`text-enrolled-${campaign.id}`}>{campaign.enrolledCount}</p>
          <p className="text-[11px] text-muted-foreground">Inscritos</p>
        </div>
        <div>
          <p className="text-lg font-semibold" data-testid={`text-sent-${campaign.id}`}>{campaign.totalSent}</p>
          <p className="text-[11px] text-muted-foreground">Enviados</p>
        </div>
        <div>
          <p className="text-lg font-semibold" data-testid={`text-open-rate-${campaign.id}`}>{openRate}%</p>
          <p className="text-[11px] text-muted-foreground">Apertura</p>
        </div>
        <div>
          <p className="text-lg font-semibold" data-testid={`text-reply-rate-${campaign.id}`}>{replyRate}%</p>
          <p className="text-[11px] text-muted-foreground">Respuesta</p>
        </div>
        <div>
          <p className="text-lg font-semibold" data-testid={`text-bounced-${campaign.id}`}>{campaign.totalBounced}</p>
          <p className="text-[11px] text-muted-foreground">Rebotados</p>
        </div>
      </div>

      <button
        className="flex items-center gap-1 text-[11px] text-muted-foreground mt-4 pt-3 border-t w-full justify-center"
        onClick={() => setExpanded(!expanded)}
        data-testid={`button-toggle-flow-${campaign.id}`}
      >
        {expanded ? (
          <>
            <ChevronUp className="w-3.5 h-3.5" /> Ocultar flujo
          </>
        ) : (
          <>
            <ChevronDown className="w-3.5 h-3.5" /> Ver flujo visual ({campaign.steps.length} pasos)
          </>
        )}
      </button>

      {expanded && (
        <div className="mt-4 pt-3 border-t overflow-x-auto">
          <VisualFlowBuilder steps={campaign.steps} />
        </div>
      )}
    </Card>
  );
}

function StepEditor({
  step,
  index,
  totalSteps,
  onChange,
  onRemove,
}: {
  step: CampaignStep;
  index: number;
  totalSteps: number;
  onChange: (updated: CampaignStep) => void;
  onRemove: () => void;
}) {
  const config = STEP_TYPE_CONFIG[step.type] || STEP_TYPE_CONFIG.email;

  if (step.type === "wait") {
    return (
      <div className="flex flex-col items-center" data-testid={`editor-step-${index}`}>
        <ArrowDown className="w-4 h-4 text-muted-foreground mb-1" />
        <div className="flex items-center gap-2 px-4 py-2 rounded-md border border-dashed border-muted-foreground/30 bg-muted/30">
          <Timer className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Esperar</span>
          <Input
            type="number"
            min={1}
            value={step.delayDays}
            onChange={(e) => onChange({ ...step, delayDays: parseInt(e.target.value) || 1 })}
            className="w-16"
            data-testid={`input-wait-days-${index}`}
          />
          <span className="text-xs text-muted-foreground">días</span>
          <Button size="icon" variant="ghost" onClick={onRemove} data-testid={`button-remove-step-${index}`}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    );
  }

  if (step.type === "condition") {
    return (
      <div className="flex flex-col items-center" data-testid={`editor-step-${index}`}>
        <ArrowDown className="w-4 h-4 text-muted-foreground mb-1" />
        <Card className="p-4 w-full max-w-md">
          <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
            <span className="text-xs font-medium flex items-center gap-1.5" style={{ color: config.color }}>
              <GitBranch className="w-3.5 h-3.5" /> Condición
            </span>
            <Button size="icon" variant="ghost" onClick={onRemove} data-testid={`button-remove-step-${index}`}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
          <div className="space-y-2">
            <Select
              value={step.conditionField || "replied"}
              onValueChange={(val) => onChange({ ...step, conditionField: val })}
            >
              <SelectTrigger data-testid={`select-condition-field-${index}`}>
                <SelectValue placeholder="Campo de condición" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="replied">¿Ha respondido?</SelectItem>
                <SelectItem value="opened">¿Ha abierto?</SelectItem>
                <SelectItem value="clicked">¿Ha hecho clic?</SelectItem>
              </SelectContent>
            </Select>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-muted-foreground">Si Sí:</label>
                <Select
                  value={step.conditionYesBranch || "stop"}
                  onValueChange={(val) => onChange({ ...step, conditionYesBranch: val })}
                >
                  <SelectTrigger data-testid={`select-yes-branch-${index}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stop">Detener</SelectItem>
                    <SelectItem value="continue">Continuar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground">Si No:</label>
                <Select
                  value={step.conditionNoBranch || "continue"}
                  onValueChange={(val) => onChange({ ...step, conditionNoBranch: val })}
                >
                  <SelectTrigger data-testid={`select-no-branch-${index}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stop">Detener</SelectItem>
                    <SelectItem value="continue">Continuar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center" data-testid={`editor-step-${index}`}>
      {index > 0 && (
        <ArrowDown className="w-4 h-4 text-muted-foreground mb-1" />
      )}
      <Card className="p-4 w-full max-w-md">
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <span className="text-xs font-medium" style={{ color: config.color }}>
            {config.label}
          </span>
          <div className="flex items-center gap-1">
            <Select
              value={step.type}
              onValueChange={(val) => onChange({ ...step, type: val as CampaignStep["type"] })}
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
            {totalSteps > 1 && (
              <Button size="icon" variant="ghost" onClick={onRemove} data-testid={`button-remove-step-${index}`}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
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
            className="resize-none text-[13px]"
            data-testid={`textarea-body-${index}`}
          />
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[11px] text-muted-foreground mr-1">Variables:</span>
            {TEMPLATE_VARIABLES.map((v) => (
              <Badge
                key={v}
                variant="secondary"
                className="text-[10px] rounded-full cursor-pointer"
                onClick={() => onChange({ ...step, body: step.body + " " + v })}
                data-testid={`badge-variable-${v}-${index}`}
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

export default function Campaigns() {
  const [campaignsList] = useState<Campaign[]>(mockCampaigns);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newName, setNewName] = useState("");
  const [editSteps, setEditSteps] = useState<CampaignStep[]>([]);

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setEditSteps(campaign.steps.map((s) => ({ ...s })));
  };

  const handleStepChange = (index: number, updated: CampaignStep) => {
    setEditSteps((prev) => prev.map((s, i) => (i === index ? updated : s)));
  };

  const handleRemoveStep = (index: number) => {
    setEditSteps((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddEmailStep = () => {
    const newStep: CampaignStep = {
      id: `cs-new-${Date.now()}`,
      order: editSteps.length + 1,
      type: editSteps.length === 0 ? "email" : "follow_up",
      delayDays: 0,
      subject: "",
      body: "",
      sent: 0,
      opened: 0,
      replied: 0,
      bounced: 0,
    };
    setEditSteps((prev) => [...prev, newStep]);
  };

  const handleAddWaitStep = () => {
    const newStep: CampaignStep = {
      id: `cs-wait-${Date.now()}`,
      order: editSteps.length + 1,
      type: "wait",
      delayDays: 3,
      subject: "",
      body: "",
      sent: 0,
      opened: 0,
      replied: 0,
      bounced: 0,
    };
    setEditSteps((prev) => [...prev, newStep]);
  };

  const handleAddConditionStep = () => {
    const newStep: CampaignStep = {
      id: `cs-cond-${Date.now()}`,
      order: editSteps.length + 1,
      type: "condition",
      delayDays: 0,
      subject: "",
      body: "",
      conditionField: "replied",
      conditionYesBranch: "stop",
      conditionNoBranch: "continue",
      sent: 0,
      opened: 0,
      replied: 0,
      bounced: 0,
    };
    setEditSteps((prev) => [...prev, newStep]);
  };

  const handleCreateNew = () => {
    setShowCreateDialog(false);
    const newCampaign: Campaign = {
      id: `camp-new-${Date.now()}`,
      name: newName || "Nueva Campaña",
      status: "draft",
      steps: [
        {
          id: `cs-new-${Date.now()}-1`,
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
      identityId: "",
      listIds: [],
      createdAt: new Date().toISOString(),
    };
    setNewName("");
    handleEdit(newCampaign);
  };

  const totalEnrolled = campaignsList.reduce((sum, c) => sum + c.enrolledCount, 0);
  const totalSent = campaignsList.reduce((sum, c) => sum + c.totalSent, 0);
  const totalReplied = campaignsList.reduce((sum, c) => sum + c.totalReplied, 0);
  const avgReplyRate = totalSent > 0 ? Math.round((totalReplied / totalSent) * 100) : 0;

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-semibold text-foreground" data-testid="text-page-title">
            Campañas
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Crea y gestiona secuencias de email multicanal con flujos visuales
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} data-testid="button-create-campaign">
          <Plus className="w-4 h-4 mr-1.5" /> Nueva Campaña
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-5">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Campañas</p>
          <p className="text-2xl font-semibold mt-1" data-testid="text-kpi-campaigns">{campaignsList.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Inscritos Total</p>
          <p className="text-2xl font-semibold mt-1" data-testid="text-kpi-enrolled">{totalEnrolled}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Emails Enviados</p>
          <p className="text-2xl font-semibold mt-1" data-testid="text-kpi-sent">{totalSent}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Tasa de Respuesta</p>
          <p className="text-2xl font-semibold mt-1" data-testid="text-kpi-reply-rate">{avgReplyRate}%</p>
        </Card>
      </div>

      <div className="space-y-3">
        {campaignsList.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} onEdit={handleEdit} />
        ))}
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva Campaña</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-[13px] font-medium">Nombre de la campaña</label>
              <Input
                placeholder="Ej: Outreach Hoteles Q2"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="mt-1.5"
                data-testid="input-new-campaign-name"
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

      <Dialog open={!!editingCampaign} onOpenChange={(open) => !open && setEditingCampaign(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCampaign?.name || "Editar Campaña"}
            </DialogTitle>
          </DialogHeader>
          {editingCampaign && (
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-[13px] font-medium">Nombre</label>
                <Input
                  value={editingCampaign.name}
                  onChange={(e) =>
                    setEditingCampaign({ ...editingCampaign, name: e.target.value })
                  }
                  className="mt-1.5"
                  data-testid="input-edit-campaign-name"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <h3 className="text-[13px] font-semibold">Flujo de la campaña</h3>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddEmailStep}
                      data-testid="button-add-email-step"
                    >
                      <MailPlus className="w-3.5 h-3.5 mr-1" /> Email
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddWaitStep}
                      data-testid="button-add-wait-step"
                    >
                      <Timer className="w-3.5 h-3.5 mr-1" /> Espera
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddConditionStep}
                      data-testid="button-add-condition-step"
                    >
                      <GitBranch className="w-3.5 h-3.5 mr-1" /> Condición
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-0">
                  {editSteps.map((step, idx) => (
                    <StepEditor
                      key={step.id}
                      step={step}
                      index={idx}
                      totalSteps={editSteps.length}
                      onChange={(updated) => handleStepChange(idx, updated)}
                      onRemove={() => handleRemoveStep(idx)}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button
                  variant="outline"
                  onClick={() => setEditingCampaign(null)}
                  data-testid="button-cancel-edit"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => setEditingCampaign(null)}
                  data-testid="button-save-campaign"
                >
                  Guardar Campaña
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
