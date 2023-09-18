import { supabase } from "@/src/utils/supabase/supabase";

const handleSignInWithGitHub = async () => {
	if (!supabase) {
		return;
	}

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: "github",
	});
};

export default handleSignInWithGitHub;
