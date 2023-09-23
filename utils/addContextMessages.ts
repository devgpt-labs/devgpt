import { Message } from "@/app/types/chat";
//prompts
import { system } from "@/app/prompts/system";
import sendLLM from "./sendLLM";
import getTokenLimit from "./getTokenLimit";
import getTokensFromString from "./getTokensFromString";
import getCode from "./github/getCode";

const createContextMessages = async (
  messages: Message[],
  lofaf: string,
  owner: string,
  repo: string,
  access_token: string,
  emailAddress: string
) => {
  let newMessages: any = messages;

  if (!lofaf) {
    return newMessages;
  }

  try {
    newMessages.push({
      role: "system",
      content: system(), //add system message
    });

    // add context messages
    newMessages = addContext(
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

export default createContextMessages;

//todo move these interfaces
interface UsefulFile {
  fileName: string;
}

interface UsefulFileContent {
  fileName: string;
  fileContent: string;
}

interface UsefulFilePrompt {
  fileName: string;
  fileContent: string;
  userPrompt: string;
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
  //send lofaf to the LLM and get back an array of useful files.

  try {
    //todo move this to prompts folder
    const response = await sendLLM(
      `
		You are about to help a software developer with their job.
		This is the files in their project: "${lofaf}".
		Return an example of a front-end and back-end file that you can use to understand the developer's coding style.
		E.g. "MyFrontEndComponent.tsx", "my-back-end-route.ts", "README.md" 
		Pick 5 files max.
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

    const usefulFilesArray = useful_files_csv.split(",").splice(0, 5);

    console.log({ usefulFilesArray });

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
      let code = await getCode(owner, repo, file, access_token);
      code = code.content;
      code = Buffer.from(code, "base64").toString("ascii");

      return { fileName: file, fileContent: code };
    });

    // Wait for all promises to resolve
    const filesWithContent = await Promise.all(promises);

    console.log({ filesWithContent });
    return filesWithContent;
  } catch (error) {
    console.warn(error);
    return false;
  }
};

const getUsefulFilePrompts = async (files: any) => {
  //what prompts would the user enter to generate this file?

  try {
    const promises = files.map(async (file: any) => {
      let prompt = "";

      //here

      return {
        fileName: file.fileName,
        fileContent: file.fileContent,
        userPrompt: prompt,
      };
    });

    // Wait for all promises to resolve
    const filesWithPrompts = await Promise.all(promises);

    console.log({ filesWithPrompts });
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
  //todo this shouldn't be a hardcoded cap, it should come from your plan (8k or 32k)
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

// newMessages.push({
// 	role: "assistant",
// 	content: "Generate a readme for my project",
// });

// newMessages.push({
// 	role: "assistant",
// 	content: `# DevGPT: We're building the world's best open-source dev agent.

// 				## Table of Contents

// 				1. [Introduction](#Introduction)
// 				1. [Installation](#Installation)
// 				1. [Features](#Features)
// 				1. [How It Works](#How-It-Works)
// 				1. [Key Outcomes](#Key-Outcomes)
// 				1. [FAQs](#FAQs)
// 				1. [Getting Started for Open-Source Contributors](#Getting-Started-for-Open-Source-Contributors)
// 				1. [Support](#Support)

// 				## Introduction

// 				Welcome to **DevGPT**, the AI-driven development tool designed to transform the way you code. Created to assist developers in achieving their maximum potential, DevGPT is not just an auto-completion tool; it's your AI-powered dev-agent powered by gpt-4-32k and other models.

// 				## Features

// 				- **Code Generation**: Enter a prompt and get your required code generated.
// 				- **Personalized Training**: Our AI model trains on your code repository to generate code that perfectly fits into your codebase.
// 				- **Follow-Up Prompts**: Need to modify generated code? Just enter follow-up prompts.

// 				## How It Works

// 				1. **Type Your Prompt**: Simply enter a prompt describing the code you need.
// 				1. **Wait for Generation**: Our model takes an average of 40 seconds to generate your code.
// 				1. **Optional Follow-Up Prompts**: If you wish to modify the generated code, you can enter follow-up prompts.

// 				## Key Outcomes

// 				- **Write Unit Tests**: Automatically generate unit tests for your codebase.
// 				- **Write Complex Functions**: No need to fret over complex algorithms; let DevGPT handle them.
// 				- **Create Components**: Create UI/UX components effortlessly.
// 				- **Debug**: Troubleshoot issues in your code easily.

// 				## Bounty board (For OSS contributors)

// 				| Task                                                                                                      | Reward |
// 				| --------------------------------------------------------------------------------------------------------- | ------ |
// 				| Updating documentation                                                                                    | $150   |
// 				| Add compatibility for Open-AI (repo currently only supports Azure, .env change only, no frontend changes) | $500   |

// 				## FAQs

// 				1. **Is this similar to Github Copilot?**
// 					 - No, we are not an autocomplete tool. We handle entire tasks, acting as your co-developer.
// 				1. **How much time will this save me?**
// 					 - Our average user saves 1.5 hours every day, allowing you to focus on more complex and fulfilling tasks.

// 				## Support

// 				For any queries, issues, or support needs, feel free to contact us at support@devgpt.com

// 				---

// 				**Happy Coding!**

// 				The DevGPT Team
// 				`,
// });

// newMessages.push({
// 	role: "user",
// 	content: "Make a component that the user can use to rate a conversation",
// });

// newMessages.push({
// 	role: "assistant",
// 	content: `

// 		Sure! Here you go...

// 		\`\`\`tsx
// 		"use client";
// 			import React, { FC, useState } from "react";
// 			import { Text, Center, Box, useToast, Button } from "@chakra-ui/react";

// 			export const ConversationStyleToggle = ({ visible }: any) => {
// 				const toast = useToast();

// 				const onClickHandler = () => {
// 					toast({
// 						title: "Thank you!",
// 						description: "Thank you for your feedback.",
// 						status: "success",
// 						duration: 4000,
// 						isClosable: true,
// 						position: "top-right",
// 					});
// 				};

// 				if (visible === false) return null;

// 				return (
// 					<Center>
// 						<Box mt={4} minW="60" className="bg-slate-900 rounded-full p-1">
// 							<ul className="flex justify-between gap-1 text-sm items-stretch">
// 								<ToggleItem onClick={onClickHandler}>👎</ToggleItem>
// 								<ToggleItem onClick={onClickHandler}>👍</ToggleItem>
// 								<ToggleItem onClick={onClickHandler}>❤️</ToggleItem>
// 								<ToggleItem onClick={onClickHandler}>👀</ToggleItem>
// 								<ToggleItem onClick={onClickHandler}>🚀</ToggleItem>
// 							</ul>
// 						</Box>
// 					</Center>
// 				);
// 			};

// 			interface ToggleItemProps {
// 				children?: React.ReactNode;
// 				onClick?: () => void;
// 			}

// 			const ToggleItem: FC<ToggleItemProps> = (props) => {
// 				return (
// 					<li
// 						onClick={props.onClick}
// 						className={\`border gap-2 border-transparent py-2 hover:bg-slate-800 cursor-pointer grow justify-center flex rounded-full flex-1 items-center\`}
// 					>
// 						<Box>
// 							<Text>{props.children}</Text>
// 						</Box>
// 					</li>
// 				);
// 			};\`\`\`
// 			`,
// });
