import { useState, useCallback } from "react";
import { Plus, Mail, Linkedin, MessageCircle, ClipboardList, Moon, ChevronRight, Pencil, Trash2, X, ArrowUp, ArrowDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cadences as initialCadences } from "@/lib/mockData";
import type { CadenceStep, Cadence } from "@/lib/mockData";
import { useRegionContext } from "@/contexts/RegionContext";

const stepTypes = [
  { value: "email" as const, label: "Email", icon: Mail, color: "text-blue-500 dark:text-blue-400" },
  { value: "linkedin" as const, label: "LinkedIn", icon: Linkedin, color: "text-sky-500 dark:text-sky-400" },
  { value: "whatsapp" as const, label: "WhatsApp", icon: MessageCircle, color: "text-emerald-500 dark:text-emerald-400" },
  { value: "task" as const, label: "Tarea", icon: ClipboardList, color: "text-amber-500 dark:text-amber-400" },
  { value: "hibernate" as const, label: "Espera", icon: Moon, color: "text-gray-500 dark:text-gray-400" },
];

function stepIcon(type: string) {
  const found = stepTypes.find((s) => s.value === type);
  if (!found) return <Mail className="w-3.5 h-3.5 text-muted-foreground" />;
  const Icon = found.icon;
  return <Icon className={`w-3.5 h-3.5 ${found.color}`} />;
}

function statusDot(status: string) {
  switch (status) {
    case "active": return "bg-emerald-500";
    case "paused": return "bg-amber-500";
    case "draft": return "bg-gray-400 dark:bg-gray-500";
    default: return "bg-gray-400 dark:bg-gray-500";
  }
}

function statusLabel(status: string) {
  switch (status) {
    case "active": return "Activa";
    case "paused": return "Pausada";
    case "draft": return "Borrador";
    default: return status;
  }
}

interface StepEditorProps {
  step?: CadenceStep;
  onSave: (step: CadenceStep) => void;
  onCancel: () => void;
  nextDay: number;
}

