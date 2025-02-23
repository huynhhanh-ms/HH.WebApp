import { create } from 'zustand';

interface ChatMessage {
  role: string;
  content: string;
}
interface ChatStore {
  chatHistory: ChatMessage[];
  maxMessages: number;
  setMaxMessages: (max: number) => void;
  addMessage: (message: ChatMessage) => void;
  clearHistory: () => void;
}

export const useChatbot = create<ChatStore>((set, get) => ({
  chatHistory: [],
  maxMessages: 10, 
  setMaxMessages: (max) => set({ maxMessages: max }), 
  addMessage: (message) =>
    set((state) => {
      const { chatHistory, maxMessages } = get(); 
      const updatedHistory = [...chatHistory, message];
      return {
        chatHistory: updatedHistory.slice(-maxMessages), 
      };
    }),
  clearHistory: () => set({ chatHistory: [] }),
}));
