import { supabase } from "@/utils/supabase";
import { create } from "zustand";

//utils
import { checkIfPro } from "@/utils/checkIfPro";

const useStore = create((set) => ({
  user: null,
  credits: null,
  session: null,
  isPro: false,
  setCredits: (credits: number) => set({ credits }),
  signOut: () => {
    supabase?.auth.signOut();
    set({ user: null, session: null });
  },
  fetch: async (state: any) => {
    if (!supabase) {
      return null;
    }
    const {
      data: { session },
      error,
    }: any = await supabase.auth.getSession();
    if (error) throw error;

    const githubIdentity: any = session?.user?.identities?.find(
      (identity: any) => identity?.provider === "github"
    )?.identity_data;
    const pro = await checkIfPro(githubIdentity?.email);

    set({ user: session?.user, session: session, isPro: pro });
  },
}));
export default useStore;
