"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  SkeletonText,
  Input,
  Button,
  useColorMode,
} from "@chakra-ui/react";
import { useChat } from "ai/react";
import Cookies from "js-cookie";

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
import { RateConversation } from "./RateConversation";
import { Header } from "./ChatHeader";

//utils
import { savePrompt } from "@/utils/savePrompt";
import getTokensFromString from "@/utils/getTokensFromString";
import getTokenLimit from "@/utils/getTokenLimit";
import getPromptCount from "@/utils/getPromptCount";
import { checkIfPro } from "@/utils/checkIfPro";

const Chat = () => {
  const [response, setResponse] = useState<string>("");
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [failMessage, setFailMessage] = useState<string>("");
  const [promptCount, setPromptCount] = useState<number>(0);
  const [prompt, setPrompt] = useState<string>("");
  const [trainingDataRetrieved, setTrainingDataRetrieved] =
    useState<boolean>(false);

  const { messages: savedMessages }: any = messageStore();
  const { repo }: any = repoStore();
  const { colorMode } = useColorMode();
  const { user, session }: any = authStore();

  const { messages, initialMessages, handleInputChange, handleSubmit } =
    useChat();

  useEffect(() => {
    if (promptCount != 0) return;
    getPromptCount(user?.email, setPromptCount);
  }, [user?.email]);

  const retrieveTrainingData = async () => {
    if (savedMessages.length > 0) {
      setTrainingDataRetrieved(true);
      initialMessages(savedMessages);
      return;
    } else {
      //load from cookies
      const trainingData = await Cookies.get(
        `${repo.owner}_${repo.name}_training`
      );
      if (!trainingData) return;
      setTrainingDataRetrieved(true);
      initialMessages(JSON.parse(String(trainingData)));
    }
  };

  useEffect(() => {
    retrieveTrainingData();
  }, [repo]);

  useEffect(() => {
    retrieveTrainingData();
  }, []);

  // todo move this to session context
  if (!user) return null;

  const submitChecks = async () => {
    setIsLoading(true);
    setFailMessage("");

    const modifiedPrompt = await userPrompt(
      prompt,
      repo.owner,
      repo.repo,
      String(session?.provider_token)
    );

    const target: any = { target: { value: modifiedPrompt } };

    handleInputChange(target);

    const tokensInString = await getTokensFromString(modifiedPrompt);
    const tokenLimit = await getTokenLimit(user.email);
    const isPro = await checkIfPro(user.email);

    if (!isPro && promptCount > 16) {
      setIsLoading(false);
      setFailMessage(
        "You have reached your prompt limit for today, upgrade or check back tomorrow!"
      );
      return false;
    }

    if (tokensInString > tokenLimit) {
      setIsLoading(false);
      setFailMessage(
        "Your prompt is too long currently to run, try to include less files and more precise information."
      );
      return false;
    }

    return true;
  };

  if (!trainingDataRetrieved) {
    return <Text>Please train a model before chatting with it.</Text>;
  }

  return (
    <Flex direction="column" w="full" maxW="6xl" maxH="70vh" my={40}>
      <Box
        rounded="lg"
        className="overflow-hidden p-5 flex flex-col border border-blue-800/40 shadow-2xl shadow-blue-900/30"
        justifyContent="flex-start"
      >
        <Header />
        <Box className="max-h-[50vh] overflow-y-auto">
          <Flex flexDirection="row" mt={4}>
            <Input
              className="fixed w-full max-w-md bottom-0 border border-gray-300 rounded mb-8 shadow-xl p-2 dark:text-black"
              value={prompt}
              placeholder="Describe your business..."
              onChange={(e: any) => {
                setPrompt(e.target.value);
              }}
            />
            <Button
              bgGradient={"linear(to-r, blue.500, teal.500)"}
              ml={4}
              onClick={async (e: any) => {
                const checks = await submitChecks();
                if (!checks) return null;
                handleSubmit(e);
              }}
            >
              Submit
            </Button>
          </Flex>
          {isLoading && !completion ? (
            <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
          ) : (
            <Response content={String(completion)} />
          )}
        </Box>
        {completion && isFinished && (
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
              Start A New Chat
            </Button>
          </Flex>
        )}
        {/* <PromptInput
          promptCount={promptCount}
          prompt={prompt}
          setPrompt={setPrompt}
          isLoading={isLoading}
          onSubmit={(prompt: any) => submitHandler(prompt)}
        /> */}
        <Text mt={2} fontSize={14}>
          {failMessage}
        </Text>
      </Box>
      <Profile />
    </Flex>
  );
};

export default Chat;
