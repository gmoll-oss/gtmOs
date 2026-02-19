import { useState } from "react";
import { useLocation } from "wouter";
import { Search, RotateCcw, Upload, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRegionContext } from "@/contexts/RegionContext";
import { getHotelsByZone } from "@/lib/zoneFilters";

const categories = ["3", "4", "5", "GL"];
const types = ["Boutique", "Urban", "Resort", "Rural"];

function statusBadge(status: string) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    new: { bg: "bg-blue-500/15", text: "text-blue-600 dark:text-blue-400", label: "Nuevo" },
    in_cadence: { bg: "bg-purple-500/15", text: "text-purple-600 dark:text-purple-400", label: "En Cadencia" },
    nurturing: { bg: "bg-amber-500/15", text: "text-amber-600 dark:text-amber-400", label: "Nurturing" },
    sql: { bg: "bg-emerald-500/15", text: "text-emerald-600 dark:text-emerald-400", label: "SQL" },
    hibernated: { bg: "bg-gray-500/15", text: "text-gray-600 dark:text-gray-400", label: "Hibernado" },
    disqualified: { bg: "bg-red-500/15", text: "text-red-600 dark:text-red-400", label: "Descartado" },
  };
  const s = map[status] || map.new;
  return <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${s.bg} ${s.text}`}>{s.label}</span>;
}

function icpBar(score: number) {
  const color = score >= 85 ? "#10B981" : score >= 70 ? "#F59E0B" : "#EF4444";
  return (
    <div className="flex items-center gap-2">
      <div className="w-14 h-1.5 rounded-full bg-background">
        <div className="h-1.5 rounded-full" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-medium" style={{ color }}>{score}</span>
    </div>
  );
}

function cvBadge(value: number) {
  const color = value >= 50 ? "#10B981" : value >= 30 ? "#F59E0B" : "currentColor";
  return <span className={`text-xs font-medium ${value < 30 ? "text-muted-foreground" : ""}`} style={value >= 30 ? { color } : undefined}>{value}</span>;
}

export default function HotelDatabase() {
  const [, navigate] = useLocation();
  const { region, currentZone } = useRegionContext();
  const zoneHotels = getHotelsByZone(region);
  const availableCountries = Array.from(new Set(zoneHotels.map((h) => h.country))).sort();

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

  const filtered = zoneHotels.filter((h) => {
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
          <h1 className="text-xl font-semibold text-foreground" data-testid="text-page-title">
            Hotel Database {currentZone ? `- ${currentZone.name}` : ""}
          </h1>
          <span className="text-xs font-medium bg-card text-muted-foreground px-2.5 py-1 rounded-md border border-border">{zoneHotels.length} hoteles</span>
        </div>
        <Button variant="outline" className="text-xs gap-1.5" data-testid="button-import">
          <Upload className="w-3.5 h-3.5" />
          Importar
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-3 flex-wrap">
          {region === "todas" && (
            <>
              <div className="relative">
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="appearance-none bg-background border border-border text-foreground text-xs rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-primary"
                  data-testid="select-country"
                >
                  <option value="Todos">País</option>
                  {availableCountries.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              </div>
              <div className="h-5 w-[1px] bg-border" />
            </>
          )}

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider mr-1">Cat:</span>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => toggleCategory(c)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-md border transition-colors ${
                  selectedCategories.includes(c)
                    ? "bg-primary/15 border-primary/30 text-primary"
                    : "bg-background border-border text-muted-foreground hover:text-foreground"
                }`}
                data-testid={`filter-cat-${c}`}
              >
                {c === "GL" ? "GL" : `${c}\u2605`}
              </button>
            ))}
          </div>

          <div className="h-5 w-[1px] bg-border" />

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider mr-1">Tipo:</span>
            {types.map((t) => (
              <button
                key={t}
                onClick={() => toggleType(t)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-md border transition-colors ${
                  selectedTypes.includes(t)
                    ? "bg-primary/15 border-primary/30 text-primary"
                    : "bg-background border-border text-muted-foreground hover:text-foreground"
                }`}
                data-testid={`filter-type-${t.toLowerCase()}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="h-5 w-[1px] bg-border" />

          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar hotel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border text-foreground text-xs rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
              data-testid="input-search"
            />
          </div>

          <button onClick={resetFilters} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1" data-testid="button-reset">
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>
      </Card>

      {selectedRows.length > 0 && (
        <Card className="bg-primary/10 border-primary/25 p-3">
          <div className="flex items-center gap-4">
            <span className="text-xs text-primary font-medium">{selectedRows.length} seleccionados</span>
            <Button variant="outline" size="sm" className="text-[11px]">
              Añadir a cadencia <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
            <Button variant="outline" size="sm" className="text-[11px]">
              Enriquecer con AI
            </Button>
            <Button variant="outline" size="sm" className="text-[11px]">
              Exportar
            </Button>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs" data-testid="hotel-table">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 w-10">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    className="rounded border-border bg-background text-primary focus:ring-primary w-3.5 h-3.5"
                    data-testid="checkbox-select-all"
                  />
                </th>
                <th className="text-left p-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Hotel</th>
                <th className="text-left p-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Ubicación</th>
                <th className="text-left p-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Cat</th>
                <th className="text-left p-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Hab.</th>
                <th className="text-left p-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">PMS</th>
                <th className="text-left p-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">ICP</th>
                <th className="text-left p-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">CV</th>
                <th className="text-left p-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Estado</th>
                <th className="text-left p-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Último</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((hotel) => (
                <tr
                  key={hotel.id}
                  className="border-b border-border/50 hover:bg-background/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/lead/${hotel.id}`)}
                  data-testid={`row-hotel-${hotel.id}`}
                >
                  <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(hotel.id)}
                      onChange={() => toggleRow(hotel.id)}
                      className="rounded border-border bg-background text-primary focus:ring-primary w-3.5 h-3.5"
                    />
                  </td>
                  <td className="p-3">
                    <span className="text-foreground font-medium">{hotel.name}</span>
                  </td>
                  <td className="p-3 text-muted-foreground">{hotel.city}, {hotel.country}</td>
                  <td className="p-3 text-foreground/80">{hotel.category === "GL" ? "GL" : `${hotel.category}\u2605`}</td>
                  <td className="p-3 text-muted-foreground">{hotel.rooms}</td>
                  <td className="p-3 text-muted-foreground">{hotel.pms}</td>
                  <td className="p-3">{icpBar(hotel.icpScore)}</td>
                  <td className="p-3">{cvBadge(hotel.contactValue)}</td>
                  <td className="p-3">{statusBadge(hotel.status)}</td>
                  <td className="p-3 text-muted-foreground">{hotel.lastContact || "\u2014"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between p-3 border-t border-border">
          <span className="text-xs text-muted-foreground">Mostrando {filtered.length} de {zoneHotels.length} hoteles</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="w-7 h-7">
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            <Button variant="outline" size="icon" className="bg-primary/15 border-primary/30 w-7 h-7">
              <span className="text-xs text-primary">1</span>
            </Button>
            <Button variant="outline" size="icon" className="w-7 h-7">
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
