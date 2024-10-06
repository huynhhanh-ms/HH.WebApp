import { create } from 'zustand';

interface HeaderState {
  header: string;
  setHeader: (header: string) => void;
}

export const useHeader = create<HeaderState>((set) => ({
  header: '',
  setHeader: (header: string) => set({ header }),
}));
