import type {Tank} from "src/domains/dto/tank";

import { create } from "zustand";

interface TankState {
  tank: Tank | null;
  setTank: (tank: Tank) => void;
}

export const useTank = create<TankState>((set) => ({
  tank: null,
  setTank: (tank: Tank) => set({ tank }),
}));
