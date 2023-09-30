import { OpenAIStream, StreamingTextResponse } from "ai";

import OpenAI from "openai";

//prompts
import { system } from "@/prompts/system";

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
});

export default async function handler(req: Request, res: Response) {
  let { prompt } = await req.json();

  const systemPrompt = await system();

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    stream: true,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
