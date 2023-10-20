import { supabase } from "@/utils/supabase";
import { create } from "zustand";

//utils
import { checkIfPro } from "@/utils/checkIfPro";

const useStore = create((set) => ({
	user: null,
	session: null,
	stripe_customer_id: null,
	monthly_budget: null,
	credits: null,
	isPro: false,
	status: null,
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

		const { data: customerData, error: customerError } = await supabase
			.from("customers")
			.select("*")
			.eq("email_address", session?.user?.email);

		if (customerError || customerData?.length === 0) {
			const { error: insertCustomerError } = await supabase
				.from("customers")
				.upsert([
					{
						email_address: session?.user?.email,
						credits: 10,
						monthly_budget: 50,
					},
				])
				.eq("email_address", session?.user?.email)
				.select();
		}

		const githubIdentity: any = session?.user?.identities?.find(
			(identity: any) => identity?.provider === "github"
		)?.identity_data;
		const pro = await checkIfPro(githubIdentity?.email);

		if (!customerData) {
			console.log("Failed to retrieve customer data");
			return null;
		}

		set({
			user: session?.user,
			session: session,
			isPro: pro,
			stripe_customer_id: customerData[0]?.stripe_customer_id,
			monthly_budget: customerData[0]?.monthly_budget,
			credits: customerData[0]?.credits,
			status: customerData[0]?.status,
			customer: customerData[0],
		});
	},
}));
export default useStore;
