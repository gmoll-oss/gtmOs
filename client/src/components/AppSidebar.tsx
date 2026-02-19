import { useLocation, Link } from "wouter";
import {
  LayoutDashboard,
  Database,
  GitBranch,
  Inbox,
  BarChart3,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/database", label: "Hotel Database", icon: Database },
  { path: "/cadences", label: "Cadencias", icon: GitBranch },
  { path: "/unibox", label: "Unibox", icon: Inbox },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();

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
