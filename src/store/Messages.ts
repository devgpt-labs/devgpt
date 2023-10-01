import { create } from "zustand";

const useStore = create((set) => ({
  messages: [],
  setMessages: (messages: any) => set({ messages }),
}));

export default useStore;
