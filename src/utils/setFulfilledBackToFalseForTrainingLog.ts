import { supabase } from "./supabase";

const setFulfilledBackToFalseForTrainingLog = async (modelId: any) => {
	if (!supabase) return;

	// If training failed, update the training_log to be fulfilled false for this model_id
	const { data, error } = await supabase
		.from("training_log")
		.update({ fulfilled: false })
		.eq("model_id", modelId)
		.select("*")
		.order("created_at", { ascending: false })
		.limit(1);

	if (error) console.log(error);
};

export default setFulfilledBackToFalseForTrainingLog;
