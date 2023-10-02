import sendLLM from "./sendLLM";

const promptCorrection = async (prompt: string, lofaf: string) => {
  let correctedPrompt = "";

  //todo move to prompts
  const system = `
	The developer is going to provide you with a prompt for a software development task
	Do not try to complete the task
	your task is to correct the prompt if it is wrong
	If it mentions a file then the format must be ~/path/to/file.ext
	If the prompt is already good, just return their prompt
	`;
  const messages = [
    { role: "user", content: "Fix my login page" },
    { role: "assistant", content: "Fix a bug inside of ~/src/pages/Login.tsx" },
    { role: "user", content: "Make the div on the sign up page responsive" },
    {
      role: "assistant",
      content: "Make the div in ~/app/components/SignUp.tsx responsive",
    },
  ];

  prompt = `
	${prompt}

	Here are the files in the project:
	${lofaf}
	`;

  const response = await sendLLM(prompt, undefined, system, messages);

  correctedPrompt = response.choices[0].message.content;

  if (correctedPrompt === prompt) {
    correctedPrompt = "";
  }

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
