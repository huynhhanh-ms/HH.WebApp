import { create } from 'zustand';

interface LandStore {
  selectedLand: string | null | number;
  setSelectedLand: (land: string | null | number) => void;
}

export const useLand = create<LandStore>((set, get) => ({
  selectedLand: null,
  setSelectedLand: (land) => set({ selectedLand: land }),
}));
