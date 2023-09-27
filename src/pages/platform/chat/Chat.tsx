"use client";
import { useEffect, useState } from "react";
import { Box, Flex, Text, SkeletonText } from "@chakra-ui/react";

//stores
import repoStore from "@/store/Repos";
import messageStore from "@/store/Messages";
import authStore from "@/store/Auth";

//prompts
import userPrompt from "@/prompts/user";

//components
import Response from "@/components/Response";
import Profile from "@/components/repos/Profile";
import { PromptInput } from "./PromptInput";
import { ConversationStyleToggle } from "./RateConversation";
import { Header } from "./ChatHeader";

//utils
import { savePrompt } from "@/utils/savePrompt";
import getTokensFromString from "@/utils/getTokensFromString";
import getTokenLimit from "@/utils/getTokenLimit";
import getPromptCount from "@/utils/getPromptCount";
import { checkIfPro } from "@/utils/checkIfPro";

const Chat = () => {
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [failMessage, setFailMessage] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [promptCount, setPromptCount] = useState<number>(0);

  const { repo }: any = repoStore();
  const { messages, setMessages }: any = messageStore();
  const { user, session }: any = authStore();

  useEffect(() => {
    if (promptCount != 0) return;
    getPromptCount(user?.email, setPromptCount);
  }, [user.email]);

  // todo move this to session context
  if (!user) return null;

  const submitHandler = async (prompt: string) => {
    setIsLoading(true);
    setResponse("");
    setPrompt("");
    setIsFinished(false);
    setFailMessage("");

    prompt = await userPrompt(
      prompt,
      repo.owner,
      repo.repo,
      String(session?.provider_token)
    );

    const tokensInString = await getTokensFromString(prompt);
    const tokenLimit = await getTokenLimit(user.email);
    const isPro = await checkIfPro(user.email);

    if (promptCount > 75 && !isPro) {
      setIsLoading(false);
      setFailMessage(
        "You have reached your prompt limit for today, upgrade or check back tomorrow!"
      );
      return null;
    }

    if (tokensInString > tokenLimit) {
      setIsLoading(false);
      setFailMessage(
        "Your prompt is too long currently to run, try to include less files and more precise information."
      );
      return null;
    }

    const newMessages: Array<any> = [
      ...messages,
      { role: "user", content: String(prompt) },
    ];

    setMessages(newMessages);

    const response: Response = await fetch("/api/llms", {
      method: "POST",
      body: JSON.stringify({ messages: newMessages }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();

    let completeResponse = "";

    while (true) {
      const { value, done: doneReading } = await reader.read();
      const chunkValue = decoder.decode(value);

      completeResponse += chunkValue;
      if (doneReading) {
        setIsFinished(true);
        savePrompt(String(user.email), prompt.trim(), String(completeResponse));
        break;
      }

      setResponse(completeResponse);
    }

    setIsLoading(false);
  };

  return (
    <Flex direction="column" w="full" maxW="6xl">
      <Box
        rounded="lg"
        className="overflow-hidden p-5 flex flex-col border border-blue-800/40 shadow-2xl shadow-blue-900/30"
        justifyContent="flex-start"
      >
        <Header />
        <Box className="max-h-[50vh] overflow-y-auto">
          {isLoading && !response && (
            <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
          )}
          {response && (
            <>
              <Response content={String(response)} />
            </>
          )}
        </Box>
        <ConversationStyleToggle visible={isFinished} />
        <PromptInput
          promptCount={promptCount}
          prompt={prompt}
          setPrompt={setPrompt}
          isLoading={isLoading}
          onSubmit={(prompt: any) => submitHandler(prompt)}
        />
        <Text mt={2} fontSize={14}>
          {failMessage}
        </Text>
      </Box>
      <Profile />
    </Flex>
  );
};

export default Chat;
