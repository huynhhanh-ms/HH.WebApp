import { create } from 'zustand';

interface LandStore {
  selectedLand: string | null | number;
  setSelectedLand: (land: string | null | number) => void;

  points: { x: number; y: number }[];
  addPoints: (points: { x: number; y: number }[]) => void;
  resetPoints: () => void;

  isEditing: boolean;
  setIsEditing: () => void;

  isCreateLand: boolean;
  setIsCreateLand: (value: boolean) => void;
}

export const useLand = create<LandStore>((set, get) => ({
  selectedLand: null,
  setSelectedLand: (land) => set({ selectedLand: land }),

  points: [],
  addPoints: (points) => {
    set({ points: [...get().points, ...points] });
  },
  resetPoints: () => set({ points: [] }),

  isEditing: false,
  setIsEditing: () => set({ isEditing: !get().isEditing }),

  isCreateLand: false,
  setIsCreateLand: (value) => set({ isCreateLand: value }),
}));
