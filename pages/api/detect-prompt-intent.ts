import sendToLLM from "./functions/sendToLLM";

//todo remove all of these unused routes

export default async function handler(req: any, res: any) {
  const parsedBody = JSON.parse(req.body);
  const { prompt } = parsedBody;

  const apiKey = process?.env?.NEXT_PUBLIC_OPENAI_API_KEY;
  console.log({ apiKey });

  if (!prompt) {
    res.status(400).send("Missing required parameters");
    return;
  }

  const code_answer = await sendToLLM({
    stream: false,
    model: "gpt-3.5-turbo",
    temperature: 0.1,
    role: `
              It's your job to detect the intent of the prompt.
              If the user is asking a question, asking for you to summarize something, asking for advice or anything that doesn't require code changes then return false.
              If the user is asking you to generate, edit, or write code then return true.
              `,
    content: `
              Prompt: "${prompt}"
                  `,
  });
  res.status(200).send({ data: code_answer.response });
}
