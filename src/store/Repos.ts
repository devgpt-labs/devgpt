import { create } from "zustand";

const useStore = create((set) => ({
  repoWindowOpen: true,
  repo: { owner: null, repo: null },
  lofaf: [],
  branch: "",
  setRepoWindowOpen: (repoWindowOpen: boolean) => set({ repoWindowOpen }),
  setRepo: (repo: { owner: string; repo: string }) => set({ repo }),
  setBranch: (branch: string) => set({ branch }),
  setLofaf: (lofaf: any) => set({ lofaf }),
}));

export default useStore;
