import OpenAI from "openai";

//utils
import getLLMToken from "@/utils/getLLMToken";

//types
import type { NextApiRequest, NextApiResponse } from "next";

const openai = new OpenAI({
  apiKey: getLLMToken(),
});

type ResponseData = {
  data: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { prompt, functions, system } = req.body;

  const messages: any = [{ role: "user", content: prompt }];

  if (system) {
    messages.unshift({ role: "system", content: system });
  }

  console.log({ messages });

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    functions: functions || undefined,
    stream: false,
    messages: messages,
  });

  res.status(200).json({ data: response });
}
