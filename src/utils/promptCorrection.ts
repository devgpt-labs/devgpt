import sendLLM from "./sendLLM";

const promptCorrection = async (
  prompt: string,
  lofaf: string,
  customer: any
) => {
  //todo move to prompts
  const system = `
	The developer is going to provide you with a prompt for a software development task.
	Do not try to complete the task.
	Your task is to correct the prompt if it is wrong.

	Rules:
	If it mentions a file then the format must be ~/path/to/file.ext
	Return the prompt as a function call with new prompt and a boolean indicating if changes are required.
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
  const functions = [
    {
      name: "prompt_to_llm",
      description: "Sends a newly improved prompt to an LLM.",
      parameters: {
        type: "object",
        properties: {
          new_prompt: {
            type: "string",
            description: "The improved prompt",
          },
          changes_required: {
            type: "boolean",
            description: "Are changes to the prompt required?",
          },
        },
        required: ["new_prompt, changes_required"],
      },
    },
  ];
  prompt = `
	${prompt}

	Here are the files in the project:
	${lofaf}
	`;

  const response = await sendLLM(
    prompt,
    functions,
    system,
    messages,
    customer,
    true
  );

  // TODO: Add fail check here

  const { new_prompt, changes_required } = JSON.parse(
    response?.choices?.[0]?.message?.function_call?.arguments
  );

  if (!changes_required) {
    return {
      changes: false,
      correctedPrompt: "",
    };
  } else {
    return {
      changes: true,
      correctedPrompt: new_prompt,
    };
  }
};

export default promptCorrection;
