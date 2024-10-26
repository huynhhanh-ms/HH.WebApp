import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface GlobalState {
  header: string;
  isSimpleNav: boolean;
  setHeader: (header: string) => void;
  setSimpleNav: (isSimpleNav: boolean) => void;
}

export const useGlobal = create<GlobalState>()(persist<GlobalState>((set) => ({
  header: '',
  isSimpleNav: false,
  setHeader: (header: string) => set({ header }),
  setSimpleNav: (isSimpleNav: boolean) => set({ isSimpleNav }),
}), {
  name: "global-zustand",
  storage: createJSONStorage(() => localStorage),
}));
