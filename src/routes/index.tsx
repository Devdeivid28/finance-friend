import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/finance/AppShell";
import { useFinance, formatBRL, progressColor } from "@/lib/finance-store";
import { CategoryCard } from "@/components/finance/CategoryCard";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, Layers as LayersIcon, Trophy } from "lucide-react";
import { CategoryFormDialog } from "@/components/finance/CategoryFormDialog";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Finanças — Dashboard" }, { name: "description", content: "Controle financeiro pessoal mobile." }] }),
});

function Dashboard() {
  const { categories, expenses } = useFinance();
  const [openNew, setOpenNew] = useState(false);
  const navigate = Route.useNavigate();

  const now = new Date();
  const monthExpenses = useMemo(
    () => expenses.filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }),
    [expenses]
  );

  const totalMonth = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const totalLimit = categories.reduce((s, c) => s + c.limit, 0);
  const usedPct = totalLimit > 0 ? (totalMonth / totalLimit) * 100 : 0;

  const byCategory = categories.map((c) => ({
    c, total: monthExpenses.filter((e) => e.categoryId === c.id).reduce((s, e) => s + e.amount, 0),
  }));
  const top = [...byCategory].sort((a, b) => b.total - a.total)[0];

  return (
    <AppShell title="Olá 👋">
      <section className="card-soft p-5 mb-5" style={{
        background: "linear-gradient(135deg, var(--color-primary), color-mix(in oklab, var(--color-primary) 60%, #000))",
        color: "var(--color-primary-foreground)"
      }}>
        <p className="text-xs uppercase tracking-wide opacity-80">Total gasto no mês</p>
        <p className="text-3xl font-bold mt-1">{formatBRL(totalMonth)}</p>
        <div className="mt-4 h-2 rounded-full bg-white/20 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500 bg-white"
               style={{ width: `${Math.min(100, usedPct)}%` }} />
        </div>
        <p className="text-xs mt-2 opacity-90">{usedPct.toFixed(0)}% do limite total ({formatBRL(totalLimit)})</p>
      </section>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <Stat icon={<LayersIcon className="h-4 w-4" />} label="Categorias" value={String(categories.length)} />
        <Stat icon={<TrendingUp className="h-4 w-4" />} label="Uso do limite"
              value={`${usedPct.toFixed(0)}%`} valueStyle={{ color: progressColor(usedPct) }} />
        <div className="col-span-2">
          <Stat icon={<Trophy className="h-4 w-4" />} label="Maior gasto"
                value={top && top.total > 0 ? `${top.c.icon} ${top.c.name}` : "—"}
                hint={top && top.total > 0 ? formatBRL(top.total) : undefined} />
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold">Categorias</h2>
        <Button size="sm" variant="ghost" onClick={() => setOpenNew(true)} className="rounded-full">
          <Plus className="h-4 w-4" /> Nova
        </Button>
      </div>

      <div className="space-y-3">
        {categories.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">Nenhuma categoria. Crie a primeira!</p>
        )}
        {categories.map((c) => (
          <CategoryCard key={c.id} category={c}
            expenses={monthExpenses.filter((e) => e.categoryId === c.id)}
            onClick={() => navigate({ to: "/categoria/$id", params: { id: c.id } })} />
        ))}
      </div>

      <CategoryFormDialog open={openNew} onOpenChange={setOpenNew} />
    </AppShell>
  );
}

function Stat({ icon, label, value, hint, valueStyle }: { icon: React.ReactNode; label: string; value: string; hint?: string; valueStyle?: React.CSSProperties }) {
  return (
    <div className="card-soft p-4">
      <div className="flex items-center gap-1.5 text-muted-foreground text-xs">{icon}{label}</div>
      <p className="text-lg font-semibold mt-1 truncate" style={valueStyle}>{value}</p>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
