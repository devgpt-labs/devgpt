import { supabase } from "./supabase/supabase";

const getTheme = async (user) => {
	return new Promise(async (resolve, reject) => {
		if (supabase) {
			const { data, error } = await supabase
			  .from("profiles")
			  .select("*")
			  .eq("id", user.id)
			  .single();

			if (!error) {
				resolve(data.theme);
			}
		}
	});
};

export default getTheme;