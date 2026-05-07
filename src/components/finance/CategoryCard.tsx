import { Category, Expense, formatBRL, progressColor } from "@/lib/finance-store";
import { ChevronRight } from "lucide-react";

export function CategoryCard({
  category, expenses, onClick,
}: { category: Category; expenses: Expense[]; onClick: () => void }) {
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const pct = category.limit > 0 ? Math.min(999, (total / category.limit) * 100) : 0;
  const barPct = Math.min(100, pct);

  return (
    <button
      onClick={onClick}
      className="card-soft w-full text-left p-4 fade-in active:scale-[0.99] transition-transform"
    >
      <div className="flex items-center gap-3">
        <div
          className="h-12 w-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
          style={{ backgroundColor: `${category.color}22`, color: category.color }}
        >
          <span>{category.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold truncate">{category.name}</h3>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-baseline justify-between mt-0.5">
            <span className="text-sm text-muted-foreground">
              {formatBRL(total)} <span className="opacity-60">/ {formatBRL(category.limit)}</span>
            </span>
            <span className="text-xs font-medium" style={{ color: progressColor(pct) }}>
              {pct.toFixed(0)}%
            </span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${barPct}%`, backgroundColor: progressColor(pct) }}
            />
          </div>
        </div>
      </div>
    </button>
  );
}
