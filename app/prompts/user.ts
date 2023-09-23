//utils
import getFilesFromString from "@/utils/getFilesFromString";
import getCode from "@/utils/github/getCode";

const userInput = async (
  prompt: string,
  owner: string,
  repo: string,
  access_token: string
) => {
  let filePaths = getFilesFromString(prompt);

  const existing_code = await Promise.all(
    filePaths.map(async (file) => {
      const code = await getCode(owner, repo, file, access_token);

      //decrypt from base64
      let content = code.content;

      if (!content) {
        return;
      }

      content = Buffer.from(content, "base64").toString("ascii");

      return `
  		file path: ${file.trim()}
  		code: ${content}
  		`;
    })
  );

  prompt = `
		${prompt}, please use the code in our conversation so far as a guide.

		${
      existing_code.length > 0
        ? `
			Here is the file you are going to edit:
			"${existing_code}"`
        : ""
    }
	`;

  return prompt;
};

export default userInput;
