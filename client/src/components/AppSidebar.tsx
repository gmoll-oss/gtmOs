import { useLocation, Link } from "wouter";
import {
  LayoutDashboard,
  Database,
  GitBranch,
  Inbox,
  BarChart3,
  Sun,
  Moon,
  Globe,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useRegionContext } from "@/contexts/RegionContext";
import { useState, useRef, useEffect } from "react";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/database", label: "Hotel Database", icon: Database },
  { path: "/cadences", label: "Cadencias", icon: GitBranch },
  { path: "/unibox", label: "Unibox", icon: Inbox },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
];

const flagCodes: Record<string, string> = {
  ES: "ES",
  MX: "MX",
  CO: "CO",
  PT: "PT",
};

export function AppSidebar() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { region, setRegion, currentZone, allZones } = useRegionContext();
  const [zoneOpen, setZoneOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setZoneOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path: string) => {
    if (path === "/") return location === "/";
    return location.startsWith(path);
  };

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-[240px] bg-sidebar border-r border-sidebar-border flex flex-col z-50"
      data-testid="sidebar"
    >
      <div className="p-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
          F
        </div>
        <div>
          <div className="text-foreground font-semibold text-sm tracking-tight">GTM Cockpit</div>
          <div className="text-muted-foreground text-xs">Fideltour</div>
        </div>
      </div>

      <div className="px-3 mb-2" ref={dropdownRef}>
        <button
          onClick={() => setZoneOpen(!zoneOpen)}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-background/60 border border-border text-sm transition-colors hover:bg-accent cursor-pointer"
          data-testid="button-zone-selector"
        >
          <Globe className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="flex-1 text-left text-foreground text-xs font-medium truncate">
            {currentZone ? currentZone.name : "Todas las Regiones"}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${zoneOpen ? "rotate-180" : ""}`} />
        </button>
        {zoneOpen && (
          <div className="mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50 relative">
            <button
              onClick={() => { setRegion("todas"); setZoneOpen(false); }}
              className={`flex items-center gap-2 w-full px-3 py-2 text-xs transition-colors cursor-pointer ${
                region === "todas" ? "bg-primary/15 text-primary font-medium" : "text-foreground hover:bg-accent"
              }`}
              data-testid="zone-option-todas"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Todas las Regiones</span>
            </button>
            {allZones.map((z) => (
              <button
                key={z.id}
                onClick={() => { setRegion(z.id); setZoneOpen(false); }}
                className={`flex items-center gap-2 w-full px-3 py-2 text-xs transition-colors cursor-pointer ${
                  region === z.id ? "bg-primary/15 text-primary font-medium" : "text-foreground hover:bg-accent"
                }`}
                data-testid={`zone-option-${z.id}`}
              >
                <span className="text-[10px] font-bold text-primary bg-primary/10 rounded px-1 py-0.5 leading-none">{flagCodes[z.flag]}</span>
                <div className="flex-1 text-left">
                  <span>{z.name}</span>
                  <span className="text-muted-foreground ml-1.5">- {z.ambassador.name}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link key={item.path} href={item.path}>
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
              >
                <item.icon className="w-[18px] h-[18px]" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {currentZone && (
        <div className="px-3 pb-2">
          <div className="px-3 py-2.5 rounded-lg bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0">
                {currentZone.ambassador.initials}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{currentZone.ambassador.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{currentZone.ambassador.role}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
          data-testid="button-theme-toggle"
        >
          {theme === "dark" ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
          <span className="text-sm font-medium">{theme === "dark" ? "Modo Claro" : "Modo Oscuro"}</span>
        </button>
      </div>
    </aside>
  );
}
