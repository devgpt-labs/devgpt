// Utils
import sendToLLM from "@/src/components/platform/transaction/utils/LLMs/sendToLLM";

const detectPromptIntent = async (prompt) => {
  return new Promise(async (resolve, reject) => {
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

    resolve(code_answer.response);
  });
};

export default detectPromptIntent;
