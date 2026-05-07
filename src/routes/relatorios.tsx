import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/finance/AppShell";
import { useFinance, formatBRL } from "@/lib/finance-store";
import { Input } from "@/components/ui/input";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export const Route = createFileRoute("/relatorios")({
  component: ReportsPage,
  head: () => ({ meta: [{ title: "Relatórios" }] }),
});

function ReportsPage() {
  const { categories, expenses } = useFinance();
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [catFilter, setCatFilter] = useState<string>("all");

  const filtered = useMemo(() => expenses
    .filter((e) => e.date.startsWith(month))
    .filter((e) => catFilter === "all" || e.categoryId === catFilter),
    [expenses, month, catFilter]);

  const totals = categories.map((c) => ({
    c, total: filtered.filter((e) => e.categoryId === c.id).reduce((s, e) => s + e.amount, 0),
  })).filter((x) => x.total > 0);

  const total = totals.reduce((s, x) => s + x.total, 0);

  const doughnut = {
    labels: totals.map((x) => x.c.name),
    datasets: [{
      data: totals.map((x) => x.total),
      backgroundColor: totals.map((x) => x.c.color),
      borderWidth: 0,
    }],
  };

  const bar = {
    labels: totals.map((x) => x.c.name),
    datasets: [{
      label: "Gastos",
      data: totals.map((x) => x.total),
      backgroundColor: totals.map((x) => x.c.color),
      borderRadius: 8,
    }],
  };

  return (
    <AppShell title="Relatórios">
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
        <select className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
          <option value="all">Todas categorias</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <section className="card-soft p-5 mb-4 text-center">
        <p className="text-xs text-muted-foreground uppercase">Total no período</p>
        <p className="text-3xl font-bold mt-1">{formatBRL(total)}</p>
      </section>

      {totals.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">Sem dados para exibir.</p>
      ) : (
        <>
          <section className="card-soft p-4 mb-4">
            <h3 className="text-sm font-semibold mb-3">Distribuição</h3>
            <div className="max-w-[260px] mx-auto">
              <Doughnut data={doughnut} options={{ plugins: { legend: { position: "bottom", labels: { boxWidth: 12 } } } }} />
            </div>
          </section>

          <section className="card-soft p-4">
            <h3 className="text-sm font-semibold mb-3">Por categoria</h3>
            <Bar data={bar} options={{
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } },
            }} />
          </section>
        </>
      )}
    </AppShell>
  );
}
