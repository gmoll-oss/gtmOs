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
        <img src="/logo-fideltour.png" alt="Fideltour" className="h-7 brightness-0 invert" data-testid="img-logo" />
        <div className="text-sidebar-foreground/50 text-[10px] font-medium uppercase tracking-widest">GTM Cockpit</div>
      </div>

      <div className="px-3 mb-2" ref={dropdownRef}>
        <button
          onClick={() => setZoneOpen(!zoneOpen)}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-sidebar-accent border border-sidebar-border text-sm transition-colors cursor-pointer"
          data-testid="button-zone-selector"
        >
          <Globe className="w-4 h-4 text-sidebar-primary flex-shrink-0" />
          <span className="flex-1 text-left text-sidebar-foreground text-xs font-medium truncate">
            {currentZone ? currentZone.name : "Todas las Regiones"}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 text-sidebar-foreground/50 transition-transform ${zoneOpen ? "rotate-180" : ""}`} />
        </button>
        {zoneOpen && (
          <div className="mt-1 bg-sidebar-accent border border-sidebar-border rounded-lg shadow-lg overflow-hidden z-50 relative">
            <button
              onClick={() => { setRegion("todas"); setZoneOpen(false); }}
              className={`flex items-center gap-2 w-full px-3 py-2 text-xs transition-colors cursor-pointer ${
                region === "todas" ? "bg-sidebar-primary/20 text-sidebar-primary font-medium" : "text-sidebar-foreground/80 hover:bg-sidebar-primary/10"
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
                  region === z.id ? "bg-sidebar-primary/20 text-sidebar-primary font-medium" : "text-sidebar-foreground/80 hover:bg-sidebar-primary/10"
                }`}
                data-testid={`zone-option-${z.id}`}
              >
                <span className="text-[10px] font-bold text-sidebar-primary bg-sidebar-primary/15 rounded px-1 py-0.5 leading-none">{flagCodes[z.flag]}</span>
                <div className="flex-1 text-left">
                  <span>{z.name}</span>
                  <span className="text-sidebar-foreground/40 ml-1.5">- {z.ambassador.name}</span>
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
                    ? "bg-sidebar-primary/20 text-sidebar-primary"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
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
          <div className="px-3 py-2.5 rounded-lg bg-sidebar-primary/10 border border-sidebar-primary/15">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-[10px] font-bold text-sidebar-primary flex-shrink-0">
                {currentZone.ambassador.initials}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-sidebar-foreground truncate">{currentZone.ambassador.name}</p>
                <p className="text-[10px] text-sidebar-foreground/50 truncate">{currentZone.ambassador.role}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors cursor-pointer"
          data-testid="button-theme-toggle"
        >
          {theme === "dark" ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
          <span className="text-sm font-medium">{theme === "dark" ? "Modo Claro" : "Modo Oscuro"}</span>
        </button>
      </div>
    </aside>
  );
}
