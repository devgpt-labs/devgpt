import { supabase } from "./supabase/supabase";

const getLocalRepoDir = async (user) => {
	const { data, error } = await supabase
		.from("profiles")
		.select("*")
		.eq("id", user?.id)
		.single();

	if (error) {
		return;
	}

	return data?.local_repo_dir;
};

export default getLocalRepoDir;
