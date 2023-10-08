import OpenAI from "openai";

//utils
import getLLMToken from "@/utils/getLLMToken";

//types
import type { NextApiRequest, NextApiResponse } from "next";
import calculateTokenCost from "@/utils/calculateTokenCost";
import chargeCustomer from "@/utils/stripe/chargeCustomer";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPEN_AI_KEY,
  organization: getLLMToken(),
});

type ResponseData = {
  data: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  let { prompt, functions, system, messages, customer, chargeable, email }: any =
    req.body;

  messages = messages || [];

  messages.push({ role: "user", content: prompt });

  if (system) {
    messages.unshift({ role: "system", content: system });
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    temperature: 0,
    functions: functions || undefined,
    stream: false,
    messages: messages,
  });

  if (chargeable) {
    const usage = response.usage?.total_tokens || 0;
    const cost = calculateTokenCost(usage);

    if (cost > 0) {
      chargeCustomer(customer, cost,email);
    }
  }

  res.status(200).json({ data: response });
}
