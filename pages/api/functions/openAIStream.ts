import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const openAIStream = async ({ model, messages, temperature }: any) => {
  const response = await openai.chat.completions.create({
    model: model,
    messages: messages,
    stream: true,
    temperature,
  });

  console.log({ response });

  return response;
};

export default openAIStream;
