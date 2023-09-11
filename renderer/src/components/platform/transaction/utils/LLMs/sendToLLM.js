import sendOpenAI from "./sendOpenAI";

const sendToLLM = async ({
  stream,
  model,
  role,
  content,
  call,
  functions,
  temperature,
}) => {
  const modelParsed = { OpenAI: null };

  switch (model) {
    case "gpt-3.5":
      modelParsed.OpenAI = "gpt-3.5-turbo";
      break;
    case "gpt-4":
      modelParsed.OpenAI = "gpt-4";
      break;
    default:
      modelParsed.OpenAI = "gpt-4";
      break;
  }

  const OAIResponse = await sendOpenAI({
    stream,
    model: modelParsed.OpenAI,
    role,
    content,
    call,
    functions,
    temperature,
  });

  return { response: OAIResponse?.response };
};

export default sendToLLM;
