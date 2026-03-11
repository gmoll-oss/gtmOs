"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Inbox,
  Search,
  List,
  Users,
  Building2,
  Send,
  BarChart3,
  UserCircle,
  Bot,
  Plug,
  Settings,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const mainNavItems = [
  { path: "/", label: "Actividad", icon: Activity },
  { path: "/inbox", label: "Inbox", icon: Inbox },
  { path: "/find", label: "Buscar y Enriquecer", icon: Search },
  { path: "/lists", label: "Listas", icon: List },
  { path: "/contacts", label: "Contactos", icon: Users },
  { path: "/companies", label: "Empresas", icon: Building2 },
  { path: "/campaigns", label: "Campañas", icon: Send },
  { path: "/analytics", label: "Analíticas", icon: BarChart3 },
];

const settingsNavItems = [
  { path: "/identities", label: "Identidades", icon: UserCircle },
  { path: "/playbook", label: "AI Playbook", icon: Bot },
  { path: "/integrations", label: "Integraciones", icon: Plug },
  { path: "/settings", label: "Configuración", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const renderNavItem = (item: typeof mainNavItems[0]) => {
    const active = isActive(item.path);
    return (
      <Link key={item.path} href={item.path}>
        <div
          className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
            active
              ? "bg-sidebar-primary/20 text-sidebar-primary"
              : "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          }`}
          data-testid={`nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
        >
          <item.icon className="w-4 h-4" />
          <span className="text-[13px] font-medium">{item.label}</span>
        </div>
      </Link>
    );
  };

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-[220px] bg-sidebar border-r border-sidebar-border flex flex-col z-50"
      data-testid="sidebar"
    >
      <div className="p-4 pb-3">
        <img src="/logo-fideltour.png" alt="Fideltour" className="h-6 brightness-0 invert" data-testid="img-logo" />
      </div>

      <nav className="flex-1 px-2 py-1 space-y-0.5 overflow-y-auto">
        {mainNavItems.map(renderNavItem)}
        <div className="border-t border-sidebar-border my-2" />
        {settingsNavItems.map(renderNavItem)}
      </nav>

      <div className="px-3 pb-2">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors cursor-pointer"
          data-testid="button-theme-toggle"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          <span className="text-[12px] font-medium">{theme === "dark" ? "Modo Claro" : "Modo Oscuro"}</span>
        </button>
      </div>
    </aside>
  );
}
