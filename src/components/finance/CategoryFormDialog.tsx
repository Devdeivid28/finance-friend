import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { actions, Category } from "@/lib/finance-store";

const ICONS = ["🍔","🚗","🎮","🏠","🛒","💊","✈️","📚","💼","🎁","☕","💡","👕","🐶","🎬","💰"];
const COLORS = ["#10b981","#3b82f6","#f59e0b","#8b5cf6","#ef4444","#ec4899","#14b8a6","#f97316"];

export function CategoryFormDialog({
  open, onOpenChange, editing,
}: { open: boolean; onOpenChange: (o: boolean) => void; editing?: Category | null }) {
  const [name, setName] = useState("");
  const [limit, setLimit] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [icon, setIcon] = useState(ICONS[0]);

  useEffect(() => {
    if (open) {
      setName(editing?.name ?? "");
      setLimit(editing?.limit ? String(editing.limit) : "");
      setColor(editing?.color ?? COLORS[0]);
      setIcon(editing?.icon ?? ICONS[0]);
    }
  }, [open, editing]);

  const submit = () => {
    if (!name.trim()) return;
    const data = { name: name.trim(), limit: parseFloat(limit) || 0, color, icon };
    if (editing) actions.updateCategory(editing.id, data);
    else actions.addCategory(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl max-w-sm">
        <DialogHeader>
          <DialogTitle>{editing ? "Editar categoria" : "Nova categoria"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Nome</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Alimentação" />
          </div>
          <div>
            <Label>Limite mensal (R$)</Label>
            <Input type="number" inputMode="decimal" value={limit} onChange={(e) => setLimit(e.target.value)} placeholder="0,00" />
          </div>
          <div>
            <Label>Cor</Label>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {COLORS.map((c) => (
                <button key={c} onClick={() => setColor(c)} type="button"
                  className={`h-8 w-8 rounded-full border-2 transition ${color === c ? "scale-110 border-foreground" : "border-transparent"}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <div>
            <Label>Ícone</Label>
            <div className="grid grid-cols-8 gap-1.5 mt-1.5">
              {ICONS.map((i) => (
                <button key={i} type="button" onClick={() => setIcon(i)}
                  className={`h-9 rounded-lg text-lg transition ${icon === i ? "bg-accent ring-2 ring-primary" : "bg-muted hover:bg-accent"}`}>
                  {i}
                </button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={submit}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
