import { create } from "zustand";

type CartState = {
  quantities: Record<string, number>;
  notes: Record<string, string>;
  setQuantity: (id: string, quantity: number) => void;
  setNote: (id: string, note: string) => void;
  reset: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  quantities: {},
  notes: {},
  setQuantity: (id, quantity) =>
    set((state) => ({
      quantities: { ...state.quantities, [id]: Math.max(0, quantity) },
    })),
  setNote: (id, note) =>
    set((state) => ({
      notes: { ...state.notes, [id]: note },
    })),
  reset: () => set({ quantities: {}, notes: {} }),
}));
