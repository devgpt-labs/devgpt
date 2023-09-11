import { supabase } from "./supabase/supabase";

const getTechnologiesUsed = async (user) => {
	const { data, error } = await supabase
		.from("profiles")
		.select("*")
		.eq("id", user?.id)
		.single();

	if (error) {
		return;
	}

	return data?.technologies_used;
};

export default getTechnologiesUsed;
