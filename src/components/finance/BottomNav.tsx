import { Link, useLocation } from "@tanstack/react-router";
import { Home, Layers, BarChart3, Settings } from "lucide-react";

const items = [
  { to: "/", label: "Início", icon: Home },
  { to: "/categorias", label: "Categorias", icon: Layers },
  { to: "/relatorios", label: "Relatórios", icon: BarChart3 },
  { to: "/ajustes", label: "Ajustes", icon: Settings },
];

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 glass-nav border-t border-border">
      <div className="max-w-md mx-auto grid grid-cols-4 px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link key={to} to={to}
              className={`flex flex-col items-center gap-0.5 py-2 rounded-xl transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}>
              <Icon className={`h-5 w-5 ${active ? "scale-110" : ""} transition-transform`} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
