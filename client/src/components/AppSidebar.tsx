import { useLocation, Link } from "wouter";
import {
  LayoutDashboard,
  Database,
  GitBranch,
  Inbox,
  BarChart3,
} from "lucide-react";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/database", label: "Hotel Database", icon: Database },
  { path: "/cadences", label: "Cadencias", icon: GitBranch },
  { path: "/unibox", label: "Unibox", icon: Inbox },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
];

export function AppSidebar() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location === "/";
    return location.startsWith(path);
  };

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-[240px] bg-[#0B0D14] border-r border-[#1E2235] flex flex-col z-50"
      data-testid="sidebar"
    >
      <div className="p-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#6366F1] flex items-center justify-center text-white font-bold text-lg">
          F
        </div>
        <div>
          <div className="text-[#F9FAFB] font-semibold text-sm tracking-tight">GTM Cockpit</div>
          <div className="text-[#6B7280] text-xs">Fideltour</div>
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
                    ? "bg-[#6366F1]/15 text-[#818CF8]"
                    : "text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#1A1D27]"
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

      <div className="p-4 border-t border-[#1E2235]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#1A1D27] flex items-center justify-center text-xs text-[#9CA3AF] font-medium">
            PA
          </div>
          <div>
            <div className="text-[#F9FAFB] text-xs font-medium">Pedro Atienza</div>
            <div className="text-[#6B7280] text-[11px]">SDR Manager</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
