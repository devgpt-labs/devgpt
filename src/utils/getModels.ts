import { supabase } from "./supabase";

// Get all models from supabase
const getModels = async (
	setState: any,
	setLoading: any,
	stripe_customer_id: any
) => {
	if (!supabase) return;

	const { data, error } = await supabase
		.from("models")
		.select("*")
		.eq("stripe_customer_id", stripe_customer_id);

	if (!error) {
		setState(data);
	}

	if (!error) {
		const filteredData = data.filter((model: any) => !model.deleted);
		setState(filteredData);
		setLoading(false);
	}

	// if (!data || data.length === 0) {
	// 	return setState([
	// 		{
	// 			id: "1",
	// 			created_at: "2021-09-12T18:51:02.000Z",
	// 			user_id: "1",
	// 			repo: "example-repo",
	// 			owner: "my-name",
	// 			branch: "main",
	// 			epochs: 1,
	// 			output: '{"JSON_output": "data"}',
	// 			training_method: "Encoding",
	// 			sample_size: 15,
	// 			frequency: 25,
	// 		},
	// 	]);
	// }
};

export default getModels;
