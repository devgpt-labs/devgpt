import { supabase } from "@/utils/supabase";

const signInWithGitlab = async () => {
	if (!supabase) {
		console.error(
			"Supabase is not configured correctly. Please check the .env file."
		);
		return null
	}

	await supabase.auth.signInWithOAuth({
		provider: 'gitlab',
		options: {
		  scopes: 'repo'
		}
	})
};

export default signInWithGitlab;

