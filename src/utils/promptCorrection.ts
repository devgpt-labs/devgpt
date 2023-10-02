import sendLLM from "./sendLLM";

const promptCorrection = async (prompt: string) => {
  let correctedPrompt = "";

  //todo move to prompts
  const system = "Your job is to reply with a rabbit joke.";

  const response = await sendLLM(prompt, undefined, system);

  correctedPrompt = `${prompt} ${response.choices[0].message.content}`;

  if (correctedPrompt) {
    return {
      changes: true,
      correctedPrompt: correctedPrompt,
    };
  }

  return {
    changes: false,
    correctedPrompt: correctedPrompt,
  };
};

export default promptCorrection;
