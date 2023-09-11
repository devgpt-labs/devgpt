
// Utils
import sendToLLM from "@/src/components/platform/transaction/utils/LLMs/sendToLLM";

//this is used for follow up prompts but we will ideally swap away from this and use generateCode for follow-up prompts as well

const generateNewGenerationCode = async (
  prompt,
  followUpPrompt,
  answers,
  lofaf,
  directory,
  language,
  existingCodeString,
  context
) => {
  return new Promise(async (resolve, reject) => {
    const code_answer = await sendToLLM({
      stream: false,
      model: "gpt-4",
      role: `You are a top AI developer agent aiming to generate high-quality code based on a developers's provided task, 
			You have already generated some code, now the user has some feedback for you.
			Their original task was: "${prompt}"
			The developers has already provided answers to the following questions: "${answers}" /n/n
			And they have also provided this context: "${context}" /n/n
			Completely implement all requested features and provide code only, without any file_name or comments.
			Use ${language} for the code generation.`,
      content: `
			Code we have generated so far: "${existingCodeString}" /n/n
			Follow up request: "${followUpPrompt}" /n/n

			IMPORTANT: remove "${directory}" from the file_name.

			Return the code in this JSON format:
			[
				{
					"file_name": "file_name",
					"code": "code"
				}
			]
			`,
    });

    resolve(code_answer.response);
  });
};

export default generateNewGenerationCode;
