import { useEffect, useSyncExternalStore } from "react";

export type Expense = {
  id: string;
  categoryId: string;
  description: string;
  amount: number;
  date: string; // ISO
};

export type Category = {
  id: string;
  name: string;
  color: string; // hex
  icon: string; // emoji
  limit: number;
};

export type FinanceState = {
  categories: Category[];
  expenses: Expense[];
  darkMode: boolean;
};

const STORAGE_KEY = "finance-app-v1";

const seed: FinanceState = {
  darkMode: false,
  categories: [
    { id: "c1", name: "Alimentação", color: "#10b981", icon: "🍔", limit: 800 },
    { id: "c2", name: "Transporte", color: "#3b82f6", icon: "🚗", limit: 400 },
    { id: "c3", name: "Lazer", color: "#f59e0b", icon: "🎮", limit: 300 },
    { id: "c4", name: "Moradia", color: "#8b5cf6", icon: "🏠", limit: 1500 },
  ],
  expenses: [],
};

let state: FinanceState = seed;
const listeners = new Set<() => void>();

function load() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) state = { ...seed, ...JSON.parse(raw) };
  } catch {}
  if (state.darkMode) document.documentElement.classList.add("dark");
}

function persist() {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

let loaded = false;
export function ensureLoaded() {
  if (!loaded && typeof window !== "undefined") {
    load();
    loaded = true;
  }
}

export function useFinance(): FinanceState {
  useEffect(() => { ensureLoaded(); }, []);
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => state,
    () => seed,
  );
}

const uid = () => Math.random().toString(36).slice(2, 10);

export const actions = {
  addCategory(c: Omit<Category, "id">) {
    state = { ...state, categories: [...state.categories, { ...c, id: uid() }] };
    emit();
  },
  updateCategory(id: string, patch: Partial<Category>) {
    state = { ...state, categories: state.categories.map((c) => c.id === id ? { ...c, ...patch } : c) };
    emit();
  },
  deleteCategory(id: string) {
    state = {
      ...state,
      categories: state.categories.filter((c) => c.id !== id),
      expenses: state.expenses.filter((e) => e.categoryId !== id),
    };
    emit();
  },
  addExpense(e: Omit<Expense, "id" | "date"> & { date?: string }) {
    state = { ...state, expenses: [...state.expenses, { ...e, id: uid(), date: e.date ?? new Date().toISOString() }] };
    emit();
  },
  updateExpense(id: string, patch: Partial<Expense>) {
    state = { ...state, expenses: state.expenses.map((e) => e.id === id ? { ...e, ...patch } : e) };
    emit();
  },
  deleteExpense(id: string) {
    state = { ...state, expenses: state.expenses.filter((e) => e.id !== id) };
    emit();
  },
  toggleDark() {
    state = { ...state, darkMode: !state.darkMode };
    document.documentElement.classList.toggle("dark", state.darkMode);
    emit();
  },
  exportJSON() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financas-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },
};

export function progressColor(pct: number) {
  if (pct <= 70) return "var(--color-success)";
  if (pct <= 90) return "var(--color-warning)";
  return "var(--color-danger)";
}

export function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
