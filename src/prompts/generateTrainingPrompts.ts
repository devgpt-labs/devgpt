const generateTrainingPrompts = async (fileContent: string) => {
  return {
    prompt: `
		I am going to provide you with the contents of a software developer's file.
		Can you respond with the prompt that the developer would have enter to generate this file?

		E.g. "Generate a readme for my project", "Make a component that the user can use to rate a conversation"
		
		Return a once sentence prompt.

		File: "${fileContent}"
	`,
  };
};

export default generateTrainingPrompts;
