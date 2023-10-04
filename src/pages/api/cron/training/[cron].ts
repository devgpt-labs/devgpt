import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";
import OpenAI from "openai";

//utils
import getLLMToken from "@/utils/getLLMToken";

const openai = new OpenAI({
  apiKey: getLLMToken(),
  dangerouslyAllowBrowser: true,
});

const token = process?.env?.NEXT_PUBLIC_STRIPE_KEY
  ? process?.env?.NEXT_PUBLIC_STRIPE_KEY
  : "notoken";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const cron = req.nextUrl.pathname.split("/")[3];
  if (!cron) return new Response("No cron provided", { status: 400 });
  const response = await update(cron);
  return new NextResponse(JSON.stringify(response), {
    status: 200,
  });
}

async function update(interval: string) {
  const now = Date.now();

  if (!supabase) return "No supabase client found";

  //get list of models that need to be trained
  const { data, error } = await supabase.from("models").select("*");

  if (error) return error;

  const models = data;

  //filter out models that already have an output
  const models_to_train = models.filter((model) => !model.output);

  return { models_to_train, now };
}

const trainRepoWithEncoding = async (repo: any, encoding: any) => {
  // const name = repo.name;
  // const owner = repo.owner.login;
  // // Get Lofaf
  // const lofaf = await getLofaf(owner, name, session);
  // const epochs = 3;
  // const training_cycles = 2;
  // // Manipulate lofaf
  // let lofafArray = lofaf.tree;
  // lofafArray = lofafArray.map((item: any) => {
  //   return item.path;
  // });
  // // Join the lofaf together
  // const lofafString = lofafArray.join(",");
  // // Set Lofaf
  // setLofaf(lofafArray);
  // // Create training data
  // let trainingData = await createTrainingData(
  //   training_cycles,
  //   lofafString,
  //   {
  //     owner: owner,
  //     repo: name,
  //   },
  //   user,
  //   session
  // );
  // console.log({ trainingData });
  // //set training data in store
  // setMessages(trainingData);
};

const trainRepoWithEmbeddings = async (repo: any, embeddings: any) => {
  // // Convert the content to JSONL format
  // const jsonlContent = trainingData.map(JSON.stringify).join("\n");
  // // Convert to a blob
  // const blob = new Blob([jsonlContent], { type: "text/plain" });
  // // Convert to a file
  // const file = new File([blob], "training.jsonl");
  // // Upload the file to openai API
  // const uploadedFiles = await openai.files.create({
  //   file,
  //   purpose: "fine-tune",
  // });
  // // Create a fine-tuning job from the uploaded file
  // const finetune = await openai.fineTuning.jobs.create({
  //   training_file: uploadedFiles.id,
  //   model: `gpt-3.5-turbo`,
  //   hyperparameters: { n_epochs: 3 },
  // });
  // if (error) {
  //   console.log(error);
  // }
  // // Set the fine-tuning ID
  // setFinetuningId(finetune.id);
};
