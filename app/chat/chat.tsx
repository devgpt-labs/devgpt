"use client";
import { useEffect, useState, useContext } from "react";
import { ConversationStyleToggle } from "./RateConversation";
import { Header } from "./ChatHeader";
import { PromptInput } from "./PromptInput";
import { useSessionContext } from "@/context/useSessionContext";
import { Box, Tag, Flex, Text, Spinner, SlideFade } from "@chakra-ui/react";
import Profile from "../repos/profile";
//prompts
import userPrompt from "@/app/prompts/user";

//components
import Response from "@/app/components/Response";
import Loader from "@/app/components/Loader";

const Chat = () => {
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const { user, session, messages, methods, repo } = useSessionContext();

  //todo move this to session context
  if (!user) return null;

  const submitHandler = async (prompt: string) => {
    setIsLoading(true);
    setResponse("");
    setPrompt("");
    setIsFinished(false);

    prompt = await userPrompt(
      prompt,
      repo.owner,
      repo.repo,
      String(session?.provider_token)
    );

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
      if (doneReading) {
        setIsFinished(true);
        break;
      }

      const chunkValue = decoder.decode(value);
      completeResponse += chunkValue;

      setResponse(completeResponse);
    }

    setIsLoading(false);
  };

  return (
    <Flex
      mt={10}
      direction="column"
      maxW="full"
      flex={{ md: "initial", base: 1 }}
    >
      <Box
        w="4xl"
        maxW="full"
        rounded="lg"
        className="oversflow-hidden text-slate-400 p-5 flex flex-col border border-blue-800/40 shadow-2xl shadow-blue-900/30"
        flex={{ md: "initial", base: 1 }}
        justifyContent={{ md: "flex-start", base: "space-between" }}
      >
        <Header />
        <Box className="text-slate-50 max-h-[50vh] overflow-y-auto">
          {prompt && (<Text>{prompt}</Text>)}
          {isLoading && !response && <Loader />}
          {response && <Response content={String(response)} />}
        </Box>
        <ConversationStyleToggle visible={isFinished} />
        <PromptInput
          prompt={prompt}
          setPrompt={setPrompt}
          isLoading={isLoading}
          onSubmit={(prompt: any) => submitHandler(prompt)}
        />
      </Box>
      <Profile />
    </Flex>
  );
};

export default Chat;
