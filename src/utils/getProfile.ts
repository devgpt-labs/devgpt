import { supabase } from "./supabase/supabase";

const getProfile = async (user) => {
	return new Promise(async (resolve, reject) => {
		if (supabase) {
			const { data, error } = await supabase
			  .from("profiles")
			  .select("*")
			  .eq("id", user?.id)
			  .single();

			if (!error) {
				resolve(data);
			}
		}
	});
};

export default getProfile;