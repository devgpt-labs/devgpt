"use client";
import { useEffect, useState, useContext, useMemo } from "react";
import { ConversationStyleToggle } from "./RateConversation";
import { Header } from "./ChatHeader";
import { PromptInput } from "./PromptInput";
import { useSessionContext } from "@/context/useSessionContext";
import {
  Box,
  Tooltip,
  Flex,
  Text,
  SkeletonText,
} from "@chakra-ui/react";
import Profile from "@/app/repos/Profile";

//prompts
import userPrompt from "@/app/prompts/user";

//components
import Response from "@/app/components/Response";
import Loader from "@/app/components/Loader";

//utils
import { supabase } from "@/utils/supabase";
import { savePrompt } from "@/utils/savePrompt";
import getTokensFromString from "@/utils/getTokensFromString";
import getTokenLimit from "@/utils/getTokenLimit";
import getPromptCount from "@/utils/getPromptCount";

const Chat = () => {
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [failMessage, setFailMessage] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [promptCount, setPromptCount] = useState<number>(0);
  const { user, session, messages, methods, repo }: any = useSessionContext();

  useEffect(() => {
    getPromptCount(user, setPromptCount)
  }, [])

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

    if (promptCount > 10) {
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

    methods.setMessages(newMessages);

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
    <Flex direction="column" maxW="full" flex={{ md: "initial", base: 1 }}>
      <Box
        w="4xl"
        maxW="full"
        rounded="lg"
        className="overflow-hidden p-5 flex flex-col border border-blue-800/40 shadow-2xl shadow-blue-900/30"
        flex={{ md: "initial", base: 1 }}
        justifyContent={{ md: "flex-start", base: "space-between" }}
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
