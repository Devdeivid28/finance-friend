import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/finance/AppShell";
import { useFinance, actions } from "@/lib/finance-store";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Download, Moon, Trash2 } from "lucide-react";

export const Route = createFileRoute("/ajustes")({
  component: SettingsPage,
  head: () => ({ meta: [{ title: "Ajustes" }] }),
});

function SettingsPage() {
  const { darkMode } = useFinance();

  const reset = () => {
    if (confirm("Apagar TODOS os dados? Esta ação é irreversível.")) {
      localStorage.removeItem("finance-app-v1");
      location.reload();
    }
  };

  return (
    <AppShell title="Ajustes">
      <div className="space-y-3">
        <div className="card-soft p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center">
              <Moon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Modo escuro</p>
              <p className="text-xs text-muted-foreground">Reduz o brilho da tela</p>
            </div>
          </div>
          <Switch checked={darkMode} onCheckedChange={() => actions.toggleDark()} />
        </div>

        <button onClick={() => actions.exportJSON()}
          className="card-soft p-4 w-full flex items-center gap-3 text-left active:scale-[0.99] transition">
          <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center">
            <Download className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium">Exportar dados (JSON)</p>
            <p className="text-xs text-muted-foreground">Baixe um backup completo</p>
          </div>
        </button>

        <button onClick={reset}
          className="card-soft p-4 w-full flex items-center gap-3 text-left active:scale-[0.99] transition">
          <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive">
            <Trash2 className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-destructive">Apagar todos os dados</p>
            <p className="text-xs text-muted-foreground">Remove categorias e gastos</p>
          </div>
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-8">
        Finanças · v1.0 · Dados salvos localmente
      </p>
    </AppShell>
  );
}
