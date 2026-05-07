import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { actions, Expense } from "@/lib/finance-store";

export function ExpenseFormDialog({
  open, onOpenChange, categoryId, editing,
}: { open: boolean; onOpenChange: (o: boolean) => void; categoryId: string; editing?: Expense | null }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (open) {
      setDescription(editing?.description ?? "");
      setAmount(editing?.amount ? String(editing.amount) : "");
      setDate(editing?.date ? editing.date.slice(0, 10) : new Date().toISOString().slice(0, 10));
    }
  }, [open, editing]);

  const submit = () => {
    const value = parseFloat(amount);
    if (!description.trim() || !value) return;
    const iso = new Date(date + "T12:00:00").toISOString();
    if (editing) actions.updateExpense(editing.id, { description: description.trim(), amount: value, date: iso });
    else actions.addExpense({ categoryId, description: description.trim(), amount: value, date: iso });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl max-w-sm">
        <DialogHeader>
          <DialogTitle>{editing ? "Editar gasto" : "Novo gasto"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Descrição</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex: Mercado" />
          </div>
          <div>
            <Label>Valor (R$)</Label>
            <Input type="number" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0,00" />
          </div>
          <div>
            <Label>Data</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
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
