import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/finance/AppShell";
import { useFinance, actions, Category } from "@/lib/finance-store";
import { CategoryCard } from "@/components/finance/CategoryCard";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { CategoryFormDialog } from "@/components/finance/CategoryFormDialog";

export const Route = createFileRoute("/categorias")({
  component: CategoriesPage,
  head: () => ({ meta: [{ title: "Categorias" }] }),
});

function CategoriesPage() {
  const { categories, expenses } = useFinance();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const navigate = Route.useNavigate();

  const openNew = () => { setEditing(null); setOpen(true); };
  const openEdit = (c: Category) => { setEditing(c); setOpen(true); };

  return (
    <AppShell title="Categorias" action={
      <Button size="sm" onClick={openNew} className="rounded-full"><Plus className="h-4 w-4" /></Button>
    }>
      <div className="space-y-3">
        {categories.map((c) => (
          <div key={c.id} className="relative">
            <CategoryCard category={c}
              expenses={expenses.filter((e) => e.categoryId === c.id)}
              onClick={() => navigate({ to: "/categoria/$id", params: { id: c.id } })} />
            <div className="absolute top-2 right-2 flex gap-1">
              <button onClick={(e) => { e.stopPropagation(); openEdit(c); }}
                className="p-1.5 rounded-full bg-background/80 hover:bg-accent">
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); if (confirm(`Excluir "${c.name}"?`)) actions.deleteCategory(c.id); }}
                className="p-1.5 rounded-full bg-background/80 hover:bg-accent text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <CategoryFormDialog open={open} onOpenChange={setOpen} editing={editing} />
    </AppShell>
  );
}
