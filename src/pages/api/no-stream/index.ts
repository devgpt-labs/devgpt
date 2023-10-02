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
  let { prompt, functions, system, messages }: any = req.body;

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

  res.status(200).json({ data: response });
}
