import openAIStream from "./functions/openAIStream";
import { OpenAIStream, StreamingTextResponse } from "ai";
import system from "./prompts/system";

//todo rename generate advice

//todo if the user is premium use 32-k

export const runtime = "edge";

export default async function handler(req: any, res: any) {
  const parsedBody = await req.json();
  const { messages, technologiesUsed, context, UID } = parsedBody;

  if (!messages || !UID) {
    res.status(400).send("Missing required parameters");
    return;
  }

  //prepend a message to the messages array
  messages.unshift({
    role: "system",
    content: system(context, technologiesUsed),
  });

  const open_ai_code_answer = await openAIStream({
    model: "gpt-4",
    messages,
    temperature: 0,
  });
  const open_ai_stream = OpenAIStream(open_ai_code_answer);
  return new StreamingTextResponse(open_ai_stream);
}
