//utils
import readFromFileSystem from "@/src/utils/readFromFileSystem";
import getFilesFromString from "../utils/getFilesFromString";

import store from "@/redux/store";

const userInput = async (prompt) => {
  const localRepoDirectory = store.getState()?.localRepoDirectory;

  let filePaths = getFilesFromString(prompt);

  //append the directory to the start of each path
  // filePaths = filePaths.map((filePath) => {
  //   return localRepoDirectory + filePath;
  // });

  const existing_code = await Promise.all(
    filePaths.map(async (file) => {
      const code = await readFromFileSystem(localRepoDirectory, file);

      return `
			file path: ${file.trim()}
			code: ${code}
			`;
    })
  );

  prompt = `
		${prompt}

		Here are the files you are going to edit:
		${existing_code}
	`;

  return prompt;
};

export default userInput;
