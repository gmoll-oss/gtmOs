import { useState } from "react";
import { Plus, Mail, Linkedin, MessageCircle, ClipboardList, Moon, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cadences } from "@/lib/mockData";
import type { CadenceStep } from "@/lib/mockData";

function stepIcon(type: string) {
  switch (type) {
    case "email": return <Mail className="w-3.5 h-3.5 text-blue-400" />;
    case "linkedin": return <Linkedin className="w-3.5 h-3.5 text-sky-400" />;
    case "whatsapp": return <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />;
    case "task": return <ClipboardList className="w-3.5 h-3.5 text-amber-400" />;
    case "hibernate": return <Moon className="w-3.5 h-3.5 text-gray-400" />;
    default: return <Mail className="w-3.5 h-3.5 text-[#9CA3AF]" />;
  }
}

function statusDot(status: string) {
  switch (status) {
    case "active": return "bg-[#10B981]";
    case "paused": return "bg-[#F59E0B]";
    case "draft": return "bg-[#6B7280]";
    default: return "bg-[#6B7280]";
  }
}

function StepCard({ step, isLast }: { step: CadenceStep; isLast: boolean }) {
  return (
    <div className="relative">
      <div className="flex items-start gap-3">
        {!isLast && <div className="absolute left-[15px] top-10 bottom-0 w-[1px] bg-[#2A2D3E]" />}
        <div className="w-[30px] h-[30px] rounded-lg bg-[#0F1117] border border-[#2A2D3E] flex items-center justify-center flex-shrink-0 z-10">
          {stepIcon(step.type)}
        </div>
        <div className="flex-1 pb-4">
          <Card className="bg-[#0F1117] border-[#2A2D3E] p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#6366F1]/15 text-[#818CF8]">Día {step.day}</span>
                <span className="text-xs font-medium text-[#E5E7EB]">{step.description}</span>
              </div>
              {step.sent !== undefined && (
                <div className="flex items-center gap-3 text-[10px] text-[#6B7280]">
                  {step.sent !== undefined && <span>Env: {step.sent}</span>}
                  {step.opened !== undefined && <span>Abiertos: {step.opened}</span>}
                  {step.replied !== undefined && <span className="text-[#10B981]">Resp: {step.replied}</span>}
                </div>
              )}
            </div>
            {step.conditionField && (
              <div className="mt-2 pl-2 border-l-2 border-[#2A2D3E] space-y-1">
                {step.conditionYes && (
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className="text-[#10B981] font-medium">SI</span>
                    <ChevronRight className="w-2.5 h-2.5 text-[#6B7280]" />
                    <span className="text-[#9CA3AF]">{step.conditionYes}</span>
                  </div>
                )}
                {step.conditionNo && (
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className="text-[#EF4444] font-medium">NO</span>
                    <ChevronRight className="w-2.5 h-2.5 text-[#6B7280]" />
                    <span className="text-[#9CA3AF]">{step.conditionNo}</span>
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
      <h1 className="text-xl font-semibold text-[#F9FAFB] mb-5" data-testid="text-page-title">Cadencias</h1>
      <div className="grid grid-cols-3 gap-5 h-[calc(100%-60px)]">
        <div className="col-span-1 space-y-3 overflow-y-auto pr-1">
          <Button
            variant="outline"
            className="w-full bg-[#6366F1]/10 border-[#6366F1]/30 text-[#818CF8] text-xs gap-1.5 justify-center"
            data-testid="button-new-cadence"
          >
            <Plus className="w-3.5 h-3.5" /> Nueva Cadencia
          </Button>

          {cadences.map((cadence) => (
            <Card
              key={cadence.id}
              className={`p-4 cursor-pointer transition-colors ${
                selectedCadence.id === cadence.id
                  ? "bg-[#1A1D27] border-[#6366F1]/40"
                  : "bg-[#1A1D27] border-[#2A2D3E] hover:border-[#3A3D4E]"
              }`}
              onClick={() => setSelectedCadence(cadence)}
              data-testid={`card-cadence-${cadence.id}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${statusDot(cadence.status)}`} />
                <span className="text-sm font-medium text-[#F9FAFB]">{cadence.name}</span>
              </div>
              <div className="flex items-center gap-4 text-[10px] text-[#6B7280]">
                <span>{cadence.leadsCount} leads</span>
                <span>{cadence.responseRate}% respuesta</span>
                <span className="capitalize">{cadence.status === "active" ? "Activa" : cadence.status === "paused" ? "Pausada" : "Borrador"}</span>
              </div>
            </Card>
          ))}
        </div>

        <div className="col-span-2 overflow-y-auto">
          <Card className="bg-[#1A1D27] border-[#2A2D3E] p-5 h-full">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${statusDot(selectedCadence.status)}`} />
                  <h2 className="text-base font-semibold text-[#F9FAFB]">{selectedCadence.name}</h2>
                </div>
                <p className="text-xs text-[#6B7280] mt-1">
                  {selectedCadence.leadsCount} leads | {selectedCadence.responseRate}% tasa de respuesta | {selectedCadence.steps.length} pasos
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="bg-transparent border-[#2A2D3E] text-[#9CA3AF] text-[11px]">
                  Editar
                </Button>
                <Button variant="outline" size="sm" className="bg-transparent border-[#2A2D3E] text-[#9CA3AF] text-[11px]">
                  Duplicar
                </Button>
              </div>
            </div>

            <div className="space-y-0">
              {selectedCadence.steps.map((step, i) => (
                <StepCard key={i} step={step} isLast={i === selectedCadence.steps.length - 1} />
              ))}
            </div>

            <div className="mt-4 p-3 rounded-lg bg-[#0F1117] border border-[#2A2D3E]">
              <div className="flex items-center justify-between text-xs text-[#6B7280]">
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
