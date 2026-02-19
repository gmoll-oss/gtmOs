import { useState } from "react";
import { useLocation } from "wouter";
import { Search, RotateCcw, Upload, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { hotels } from "@/lib/mockData";

const countries = ["Todos", "Spain", "Mexico", "Colombia", "Panama", "Peru"];
const categories = ["3", "4", "5", "GL"];
const types = ["Boutique", "Urban", "Resort", "Rural"];

function statusBadge(status: string) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    new: { bg: "bg-blue-500/15", text: "text-blue-400", label: "Nuevo" },
    in_cadence: { bg: "bg-purple-500/15", text: "text-purple-400", label: "En Cadencia" },
    nurturing: { bg: "bg-amber-500/15", text: "text-amber-400", label: "Nurturing" },
    sql: { bg: "bg-emerald-500/15", text: "text-emerald-400", label: "SQL" },
    hibernated: { bg: "bg-gray-500/15", text: "text-gray-400", label: "Hibernado" },
    disqualified: { bg: "bg-red-500/15", text: "text-red-400", label: "Descartado" },
  };
  const s = map[status] || map.new;
  return <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${s.bg} ${s.text}`}>{s.label}</span>;
}

function icpBar(score: number) {
  const color = score >= 85 ? "#10B981" : score >= 70 ? "#F59E0B" : "#EF4444";
  return (
    <div className="flex items-center gap-2">
      <div className="w-14 h-1.5 rounded-full bg-[#0F1117]">
        <div className="h-1.5 rounded-full" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-medium" style={{ color }}>{score}</span>
    </div>
  );
}

function cvBadge(value: number) {
  const color = value >= 50 ? "#10B981" : value >= 30 ? "#F59E0B" : "#6B7280";
  return <span className="text-xs font-medium" style={{ color }}>{value}</span>;
}

export default function HotelDatabase() {
  const [, navigate] = useLocation();
  const [selectedCountry, setSelectedCountry] = useState("Todos");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const toggleCategory = (c: string) => {
    setSelectedCategories((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);
  };
  const toggleType = (t: string) => {
    setSelectedTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  };

  const filtered = hotels.filter((h) => {
    if (selectedCountry !== "Todos" && h.country !== selectedCountry) return false;
    if (selectedCategories.length > 0 && !selectedCategories.includes(h.category)) return false;
    if (selectedTypes.length > 0 && !selectedTypes.includes(h.type)) return false;
    if (searchQuery && !h.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const toggleRow = (id: string) => {
    setSelectedRows((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selectedRows.length === filtered.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filtered.map((h) => h.id));
    }
  };

  const resetFilters = () => {
    setSelectedCountry("Todos");
    setSelectedCategories([]);
    setSelectedTypes([]);
    setSearchQuery("");
  };

  return (
    <div className="p-6 space-y-5 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-[#F9FAFB]" data-testid="text-page-title">Hotel Database</h1>
          <span className="text-xs font-medium bg-[#1A1D27] text-[#9CA3AF] px-2.5 py-1 rounded-md border border-[#2A2D3E]">847 hoteles</span>
        </div>
        <Button variant="outline" className="bg-[#1A1D27] border-[#2A2D3E] text-[#E5E7EB] text-xs gap-1.5" data-testid="button-import">
          <Upload className="w-3.5 h-3.5" />
          Importar
        </Button>
      </div>

      <Card className="bg-[#1A1D27] border-[#2A2D3E] p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="appearance-none bg-[#0F1117] border border-[#2A2D3E] text-[#E5E7EB] text-xs rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
              data-testid="select-country"
            >
              {countries.map((c) => <option key={c} value={c}>{c === "Todos" ? "País" : c}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B7280] pointer-events-none" />
          </div>

          <div className="h-5 w-[1px] bg-[#2A2D3E]" />

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-[#6B7280] uppercase tracking-wider mr-1">Cat:</span>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => toggleCategory(c)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-md border transition-colors ${
                  selectedCategories.includes(c)
                    ? "bg-[#6366F1]/15 border-[#6366F1]/30 text-[#818CF8]"
                    : "bg-[#0F1117] border-[#2A2D3E] text-[#9CA3AF] hover:text-[#E5E7EB]"
                }`}
                data-testid={`filter-cat-${c}`}
              >
                {c === "GL" ? "GL" : `${c}\u2605`}
              </button>
            ))}
          </div>

          <div className="h-5 w-[1px] bg-[#2A2D3E]" />

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-[#6B7280] uppercase tracking-wider mr-1">Tipo:</span>
            {types.map((t) => (
              <button
                key={t}
                onClick={() => toggleType(t)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-md border transition-colors ${
                  selectedTypes.includes(t)
                    ? "bg-[#6366F1]/15 border-[#6366F1]/30 text-[#818CF8]"
                    : "bg-[#0F1117] border-[#2A2D3E] text-[#9CA3AF] hover:text-[#E5E7EB]"
                }`}
                data-testid={`filter-type-${t.toLowerCase()}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="h-5 w-[1px] bg-[#2A2D3E]" />

          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Buscar hotel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0F1117] border border-[#2A2D3E] text-[#E5E7EB] text-xs rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6366F1] placeholder:text-[#6B7280]"
              data-testid="input-search"
            />
          </div>

          <button onClick={resetFilters} className="text-xs text-[#9CA3AF] hover:text-[#E5E7EB] flex items-center gap-1" data-testid="button-reset">
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>
      </Card>

      {selectedRows.length > 0 && (
        <Card className="bg-[#6366F1]/10 border-[#6366F1]/25 p-3">
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#818CF8] font-medium">{selectedRows.length} seleccionados</span>
            <Button variant="outline" size="sm" className="bg-[#1A1D27] border-[#2A2D3E] text-[#E5E7EB] text-[11px]">
              Añadir a cadencia <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
            <Button variant="outline" size="sm" className="bg-[#1A1D27] border-[#2A2D3E] text-[#E5E7EB] text-[11px]">
              Enriquecer con AI
            </Button>
            <Button variant="outline" size="sm" className="bg-[#1A1D27] border-[#2A2D3E] text-[#E5E7EB] text-[11px]">
              Exportar
            </Button>
          </div>
        </Card>
      )}

      <Card className="bg-[#1A1D27] border-[#2A2D3E] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs" data-testid="hotel-table">
            <thead>
              <tr className="border-b border-[#2A2D3E]">
                <th className="text-left p-3 w-10">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    className="rounded border-[#2A2D3E] bg-[#0F1117] text-[#6366F1] focus:ring-[#6366F1] w-3.5 h-3.5"
                    data-testid="checkbox-select-all"
                  />
                </th>
                <th className="text-left p-3 text-[#6B7280] font-medium uppercase tracking-wider text-[10px]">Hotel</th>
                <th className="text-left p-3 text-[#6B7280] font-medium uppercase tracking-wider text-[10px]">Ubicación</th>
                <th className="text-left p-3 text-[#6B7280] font-medium uppercase tracking-wider text-[10px]">Cat</th>
                <th className="text-left p-3 text-[#6B7280] font-medium uppercase tracking-wider text-[10px]">Hab.</th>
                <th className="text-left p-3 text-[#6B7280] font-medium uppercase tracking-wider text-[10px]">PMS</th>
                <th className="text-left p-3 text-[#6B7280] font-medium uppercase tracking-wider text-[10px]">ICP</th>
                <th className="text-left p-3 text-[#6B7280] font-medium uppercase tracking-wider text-[10px]">CV</th>
                <th className="text-left p-3 text-[#6B7280] font-medium uppercase tracking-wider text-[10px]">Estado</th>
                <th className="text-left p-3 text-[#6B7280] font-medium uppercase tracking-wider text-[10px]">Último</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((hotel) => (
                <tr
                  key={hotel.id}
                  className="border-b border-[#2A2D3E]/50 hover:bg-[#0F1117]/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/lead/${hotel.id}`)}
                  data-testid={`row-hotel-${hotel.id}`}
                >
                  <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(hotel.id)}
                      onChange={() => toggleRow(hotel.id)}
                      className="rounded border-[#2A2D3E] bg-[#0F1117] text-[#6366F1] focus:ring-[#6366F1] w-3.5 h-3.5"
                    />
                  </td>
                  <td className="p-3">
                    <span className="text-[#F9FAFB] font-medium">{hotel.name}</span>
                  </td>
                  <td className="p-3 text-[#9CA3AF]">{hotel.city}, {hotel.country}</td>
                  <td className="p-3 text-[#E5E7EB]">{hotel.category === "GL" ? "GL" : `${hotel.category}\u2605`}</td>
                  <td className="p-3 text-[#9CA3AF]">{hotel.rooms}</td>
                  <td className="p-3 text-[#9CA3AF]">{hotel.pms}</td>
                  <td className="p-3">{icpBar(hotel.icpScore)}</td>
                  <td className="p-3">{cvBadge(hotel.contactValue)}</td>
                  <td className="p-3">{statusBadge(hotel.status)}</td>
                  <td className="p-3 text-[#6B7280]">{hotel.lastContact || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between p-3 border-t border-[#2A2D3E]">
          <span className="text-xs text-[#6B7280]">Mostrando 1-{filtered.length} de 847 resultados</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="bg-[#0F1117] border-[#2A2D3E] w-7 h-7">
              <ChevronLeft className="w-3.5 h-3.5 text-[#9CA3AF]" />
            </Button>
            <Button variant="outline" size="icon" className="bg-[#6366F1]/15 border-[#6366F1]/30 w-7 h-7">
              <span className="text-xs text-[#818CF8]">1</span>
            </Button>
            <Button variant="outline" size="icon" className="bg-[#0F1117] border-[#2A2D3E] w-7 h-7">
              <span className="text-xs text-[#9CA3AF]">2</span>
            </Button>
            <Button variant="outline" size="icon" className="bg-[#0F1117] border-[#2A2D3E] w-7 h-7">
              <span className="text-xs text-[#9CA3AF]">3</span>
            </Button>
            <Button variant="outline" size="icon" className="bg-[#0F1117] border-[#2A2D3E] w-7 h-7">
              <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
