const selectTrainingFiles = async (lofaf: string) => {
  return {
    prompt: `
		Here are the list of files in a software repository: "${lofaf}".
		Return a large CSV of the files that you would need to read to understand the developer's coding style.
		Front-end, back-end, and README files are good examples.
	`,
    functions: [
      {
        name: "process_useful_files_array",
        description: "Processes an array of useful files.",
        parameters: {
          type: "object",
          properties: {
            useful_files_csv: {
              type: "string",
              description: "A comma separated list of useful files",
            },
            optional_comments: {
              type: "string",
              description: "Any optional comments about this list",
            },
          },
        },
      },
    ],
  };
};

export default selectTrainingFiles;
