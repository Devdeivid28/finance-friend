import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/finance/AppShell";
import { useFinance, actions, formatBRL, progressColor, Expense } from "@/lib/finance-store";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import { ExpenseFormDialog } from "@/components/finance/ExpenseFormDialog";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/categoria/$id")({
  component: CategoryDetail,
  head: () => ({ meta: [{ title: "Categoria" }] }),
});

function CategoryDetail() {
  const { id } = Route.useParams();
  const { categories, expenses } = useFinance();
  const cat = categories.find((c) => c.id === id);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [search, setSearch] = useState("");

  const list = useMemo(() => {
    return expenses
      .filter((e) => e.categoryId === id)
      .filter((e) => e.date.startsWith(month))
      .filter((e) => e.description.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [expenses, id, month, search]);

  if (!cat) {
    return (
      <AppShell title="Não encontrada">
        <Link to="/" className="text-primary text-sm">← Voltar</Link>
      </AppShell>
    );
  }

  const total = list.reduce((s, e) => s + e.amount, 0);
  const pct = cat.limit > 0 ? (total / cat.limit) * 100 : 0;

  const openNew = () => { setEditing(null); setOpen(true); };
  const openEdit = (e: Expense) => { setEditing(e); setOpen(true); };

  return (
    <AppShell
      title={`${cat.icon} ${cat.name}`}
      action={
        <Link to="/" className="p-2 -ml-2"><ArrowLeft className="h-5 w-5" /></Link>
      }
    >
      <section className="card-soft p-5 mb-4" style={{ borderLeft: `4px solid ${cat.color}` }}>
        <p className="text-xs text-muted-foreground">Gasto no período</p>
        <p className="text-2xl font-bold">{formatBRL(total)}</p>
        <p className="text-xs text-muted-foreground mt-0.5">Limite: {formatBRL(cat.limit)}</p>
        <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500"
               style={{ width: `${Math.min(100, pct)}%`, backgroundColor: progressColor(pct) }} />
        </div>
        <p className="text-xs mt-1.5 font-medium" style={{ color: progressColor(pct) }}>
          {pct.toFixed(0)}% utilizado
        </p>
      </section>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
        <Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-semibold">Gastos</h2>
        <Button size="sm" onClick={openNew} className="rounded-full"><Plus className="h-4 w-4" /> Adicionar</Button>
      </div>

      <div className="space-y-2">
        {list.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">Nenhum gasto neste período.</p>
        )}
        {list.map((e) => (
          <div key={e.id} className="card-soft p-3.5 flex items-center gap-3 fade-in">
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{e.description}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(e.date).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <p className="font-semibold">{formatBRL(e.amount)}</p>
            <div className="flex gap-1">
              <button onClick={() => openEdit(e)} className="p-1.5 rounded-full hover:bg-accent">
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => { if (confirm("Excluir gasto?")) actions.deleteExpense(e.id); }}
                className="p-1.5 rounded-full hover:bg-accent text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ExpenseFormDialog open={open} onOpenChange={setOpen} categoryId={cat.id} editing={editing} />
    </AppShell>
  );
}
