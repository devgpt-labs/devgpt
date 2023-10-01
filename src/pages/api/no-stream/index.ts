import OpenAI from "openai";

// IMPORTANT! Set the runtime to edge
//export const runtime = "edge";

//utils
import getLLMToken from "@/utils/getLLMToken";

const openai = new OpenAI({
  apiKey: getLLMToken(),
});

import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  data: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { prompt, functions } = req.body;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    functions: functions || undefined,
    stream: false,
    messages: [{ role: "user", content: prompt }],
  });

  res.status(200).json({ data: response });
}
