//types
import { Message } from "@/types/chat";
//prompts
import { system } from "@/prompts/system";
//utils
import sendLLM from "./sendLLM";
import getTokenLimit from "./getTokenLimit";
import getTokensFromString from "./getTokensFromString";
import getCode from "./github/getCode";
//store

const MAX_TRAINING_FILES = 15;

const createTrainingData = async (
  lofaf: string,
  repo: any,
  user: any,
  session: any
) => {
  const emailAddress = user.email;
  const access_token = session?.provider_token;
  const owner = repo?.owner;
  repo = repo?.repo;

  let newMessages: any = [];

  if (!lofaf || !owner || !repo || !access_token || !emailAddress) {
    return newMessages;
  }

  try {
    newMessages.push({
      role: "system",
      content: system(), //add system message
    });

    // add context messages
    newMessages = await addContext(
      newMessages,
      lofaf,
      owner,
      repo,
      access_token,
      emailAddress
    );

    return newMessages;
  } catch (error) {
    console.warn(error);
    return newMessages;
  }
};

export default createTrainingData;

interface UsefulFile {
  fileName: string;
}

const addContext = async (
  messages: Message[],
  lofaf: string,
  owner: string,
  repo: string,
  access_token: string,
  emailAddress: string
) => {
  try {
    const usefulFiles: UsefulFile[] = await getUsefulFiles(lofaf);

    const usefulFileContents: any = await getUsefulFileContents(
      usefulFiles,
      owner,
      repo,
      access_token
    );

    const usefulFilePrompts: any = await getUsefulFilePrompts(
      usefulFileContents
    );

    usefulFilePrompts.forEach((prompt: any) => {
      addMessage(messages, prompt.userPrompt, prompt.fileContent, emailAddress);
    });

    return messages;
  } catch {
    return messages;
  }
};

const getUsefulFiles = async (lofaf: string) => {
  try {
    //todo move this to prompts folder
    const response = await sendLLM(
      `
		You are about to help a software developer with their job.
		This is the files in their project: "${lofaf}".
		Return an example of a front-end and back-end file that you can use to understand the developer's coding style.
		E.g. "MyFrontEndComponent.tsx", "my-back-end-route.ts", "README.md" 
	`,
      [
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
      ]
    );

    const { useful_files_csv } = JSON.parse(
      response?.choices?.[0]?.message?.function_call?.arguments
    );

    const usefulFilesArray = useful_files_csv
      .split(",")
      .splice(0, MAX_TRAINING_FILES);

    return usefulFilesArray;
  } catch (error) {
    console.warn(error);
    return [];
  }
};

const getUsefulFileContents = async (
  files: any,
  owner: string,
  repo: string,
  access_token: string
) => {
  try {
    // Map each item to a promise
    const promises = files.map(async (file: any) => {
      let code = await getCode(owner, repo, file.trim(), access_token);
      code = code.content;
      code = Buffer.from(code, "base64").toString("ascii");

      return { fileName: file, fileContent: code };
    });

    // Wait for all promises to resolve
    const filesWithContent = await Promise.all(promises);

    return filesWithContent;
  } catch (error) {
    console.warn(error);
    return false;
  }
};

const getUsefulFilePrompts = async (files: any) => {
  try {
    const promises = files.map(async (file: any) => {
      const response = await sendLLM(
        `
					I am going to provide you with the contents of a software developer's file.
					Can you respond with the prompts that the developer would have entered to generate this file?

					E.g. "Generate a readme for my project", "Make a component that the user can use to rate a conversation"
					
					File: "${file.fileContent}"
				`
      );

      const prompt = response?.choices?.[0]?.message?.content;

      return {
        fileName: file.fileName,
        fileContent: file.fileContent,
        userPrompt: prompt,
      };
    });

    const filesWithPrompts = await Promise.all(promises);

    return filesWithPrompts;
  } catch (error) {
    console.warn(error);
    return false;
  }
};

const addMessage = async (
  messages: Message[],
  userMessage: string,
  assistantMessage: string,
  emailAddress: string
) => {
  const tokenLimit = await getTokenLimit(emailAddress);
  if (getTokensFromString(userMessage) > tokenLimit) {
    return messages;
  }

  messages.push({
    role: "user",
    content: String(userMessage),
  });

  messages.push({
    role: "assistant",
    content: String(assistantMessage),
  });

  return messages;
};
