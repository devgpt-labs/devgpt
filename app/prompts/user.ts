//utils
import getFilesFromString from "@/utils/getFilesFromString";
import getCode from "@/utils/github/getCode";

const userInput = async (
  prompt: string,
  owner: string,
  repo: string,
  access_token: string,
  branch: string
) => {
  let filePaths = getFilesFromString(prompt);

  const existing_code = await Promise.all(
    filePaths.map(async (file) => {
      const code = await getCode(owner, repo, file, access_token, branch);

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
		Please ${prompt}

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
