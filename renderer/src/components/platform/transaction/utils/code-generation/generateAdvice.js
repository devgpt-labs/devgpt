
// Utils
import sendToLLM from "@/src/components/platform/transaction/utils/LLMs/sendToLLM";

const generateAdvice = async (prompt, answers, language, context) => {
  return new Promise(async (resolve, reject) => {
    const code_answer = await sendToLLM({
      stream: false,
      model: "gpt-3.5",
      temperature: 0.4,
      role: `
			You are a top AI developer agent, I want you to tell the developer how you would do their task, without writing any actual code.
			Write a couple short sentences explaining how you would do the task.
			Assume that you will write the code and that you have all the necessary files.
			IMPORTANT: Do not ask any questions, do not write any code.
			`,
      content: `
				Task: "${prompt}" /n/n
				The developer is programming with ${language}.
				`,
    });

    resolve(code_answer.response);
  });
};

export default generateAdvice;
