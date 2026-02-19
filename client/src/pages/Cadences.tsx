import { useState } from "react";
import { Plus, Mail, Linkedin, MessageCircle, ClipboardList, Moon, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cadences } from "@/lib/mockData";
import type { CadenceStep } from "@/lib/mockData";

function stepIcon(type: string) {
  switch (type) {
    case "email": return <Mail className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />;
    case "linkedin": return <Linkedin className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />;
    case "whatsapp": return <MessageCircle className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />;
    case "task": return <ClipboardList className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />;
    case "hibernate": return <Moon className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />;
    default: return <Mail className="w-3.5 h-3.5 text-muted-foreground" />;
  }
}

function statusDot(status: string) {
  switch (status) {
    case "active": return "bg-emerald-500";
    case "paused": return "bg-amber-500";
    case "draft": return "bg-gray-400 dark:bg-gray-500";
    default: return "bg-gray-400 dark:bg-gray-500";
  }
}

function StepCard({ step, isLast }: { step: CadenceStep; isLast: boolean }) {
  return (
    <div className="relative">
      <div className="flex items-start gap-3">
        {!isLast && <div className="absolute left-[15px] top-10 bottom-0 w-[1px] bg-border" />}
        <div className="w-[30px] h-[30px] rounded-lg bg-background border border-border flex items-center justify-center flex-shrink-0 z-10">
          {stepIcon(step.type)}
        </div>
        <div className="flex-1 pb-4">
          <Card className="bg-background p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-primary/15 text-primary">Día {step.day}</span>
                <span className="text-xs font-medium text-foreground/80">{step.description}</span>
              </div>
              {step.sent !== undefined && (
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
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
        </div>
      </div>
    </div>
  );
}

export default function Cadences() {
  const [selectedCadence, setSelectedCadence] = useState(cadences[0]);

  return (
    <div className="p-6 h-[calc(100vh-0px)] max-w-[1400px] mx-auto">
      <h1 className="text-xl font-semibold text-foreground mb-5" data-testid="text-page-title">Cadencias</h1>
      <div className="grid grid-cols-3 gap-5 h-[calc(100%-60px)]">
        <div className="col-span-1 space-y-3 overflow-y-auto pr-1">
          <Button
            variant="outline"
            className="w-full bg-primary/10 border-primary/30 text-primary text-xs gap-1.5 justify-center"
            data-testid="button-new-cadence"
          >
            <Plus className="w-3.5 h-3.5" /> Nueva Cadencia
          </Button>

          {cadences.map((cadence) => (
            <Card
              key={cadence.id}
              className={`p-4 cursor-pointer transition-colors ${
                selectedCadence.id === cadence.id
                  ? "border-primary/40"
                  : "hover:border-muted-foreground/30"
              }`}
              onClick={() => setSelectedCadence(cadence)}
              data-testid={`card-cadence-${cadence.id}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${statusDot(cadence.status)}`} />
                <span className="text-sm font-medium text-foreground">{cadence.name}</span>
              </div>
              <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                <span>{cadence.leadsCount} leads</span>
                <span>{cadence.responseRate}% respuesta</span>
                <span className="capitalize">{cadence.status === "active" ? "Activa" : cadence.status === "paused" ? "Pausada" : "Borrador"}</span>
              </div>
            </Card>
          ))}
        </div>

        <div className="col-span-2 overflow-y-auto">
          <Card className="p-5 h-full">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${statusDot(selectedCadence.status)}`} />
                  <h2 className="text-base font-semibold text-foreground">{selectedCadence.name}</h2>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedCadence.leadsCount} leads | {selectedCadence.responseRate}% tasa de respuesta | {selectedCadence.steps.length} pasos
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-[11px]">
                  Editar
                </Button>
                <Button variant="outline" size="sm" className="text-[11px]">
                  Duplicar
                </Button>
              </div>
            </div>

            <div className="space-y-0">
              {selectedCadence.steps.map((step, i) => (
                <StepCard key={i} step={step} isLast={i === selectedCadence.steps.length - 1} />
              ))}
            </div>

            <div className="mt-4 p-3 rounded-lg bg-background border border-border">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Total pasos: {selectedCadence.steps.length}</span>
                <span>Duración: {selectedCadence.steps[selectedCadence.steps.length - 1]?.day || 0} días</span>
                <span>Mejor paso: Día {selectedCadence.steps.reduce((best, s) => (s.replied || 0) > (best.replied || 0) ? s : best, selectedCadence.steps[0])?.day}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
