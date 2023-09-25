import { supabase } from "@/utils/supabase";

const signInWithBitbucket = async () => {
	if (!supabase) {
		console.error(
			"Supabase is not configured correctly. Please check the .env file."
		);
		return null;
	}

	await supabase.auth.signInWithOAuth({
		provider: "bitbucket",
		options: {
			scopes: "repository",
		},
	});
};

export default signInWithBitbucket;
