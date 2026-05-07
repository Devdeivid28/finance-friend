import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export function AppShell({ children, title, action }: { children: ReactNode; title: string; action?: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto pb-28">
        <header className="sticky top-0 z-30 glass-nav px-5 py-4 flex items-center justify-between border-b border-border/50">
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          {action}
        </header>
        <main className="px-5 py-5 fade-in">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
