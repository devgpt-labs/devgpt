import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
});

export default async function handler(req: Request, res: Response) {
  let { prompt } = await req.json();
    const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [{ role: "user", content: prompt }],
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}