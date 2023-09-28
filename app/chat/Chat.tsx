"use client";
import { useEffect, useState } from "react";
import { useSessionContext } from "@/context/useSessionContext";
import {
  Box,
  Flex,
  Input,
  Text,
  SkeletonText,
  Button,
  useColorMode,
} from "@chakra-ui/react";

//prompts
import userPrompt from "@/app/prompts/user";

//components
import Response from "@/app/components/Response";
import Profile from "@/app/repos/Profile";
import { PromptInput } from "./PromptInput";
import { RateConversation } from "./RateConversation";
import { Header } from "./ChatHeader";
import { useCompletion } from "ai/react";

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
  const { user, session, messages, methods, repo }: any = useSessionContext();
  const { colorMode } = useColorMode();

  useEffect(() => {
    if (promptCount != 0) return;
    getPromptCount(user?.email, setPromptCount);
  }, [user.email]);

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

    if (!isPro && promptCount > 7) {
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

  const { completion, input, handleInputChange, handleSubmit } =
    useCompletion();

  if (!user) return null;

  return (
    <Flex direction="column" w="full" maxW="6xl">
      <Box
        rounded="lg"
        className="overflow-hidden p-5 flex flex-col border border-blue-800/40 shadow-2xl shadow-blue-900/30"
        justifyContent="flex-start"
      >
        <Header />
        <Box className="mx-auto w-full max-w-md py-24 flex flex-col stretch">
          <Input
            className="fixed w-full max-w-md bottom-0 border border-gray-300 rounded mb-8 shadow-xl p-2 dark:text-black"
            value={input}
            placeholder="Describe your business..."
            onChange={handleInputChange}
          />
          <Button onClick={handleSubmit}>Submit</Button>
          <Text>{input}</Text>
          <Text className="whitespace-pre-wrap my-6">{completion}</Text>
        </Box>
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
        {isFinished && (
          <Flex
            width="100%"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            mt={2}
          >
            <RateConversation />
            <Text mx={4}>or</Text>
            <Button
              px={4}
              _hover={{
                bg: colorMode === "light" ? "gray.300" : "black",
              }}
              bg={colorMode === "light" ? "white" : "gray.800"}
              alignSelf="center"
              rounded="full"
              onClick={() => {
                setIsFinished(false);
                setIsLoading(false);
                setResponse("");
                setFailMessage("");
              }}
            >
              Start A New Session
            </Button>
          </Flex>
        )}

        <PromptInput
          promptCount={promptCount}
          prompt={prompt}
          setPrompt={setPrompt}
          isLoading={isLoading}
        // onSubmit={handleSubmit}
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