function StepEditor({ step, onSave, onCancel, nextDay }: StepEditorProps) {
  const [type, setType] = useState<CadenceStep["type"]>(step?.type || "email");
  const [day, setDay] = useState(step?.day || nextDay);
  const [description, setDescription] = useState(step?.description || "");

  const handleSave = () => {
    if (!description.trim()) return;
    onSave({ type, day, description: description.trim() });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" onClick={onCancel}>
      <Card className="w-[420px] p-5" onClick={(e) => e.stopPropagation()} data-testid="modal-step-editor">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">{step ? "Editar Paso" : "Nuevo Paso"}</h3>
          <Button size="icon" variant="ghost" onClick={onCancel} data-testid="button-close-step-editor">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Tipo de acción</label>
            <div className="flex gap-1.5">
              {stepTypes.map((st) => (
                <button
                  key={st.value}
                  onClick={() => setType(st.value)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    type === st.value
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "bg-background border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/50"
                  }`}
                  data-testid={`button-step-type-${st.value}`}
                >
                  <st.icon className="w-3.5 h-3.5" />
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Día</label>
            <input
              type="number"
              min={1}
              value={day}
              onChange={(e) => setDay(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 rounded-md bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary"
              data-testid="input-step-day"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Descripción</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Email de presentación corporativa"
              className="w-full px-3 py-2 rounded-md bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary"
              data-testid="input-step-description"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={onCancel} data-testid="button-cancel-step">
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSave} disabled={!description.trim()} data-testid="button-save-step">
              {step ? "Guardar" : "Añadir Paso"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

interface CadenceEditorProps {
  cadence?: Cadence;
  onSave: (name: string, status: Cadence["status"]) => void;
  onCancel: () => void;
}

function CadenceEditor({ cadence, onSave, onCancel }: CadenceEditorProps) {
  const [name, setName] = useState(cadence?.name || "");
  const [status, setStatus] = useState<Cadence["status"]>(cadence?.status || "draft");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" onClick={onCancel}>
      <Card className="w-[400px] p-5" onClick={(e) => e.stopPropagation()} data-testid="modal-cadence-editor">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">{cadence ? "Editar Cadencia" : "Nueva Cadencia"}</h3>
          <Button size="icon" variant="ghost" onClick={onCancel} data-testid="button-close-cadence-editor">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Cadencia Resorts Premium"
              className="w-full px-3 py-2 rounded-md bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary"
              data-testid="input-cadence-name"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Estado</label>
            <div className="flex gap-2">
              {(["draft", "active", "paused"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    status === s
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "bg-background border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/50"
                  }`}
                  data-testid={`button-status-${s}`}
                >
                  <div className={`w-2 h-2 rounded-full ${statusDot(s)}`} />
                  {statusLabel(s)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={onCancel} data-testid="button-cancel-cadence">
              Cancelar
            </Button>
            <Button size="sm" onClick={() => name.trim() && onSave(name.trim(), status)} disabled={!name.trim()} data-testid="button-save-cadence">
              {cadence ? "Guardar" : "Crear Cadencia"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function InteractiveStepCard({
  step,
  index,
  isLast,
  isFirst,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  step: CadenceStep;
  index: number;
  isLast: boolean;
  isFirst: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className="relative group" data-testid={`step-card-${index}`}>
      <div className="flex items-start gap-3">
        {!isLast && <div className="absolute left-[15px] top-10 bottom-0 w-[1px] bg-border" />}
        <div className="w-[30px] h-[30px] rounded-lg bg-background border border-border flex items-center justify-center flex-shrink-0 z-10">
          {stepIcon(step.type)}
        </div>
        <div className="flex-1 pb-4">
          <div className="flex items-start gap-2">
            <Card className="bg-background p-3 flex-1">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-primary/15 text-primary flex-shrink-0">Día {step.day}</span>
                  <span className="text-xs font-medium text-foreground/80 truncate">{step.description}</span>
                </div>
                {step.sent !== undefined && (
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground flex-shrink-0">
                    {step.sent !== undefined && <span>Env: {step.sent}</span>}
                    {step.opened !== undefined && <span>Abiertos: {step.opened}</span>}
                    {step.replied !== undefined && <span className="text-emerald-600 dark:text-emerald-400">Resp: {step.replied}</span>}
                  </div>
                )}
              </div>
              {step.conditionField && (
                <div className="mt-2 pl-2 border-l-2 border-border space-y-1">
                  {step.conditionYes && (
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">SI</span>
                      <ChevronRight className="w-2.5 h-2.5 text-muted-foreground" />
                      <span className="text-muted-foreground">{step.conditionYes}</span>
                    </div>
                  )}
                  {step.conditionNo && (
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <span className="text-red-600 dark:text-red-400 font-medium">NO</span>
                      <ChevronRight className="w-2.5 h-2.5 text-muted-foreground" />
                      <span className="text-muted-foreground">{step.conditionNo}</span>
                    </div>
                  )}
                </div>
              )}
            </Card>
            <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity pt-1" style={{ visibility: "visible" }}>
              <Button size="icon" variant="ghost" onClick={onMoveUp} disabled={isFirst} data-testid={`button-move-up-${index}`}>
                <ArrowUp className="w-3 h-3" />
              </Button>
              <Button size="icon" variant="ghost" onClick={onMoveDown} disabled={isLast} data-testid={`button-move-down-${index}`}>
                <ArrowDown className="w-3 h-3" />
              </Button>
              <Button size="icon" variant="ghost" onClick={onEdit} data-testid={`button-edit-step-${index}`}>
                <Pencil className="w-3 h-3" />
              </Button>
              <Button size="icon" variant="ghost" onClick={onDelete} className="text-red-500" data-testid={`button-delete-step-${index}`}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Cadences() {
  const { currentZone } = useRegionContext();
  const [allCadences, setAllCadences] = useState<Cadence[]>(initialCadences);
  const [selectedId, setSelectedId] = useState(allCadences[0]?.id);
  const [showCadenceEditor, setShowCadenceEditor] = useState(false);
  const [editingCadence, setEditingCadence] = useState<Cadence | undefined>();
  const [showStepEditor, setShowStepEditor] = useState(false);
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);

  const selectedCadence = allCadences.find((c) => c.id === selectedId) || allCadences[0];

  const handleCreateCadence = (name: string, status: Cadence["status"]) => {
    const newCadence: Cadence = {
      id: `cad-${Date.now()}`,
      name,
      status,
      leadsCount: 0,
      responseRate: 0,
      steps: [],
    };
    setAllCadences((prev) => [...prev, newCadence]);
    setSelectedId(newCadence.id);
    setShowCadenceEditor(false);
  };

  const handleEditCadence = (name: string, status: Cadence["status"]) => {
    setAllCadences((prev) =>
      prev.map((c) => (c.id === editingCadence?.id ? { ...c, name, status } : c))
    );
    setEditingCadence(undefined);
    setShowCadenceEditor(false);
  };

  const handleDeleteCadence = (id: string) => {
    setAllCadences((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      if (selectedId === id && filtered.length > 0) {
        setSelectedId(filtered[0].id);
      }
      return filtered;
    });
  };

  const updateSteps = useCallback((newSteps: CadenceStep[]) => {
    setAllCadences((prev) =>
      prev.map((c) => (c.id === selectedId ? { ...c, steps: newSteps } : c))
    );
  }, [selectedId]);

  const handleAddStep = (step: CadenceStep) => {
    const newSteps = [...selectedCadence.steps, step];
    updateSteps(newSteps);
    setShowStepEditor(false);
  };

  const handleEditStep = (step: CadenceStep) => {
    if (editingStepIndex === null) return;
    const newSteps = [...selectedCadence.steps];
    newSteps[editingStepIndex] = step;
    updateSteps(newSteps);
    setEditingStepIndex(null);
    setShowStepEditor(false);
  };

  const handleDeleteStep = (index: number) => {
    const newSteps = selectedCadence.steps.filter((_, i) => i !== index);
    updateSteps(newSteps);
  };

  const handleMoveStep = (index: number, direction: "up" | "down") => {
    const newSteps = [...selectedCadence.steps];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSteps.length) return;
    const temp = newSteps[index];
    newSteps[index] = newSteps[targetIndex];
    newSteps[targetIndex] = temp;
    updateSteps(newSteps);
  };

  const nextDay = selectedCadence.steps.length > 0
    ? selectedCadence.steps[selectedCadence.steps.length - 1].day + 2
    : 1;

  return (
    <div className="p-6 h-[calc(100vh-0px)] max-w-[1400px] mx-auto">
      <h1 className="text-xl font-semibold text-foreground mb-5" data-testid="text-page-title">
        Cadencias {currentZone ? `- ${currentZone.name}` : ""}
      </h1>
      <div className="grid grid-cols-3 gap-5 h-[calc(100%-60px)]">
        <div className="col-span-1 space-y-3 overflow-y-auto pr-1">
          <Button
            variant="outline"
            className="w-full bg-primary/10 border-primary/30 text-primary text-xs gap-1.5 justify-center"
            onClick={() => { setEditingCadence(undefined); setShowCadenceEditor(true); }}
            data-testid="button-new-cadence"
          >
            <Plus className="w-3.5 h-3.5" /> Nueva Cadencia
          </Button>

          {allCadences.map((cadence) => (
            <Card
              key={cadence.id}
              className={`p-4 cursor-pointer transition-colors ${
                selectedCadence.id === cadence.id
                  ? "border-primary/40"
                  : "hover:border-muted-foreground/30"
              }`}
              onClick={() => setSelectedId(cadence.id)}
              data-testid={`card-cadence-${cadence.id}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${statusDot(cadence.status)}`} />
                <span className="text-sm font-medium text-foreground flex-1 truncate">{cadence.name}</span>
              </div>
              <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                <span>{cadence.leadsCount} leads</span>
                <span>{cadence.responseRate}% respuesta</span>
                <span>{statusLabel(cadence.status)}</span>
              </div>
            </Card>
          ))}
        </div>

        <div className="col-span-2 overflow-y-auto">
          <Card className="p-5 h-full">
            <div className="flex items-center justify-between gap-2 mb-5">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDot(selectedCadence.status)}`} />
                  <h2 className="text-base font-semibold text-foreground truncate">{selectedCadence.name}</h2>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedCadence.leadsCount} leads | {selectedCadence.responseRate}% tasa de respuesta | {selectedCadence.steps.length} pasos
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-[11px] gap-1"
                  onClick={() => { setEditingCadence(selectedCadence); setShowCadenceEditor(true); }}
                  data-testid="button-edit-cadence"
                >
                  <Pencil className="w-3 h-3" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-[11px] gap-1 text-red-500 border-red-500/30"
                  onClick={() => handleDeleteCadence(selectedCadence.id)}
                  disabled={allCadences.length <= 1}
                  data-testid="button-delete-cadence"
                >
                  <Trash2 className="w-3 h-3" />
                  Eliminar
                </Button>
              </div>
            </div>

            {selectedCadence.steps.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Plus className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">Esta cadencia no tiene pasos</p>
                <p className="text-xs text-muted-foreground mb-4">Comienza añadiendo el primer paso del flujo</p>
                <Button
                  size="sm"
                  className="gap-1.5"
                  onClick={() => { setEditingStepIndex(null); setShowStepEditor(true); }}
                  data-testid="button-add-first-step"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Añadir Primer Paso
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-0">
                  {selectedCadence.steps.map((step, i) => (
                    <InteractiveStepCard
                      key={`${selectedCadence.id}-${i}`}
                      step={step}
                      index={i}
                      isLast={i === selectedCadence.steps.length - 1}
                      isFirst={i === 0}
                      onEdit={() => { setEditingStepIndex(i); setShowStepEditor(true); }}
                      onDelete={() => handleDeleteStep(i)}
                      onMoveUp={() => handleMoveStep(i, "up")}
                      onMoveDown={() => handleMoveStep(i, "down")}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() => { setEditingStepIndex(null); setShowStepEditor(true); }}
                  className="mt-2 w-full border-dashed gap-1.5 justify-center text-xs text-muted-foreground"
                  data-testid="button-add-step"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Añadir Paso
                </Button>

                <div className="mt-4 p-3 rounded-lg bg-background border border-border">
                  <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground flex-wrap">
                    <span>Total pasos: {selectedCadence.steps.length}</span>
                    <span>Duración: {Math.max(...selectedCadence.steps.map((s) => s.day), 0)} días</span>
                    {selectedCadence.steps.some((s) => s.replied !== undefined) && (
                      <span>Mejor paso: Día {selectedCadence.steps.reduce((best, s) => (s.replied || 0) > (best.replied || 0) ? s : best, selectedCadence.steps[0])?.day}</span>
                    )}
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>

      {showCadenceEditor && (
        <CadenceEditor
          cadence={editingCadence}
          onSave={editingCadence ? handleEditCadence : handleCreateCadence}
          onCancel={() => { setShowCadenceEditor(false); setEditingCadence(undefined); }}
        />
      )}

      {showStepEditor && (
        <StepEditor
          step={editingStepIndex !== null ? selectedCadence.steps[editingStepIndex] : undefined}
          onSave={editingStepIndex !== null ? handleEditStep : handleAddStep}
          onCancel={() => { setShowStepEditor(false); setEditingStepIndex(null); }}
          nextDay={nextDay}
        />
      )}
    </div>
  );
}
