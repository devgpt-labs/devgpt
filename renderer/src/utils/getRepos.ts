import { supabase } from "./supabase/supabase";

const getRepos = async (user) => {
	return new Promise(async (resolve, reject) => {
		if (supabase) {
			const { data, error } = await supabase
			  .from("repos")
			  .select("*")
			  .eq("user_id", user?.id)

			if (!error) {
				resolve(data);
			}
		}
	});
};

export default getRepos;