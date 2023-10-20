import { supabase } from "@/utils/supabase";
import OpenAI from "openai";

//utils
import getLLMToken from "@/utils/getLLMToken";
import getLofaf from "@/utils/github/getLofaf";
import createTrainingData from "@/utils/createTrainingData";
import createModelID from "./createModelID";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPEN_AI_KEY,
  organization: getLLMToken(),
  dangerouslyAllowBrowser: true,
});

interface Model {
  id: string;
  created_at: string;
  email: string;
  repo: string;
  owner: string;
  branch: string;
  epochs: number;
  training_method: string;
  frequency: number;
  sample_size: number;
  output?: string;
}

async function trainModel(model: any, session: any, user: any) {
  console.log("7");
  if (!supabase) {
    console.log("No supabase client found");
    return;
  }

  console.log("8");

  console.log("9");

  switch (model.training_method.toLowerCase()) {
    case "encoding":
      console.log("5");
      return await trainRepoWithEncoding(model, session, user);
      break;
    case "embeddings":
      return await trainRepoWithEmbeddings(model, session, user);
      break;
    default:
      console.log("4");
      return await trainRepoWithEncoding(model, session, user);
      break;
  }
}

export default trainModel;

const trainRepoWithEncoding = async (model: Model, session: any, user: any) => {
  const name = model.repo;
  const owner = model.owner;

  console.log("1");

  if (!owner || !name || !session.provider_token) {
    console.error("Missing owner, name, or provider_token");
    return;
  }

  // Get Lofaf
  const lofaf = await getLofaf(owner, name, session);
  const sample_size = model.sample_size;

  // Manipulate lofaf
  let lofafArray = lofaf.tree;
  lofafArray = lofafArray.map((item: any) => {
    return item.path;
  });

  // Join the lofaf together
  const lofafString = lofafArray.join(",");

  console.log("2");

  // Create training data
  let trainingData = await createTrainingData(
    sample_size,
    lofafString,
    {
      owner: owner,
      repo: name,
    },
    user,
    session
  );

  setModelOutput(model, JSON.stringify(trainingData), user.email);

  console.log("3");

  console.log({ trainingData });

  //return the output
  return JSON.stringify(trainingData);
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
  const sample_size = model.sample_size;
  // Manipulate lofaf
  let lofafArray = lofaf.tree;
  lofafArray = lofafArray.map((item: any) => {
    return item.path;
  });
  // Join the lofaf together
  const lofafString = lofafArray.join(",");
  // Create training data
  let trainingData = await createTrainingData(
    sample_size,
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

  setModelOutput(model, finetune.id, user);

  //return the output
  return finetune.id;
};

const setModelOutput = async (model: Model, output: string, user: any) => {
  //replace output for this model in supabase with training data
  if (!supabase) return;

  const { error } = await supabase
    .from("models")
    .update({
      output: output,
    })
    .eq("id", model.id)
    .select();

  if (error) {
    console.log("Error:", error);
    return null;
  }

  if (output && !error) {
    //update the training_log table by setting the latest training_log to fulfilled
    const { data: trainingLogData, error: trainingLogError } = await supabase
      .from("training_log")
      .update({ fulfilled: true })
      .eq("model_id", createModelID(model.repo, model.owner, model.branch))
      .order("created_at", { ascending: false })
      .select();

    if (trainingLogError) {
      return null;
    }
  }
};
