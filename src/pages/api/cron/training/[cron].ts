import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";
import OpenAI from "openai";

//utils
import getLofaf from "@/utils/github/getLofaf";
import createTrainingData from "@/utils/createTrainingData";

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

async function update(interval: string) {
  const now = Date.now();

  if (!supabase) return "No supabase client found";

  //get list of models that need to be trained
  const { data, error } = await supabase.from("models").select("*");

  if (error) return error;

  const models = data;

  //filter out models that already have an output
  const models_to_first_time_train: Model[] = models.filter(
    (model) => !model.output
  );

  //look at frequency of models and

  for (const model of models_to_first_time_train) {
  }

  return { models_to_first_time_train, now };
}
