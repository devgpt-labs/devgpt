import { supabase } from "@/utils/supabase";
import createModelID from "./createModelID";

const getTrainingLogsForModel = async (setState: any, model: any) => {
  if (!supabase) return;
  if (!model) return;

  const { data, error } = await supabase
    .from("training_log")
    .select()
    .eq("model_id", createModelID(model.repo, model.owner, model.branch))
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    console.log(error);
  }

  if (data) {
    setState(data);
    return;
  }
};

export default getTrainingLogsForModel;
