"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type CompareEntry = { slug: string; name: string; img?: string };

type CompareCtx = {
  selected: CompareEntry[];
  toggle: (entry: CompareEntry) => void;
  isSelected: (slug: string) => boolean;
  canAdd: boolean;
  clear: () => void;
};

const CompareContext = createContext<CompareCtx>({
  selected: [],
  toggle: () => {},
  isSelected: () => false,
  canAdd: true,
  clear: () => {},
});

export function CompareProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<CompareEntry[]>([]);

  const toggle = useCallback((entry: CompareEntry) => {
    setSelected((prev) => {
      const exists = prev.some((e) => e.slug === entry.slug);
      if (exists) return prev.filter((e) => e.slug !== entry.slug);
      if (prev.length >= 2) return prev;
      return [...prev, entry];
    });
  }, []);

  const isSelected = useCallback(
    (slug: string) => selected.some((e) => e.slug === slug),
    [selected]
  );

  const clear = useCallback(() => setSelected([]), []);

  return (
    <CompareContext.Provider
      value={{
        selected,
        toggle,
        isSelected,
        canAdd: selected.length < 2,
        clear,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  return useContext(CompareContext);
}
