import { create } from 'zustand';

interface LandStore {
  selectedLand: string | null | number;
  setSelectedLand: (land: string | null | number) => void;

  points: number[][];
  addPoints: (points: number[][]) => void;
  addPoint: (point: number[]) => void;
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
  addPoint: (points) => {
    set((state) => ({ points: [...state.points, points] }));
  },
  addPoints: (points) => {
    set((state) => ({ points: [...state.points, ...points] }));
  },
  resetPoints: () => set({ points: [] }),

  isEditing: false,
  setIsEditing: () => set({ isEditing: !get().isEditing }),

  isCreateLand: false,
  setIsCreateLand: (value) => set({ isCreateLand: value }),
}));
