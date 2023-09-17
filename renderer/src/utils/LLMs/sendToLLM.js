import sendOpenAI from "./sendOpenAI";

//this will later be modified to use different LLM providers, OSS uses OpenAI but we (february labs) use Azure.
const sendToLLM = async ({
  stream,
  model,
  role,
  content,
  call,
  functions,
  temperature,
}) => {
  const OAIResponse = await sendOpenAI({
    stream,
    model,
    role,
    content,
    call,
    functions,
    temperature,
  });

  return { response: OAIResponse?.response };
};

export default sendToLLM;
