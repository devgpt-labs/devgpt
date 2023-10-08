import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

//utils
import calculateTotalCost from "@/utils/calculateTotalCost";
import chargeCustomer from "@/utils/stripe/chargeCustomer";
import createModelID from "@/utils/createModelID";

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
  deleted: boolean;
  email_address: string;
}

interface Log {
  id: string;
  created_at: string;
  model_id: string;
  model_settings: string;
  fulfilled: boolean;
}

async function update(interval: string) {
  const now = Date.now();

  if (!supabase) return "No supabase client found";

  //get list of models that need to be trained
  const { data, error } = await supabase.from("models").select("*");

  if (error) return error;

  let models = data;

  //filter out models that have deleted = true
  models = models.filter((model: Model) => {
    return model.deleted !== true;
  });

  for (const model of models) {
    //get the training-log for this model
    let { data: logData, error: logError }: any = await supabase
      .from("training_log")
      .select("*")
      .eq("model_id", createModelID(model.repo, model.owner, model.branch));

    //filter out training logs that did not occur this month
    logData = logData?.filter((log: Log) => {
      const logDate = new Date(log.created_at);
      const now = new Date();
      return logDate.getMonth() === now.getMonth();
    });

    //model frequency is how many times per month the model should be trained
    const numberOfTimesModelShouldBeTrainedThisMonth = model.frequency;
    const numberOfTimeModelHasBeenTrainedThisMonth = logData.length;

    if (
      numberOfTimeModelHasBeenTrainedThisMonth >=
      numberOfTimesModelShouldBeTrainedThisMonth
    ) {
      //model has been trained enough this month
      return;
    }

    const dayOfMonth = new Date().getDate();

    const numberOfTimesTrainingShouldHaveOccurred = Math.ceil(
      dayOfMonth / (30 / numberOfTimesModelShouldBeTrainedThisMonth)
    );

    if (
      numberOfTimesTrainingShouldHaveOccurred >
      numberOfTimeModelHasBeenTrainedThisMonth
    ) {
      //scheduel training for this model
      addTrainingLog(model);
    }
  }

  return { models, now };
}

const addTrainingLog = async (model: Model) => {
  if (!supabase) return "No supabase client found";

  //add training log for this model
  const { data: logData, error: logError }: any = await supabase
    .from("training_log")
    .insert([
      {
        model_id: createModelID(model.repo, model.owner, model.branch),
        model_settings: JSON.stringify(model),
        fulfilled: false,
      },
    ]);

  //calculate cost of training this model
  const costToTrain = calculateTotalCost([model], 0);

  //create a new charge
  chargeCustomer(
    {
      stripe_customer_id: model.stripe_customer_id,
    },
    Number(costToTrain),
    model?.email_address
  );
};
