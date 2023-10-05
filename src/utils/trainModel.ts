import { supabase } from "@/utils/supabase";
import OpenAI from "openai";

//utils
import getLLMToken from "@/utils/getLLMToken";
import getLofaf from "@/utils/github/getLofaf";
import createTrainingData from "@/utils/createTrainingData";

const openai = new OpenAI({
  apiKey: getLLMToken(),
  dangerouslyAllowBrowser: true,
});

interface Model {
  created_at: string;
  stripe_customer_id: string;
  repo: string;
  owner: string;
  branch: string;
  epochs: number;
  training_method: string;
  frequency: number;
  sample_size: number;
  output: string;
}

async function trainModel(model: Model, session: any, user: any) {
  switch (model.training_method) {
    case "encoding":
      return await trainRepoWithEncoding(model, session, user);
      break;
    case "embeddings":
      return await trainRepoWithEmbeddings(model, session, user);
      break;
  }
}

export default trainModel;

const trainRepoWithEncoding = async (model: Model, session: any, user: any) => {
  const name = model.repo;
  const owner = model.owner;
  // Get Lofaf
  const lofaf = await getLofaf(owner, name, session);
  const epochs = 3;
  const training_cycles = 2;
  // Manipulate lofaf
  let lofafArray = lofaf.tree;
  lofafArray = lofafArray.map((item: any) => {
    return item.path;
  });
  // Join the lofaf together
  const lofafString = lofafArray.join(",");
  // Create training data
  let trainingData = await createTrainingData(
    training_cycles,
    lofafString,
    {
      owner: owner,
      repo: name,
    },
    user,
    session
  );

  setModelOutput(model, trainingData);

  return;
};

const trainRepoWithEmbeddings = async (
  model: Model,
  session: any,
  user: any
) => {
  const name = model.repo;
  const owner = model.owner;
  // Get Lofaf
  const lofaf = await getLofaf(owner, name, session);
  const epochs = model.epochs;
  const training_cycles = 2;
  // Manipulate lofaf
  let lofafArray = lofaf.tree;
  lofafArray = lofafArray.map((item: any) => {
    return item.path;
  });
  // Join the lofaf together
  const lofafString = lofafArray.join(",");
  // Create training data
  let trainingData = await createTrainingData(
    training_cycles,
    lofafString,
    {
      owner: owner,
      repo: name,
    },
    user,
    session
  );

  // Convert the content to JSONL format
  const jsonlContent = trainingData.map(JSON.stringify).join("\n");
  // Convert to a blob
  const blob = new Blob([jsonlContent], { type: "text/plain" });
  // Convert to a file
  const file = new File([blob], "training.jsonl");
  // Upload the file to openai API
  const uploadedFiles = await openai.files.create({
    file,
    purpose: "fine-tune",
  });
  // Create a fine-tuning job from the uploaded file
  const finetune = await openai.fineTuning.jobs.create({
    training_file: uploadedFiles.id,
    model: `gpt-3.5-turbo`,
    hyperparameters: { n_epochs: epochs },
  });

  setModelOutput(model, finetune.id);
};

const setModelOutput = async (model: Model, output: string) => {
  //replace output for this model in supabase with training data
  if (!supabase) return;

  const { data, error } = await supabase
    .from("models")
    .update({ output: output })
    .eq("stripe_customer_id", model.stripe_customer_id)
    .eq("repo", model.repo)
    .eq("owner", model.owner)
    .eq("branch", model.branch);
};
