//types
import { Message } from "@/types/chat";
//prompts
import { system } from "@/prompts/system";
//utils
import sendLLM from "./sendLLM";
import getTokenLimit from "./getTokenLimit";
import getTokensFromString from "./getTokensFromString";
import getCode from "./github/getCode";
import generateTrainingPrompts from "@/prompts/generateTrainingPrompts";
import selectTrainingFiles from "@/prompts/selectTrainingFiles";

const TRAIN_FOR_ENCODING = process.env.NEXT_PUBLIC_FINE_TUNE_MODE != "true";

const createTrainingData = async (
  sample_size: number,
  lofaf: string,
  repo: any,
  user: any,
  session: any,
) => {
  const emailAddress = user.email;
  const access_token = session?.provider_token;
  const owner = repo?.owner;
  repo = repo?.repo;

  if (!lofaf || !owner || !repo || !access_token || !emailAddress) {
    return [];
  }

  try {
    let newMessages: any = [];

    // add context messages
    newMessages = await addContext(
      sample_size,
      newMessages,
      lofaf,
      owner,
      repo,
      access_token,
      emailAddress,
      user
    );

    if (TRAIN_FOR_ENCODING) {
      const systemPrompt = await system();

      newMessages.unshift({
        role: "system",
        content: systemPrompt,
      });
    }

    return newMessages;
  } catch (error) {
    console.warn(error);
    return [];
  }
};

export default createTrainingData;

interface UsefulFile {
  fileName: string;
}

const addContext = async (
  sample_size: number,
  messages: Message[],
  lofaf: string,
  owner: string,
  repo: string,
  access_token: string,
  emailAddress: string,
  user: any
) => {
  try {
    const usefulFiles: UsefulFile[] = await getUsefulFiles(
      sample_size,
      lofaf,
      user
    );

    const usefulFileContents: any = await getUsefulFileContents(
      usefulFiles,
      owner,
      repo,
      access_token
    );

    const usefulFilePrompts: any = await getUsefulFilePrompts(
      user,
      usefulFileContents
    );

    const systemPrompt = await system();

    const tokenLimit = await getTokenLimit();

    usefulFilePrompts.forEach((prompt: any) => {
      if (getTokensFromString(prompt.fileContent) < tokenLimit) {
        addMessage(
          messages,
          prompt.userPrompt,
          prompt.fileContent,
          prompt.fileName,
          systemPrompt
        );
      }
    });

    return messages;
  } catch {
    return messages;
  }
};

const getUsefulFiles = async (
  sample_size: number,
  lofaf: string,
  user: any
) => {
  try {
    const { prompt: filesPrompt, functions: filesFunction } =
      await selectTrainingFiles(lofaf);

    const response = await sendLLM(user?.email, filesPrompt, filesFunction);

    const { useful_files_csv } = JSON.parse(
      response?.choices?.[0]?.message?.function_call?.arguments
    );

    const usefulFilesArray = useful_files_csv.split(",").splice(0, sample_size);

    return usefulFilesArray;
  } catch (error) {
    console.warn({error});
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

      if (!code?.content) {
        return;
      }

      code = code.content;
      code = Buffer.from(code, "base64").toString("ascii");

      return { fileName: file, fileContent: code };
    });

    // Wait for all promises to resolve
    let filesWithContent = await Promise.all(promises);

    // Remove any undefined values
    filesWithContent = filesWithContent.filter((file: any) => file);

    return filesWithContent;
  } catch (error) {
    console.warn(error);
    return false;
  }
};

const getUsefulFilePrompts = async (user: any, files: any) => {
  try {
    const promises = files.map(async (file: any) => {
      if (!file.fileContent) {
        return;
      }

      try {
        const { prompt: trainingPrompt } = await generateTrainingPrompts(
          file.fileContent
        );

        const response = await sendLLM(user?.email, trainingPrompt);

        const prompt = response?.choices?.[0]?.message?.content;

        return {
          fileName: file.fileName,
          fileContent: file.fileContent,
          userPrompt: prompt,
        };
      } catch (error) {
        console.warn(error);
        return;
      }
    });

    let filesWithPrompts = await Promise.all(promises);

    // Remove any undefined values
    filesWithPrompts = filesWithPrompts.filter((file: any) => file);

    return filesWithPrompts;
  } catch (error) {
    console.warn(error);
    return false;
  }
};

const addMessage = async (
  messages: any,
  userMessage: string,
  assistantMessage: string,
  fileName: string,
  systemPrompt: string
) => {
  const codeBlock = "````";

  if (TRAIN_FOR_ENCODING) {
    //train for encoding
    messages.push(
      {
        role: "user",
        content: String(userMessage),
      },
      {
        role: "assistant",
        content: `
				${codeBlock} ${fileName}
				${assistantMessage}
				${codeBlock}
					`,
      }
    );
  } else {
    //train for fine-tuning
    messages.push({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: String(userMessage),
        },
        {
          role: "assistant",
          content: `
	Sure! Here you go:
	${codeBlock}${fileName}
	${assistantMessage}
	${codeBlock}
					`,
        },
      ],
    });
  }

  return messages;
};
