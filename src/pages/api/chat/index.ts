import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPEN_AI_KEY,
  organization: process?.env?.NEXT_PUBLIC_OPEN_AI_ORG_2,
});

export default async function handler(req: Request, res: Response) {
  let { messages } = await req.json();

  const response: any = await openai.chat.completions.create({
    model: "gpt-4",
    stream: true,
    messages: messages,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
