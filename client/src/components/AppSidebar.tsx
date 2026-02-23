import { useLocation, Link } from "wouter";
import {
  LayoutDashboard,
  Search,
  Users,
  Mail,
  Settings,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/discovery", label: "Discovery", icon: Search },
  { path: "/leads", label: "Leads", icon: Users },
  { path: "/sequences", label: "Secuencias", icon: Mail },
  { path: "/settings", label: "Configuración", icon: Settings },
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
      <div className="p-5">
        <img src="/logo-fideltour.png" alt="Fideltour" className="h-7 brightness-0 invert" data-testid="img-logo" />
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
                    : "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent"
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
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors cursor-pointer"
          data-testid="button-theme-toggle"
        >
          {theme === "dark" ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
          <span className="text-sm font-medium">{theme === "dark" ? "Modo Claro" : "Modo Oscuro"}</span>
        </button>
      </div>
    </aside>
  );
}
