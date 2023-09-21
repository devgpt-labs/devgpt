import { supabase } from "@/utils/supabase";

const handleSignInWithGitHub = async () => {
	if (!supabase) {
		console.error(
			"Supabase is not configured correctly. Please check the .env file."
		);
		return null
	}

	await supabase.auth.signInWithOAuth({
		provider: 'github',
		options: {
		  scopes: 'repo'
		}
	  })
};

export default handleSignInWithGitHub;
