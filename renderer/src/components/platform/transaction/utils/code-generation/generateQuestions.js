
// Utils
import sendToLLM from "@/src/components/platform/transaction/utils/LLMs/sendToLLM";

const generateQuestions = async (prompt, language, context) => {
	return new Promise(async (resolve, reject) => {
		const code_answer = await sendToLLM({
			stream: false,
			model: "gpt-3.5",
			temperature: 0.5,
			role: `
				I will provide you with a development task and you need to provide follow-up questions to clarify the task.
				The repo is written in ${language}
				The task is part of a larger application.
				Ask very important questions only, only ask questions that are crucial to the task.
				DO NOT ask for any images, documentation, or other files.
				DO NOT ask obvious questions.
				Try to aim for 2-4 questions.
				IMPORTANT: return a csv or questions, NOT AN ARRAY
				Do not wrap the questions in quotes.
			`,
			content: `
			Task: "${prompt}"
			And they have also provided this context: "${context}" /n/n
			`,
		});

		resolve(code_answer.response);
	});
};

export default generateQuestions;
