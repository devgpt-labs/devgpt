import { create } from "zustand";

const useStore = create((set) => ({
  messages: [],
  setMessages: () => set((messages: any) => ({ messages: messages })),
}));

export default useStore;
