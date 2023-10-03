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
  SlideFade,
  Kbd,
  Tag,
  useDisclosure,
  Heading,
} from "@chakra-ui/react";
import { useChat } from "ai/react";
import Cookies from "js-cookie";

//stores
import repoStore from "@/store/Repos";
import authStore from "@/store/Auth";
import messageStore from "@/store/Messages";

//prompts
import userPrompt from "@/prompts/user";

//components
import Response from "@/components/Response";
import Profile from "@/components/repos/Profile";
import Training from "@/components/repos/Training";
import { PromptInput } from "./PromptInput";
import { RateConversation } from "./RateConversation";
import { Header } from "./ChatHeader";
import PromptCorrectionModal from "@/components/PromptCorrectionModal";

//utils
import { savePrompt } from "@/utils/savePrompt";
import getTokensFromString from "@/utils/getTokensFromString";
import getTokenLimit from "@/utils/getTokenLimit";
import getPromptCount from "@/utils/getPromptCount";
import { checkIfPro } from "@/utils/checkIfPro";
import Calculator from "@/components/repos/Calculator";
import promptCorrection from "@/utils/promptCorrection";

const Chat = () => {
  const [response, setResponse] = useState<string>("");
  const [initialMessages, setInitialMessages] = useState<any>([]);
  const [hasSentAMessage, setHasSentAMessage] = useState<boolean>(true);

  const [previousPrompt, setPreviousPrompt] = useState<string>("");
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [failMessage, setFailMessage] = useState<string>("");
  const [promptCount, setPromptCount] = useState<number>(0);
  const [prompt, setPrompt] = useState<string>("");
  const [trainingDataRetrieved, setTrainingDataRetrieved] =
    useState<boolean>(false);
  const [correctedPrompt, setCorrectedPrompt] = useState<string>("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { messages: savedMessages }: any = messageStore();
  const { repo, lofaf, repoWindowOpen, setRepoWindowOpen }: any = repoStore();
  const { colorMode } = useColorMode();
  const { user, session }: any = authStore();

  const { messages, handleInputChange, handleSubmit } = useChat({
    initialMessages: initialMessages,
  });

  // This logic breaks down the prompt to find @'d files
  const regex = /@([^ ]+)/g;
  const withAt: any = [];
  let match: any;
  while ((match = regex.exec(prompt))) {
    withAt.push(match[1]);
  }

  const retrieveTrainingData = async () => {
    if (savedMessages.length > 0) {
      setTrainingDataRetrieved(true);
      setInitialMessages(savedMessages);
      return;
    } else {
      //load from cookies
      const trainingData = await Cookies.get(
        `${repo.owner}_${repo.name}_training`
      );

      if (!trainingData) return;
      setTrainingDataRetrieved(true);
      setInitialMessages(JSON.parse(String(trainingData)));
    }
  };

  useEffect(() => {
    retrieveTrainingData();
  }, [repo, savedMessages.length]);

  useEffect(() => {
    retrieveTrainingData();
  }, []);

  // todo move this to session context
  if (!user) return null;

  // Get the current file being targeted with @
  const selectedFile = lofaf?.filter((file: any) => {
    if (file?.toLowerCase()?.includes(withAt?.[0]?.toLowerCase())) {
      return file;
    }
  });

  // If the user clicks tab, we want to autocomplete the file name
  const handleKeyDown = (file: any) => {
    // Append currentSuggestion to prompt
    const promptArray = prompt.split(" ");

    const lastWord = promptArray[promptArray?.length - 1];
    const newPrompt = prompt.replace(lastWord, `~${file}`);

    setPrompt(newPrompt);
    // Refocus on input
    const input = document.getElementById("message");
    input?.focus();
  };

  useEffect(() => {
    if (promptCount != 0) return;
    getPromptCount(user?.email, setPromptCount);
  }, [user?.email]);

  // todo move this to session context
  if (!user) return null;

  const submitChecks = async (
    ignoreFeedback: boolean,
    useOriginalPrompt?: boolean
  ) => {
    setIsLoading(true);
    setFailMessage("");
    setPreviousPrompt(prompt);

    let promptFeedback;

    if (!ignoreFeedback) {
      promptFeedback = await promptCorrection(prompt, lofaf);

      if (promptFeedback?.changes) {
        //display promptCorrection modal
        setCorrectedPrompt(promptFeedback?.correctedPrompt);
        onOpen();
        return false;
      }
    }

    const newPrompt =
      ignoreFeedback && !useOriginalPrompt ? correctedPrompt || prompt : prompt;

    let target: any = {
      target: { value: newPrompt },
    };

    setHasSentAMessage(true);
    handleInputChange(target);
    setPreviousPrompt(newPrompt);
    setPrompt("");

    const modifiedPrompt = await userPrompt(
      newPrompt,
      repo.owner,
      repo.repo,
      String(session?.provider_token)
    );

    target = { target: { value: modifiedPrompt } };

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

  console.log(messages);


  return (
    <Flex overflowY="scroll" width="full" direction="column" maxW="6xl" my={20}>
      <Box
        rounded="lg"
        className="overflow-hidden p-5 flex flex-col border border-blue-800/40 shadow-2xl shadow-blue-900/30"
        justifyContent="flex-start"
      >
        <Header />
        {!repo.repo && (
          <>
            <Button
              width="100%"
              mt={4}
              onClick={() => {
                setRepoWindowOpen(!repoWindowOpen);
              }}
            >
              Select a repo to get started
            </Button>
            <Text fontSize={12} mt={2}>
              {failMessage}
            </Text>
          </>
        )}
        {repo.repo && (
          <Box className="max-h-[50vh] overflow-y-auto">
            {withAt?.length > 0 && (
              <Flex alignItems={"center"} my={2}>
                <Kbd>Tab</Kbd>
                <Text ml={1}> to accept suggestion</Text>
              </Flex>
            )}
            <Flex flexDirection="row" flexWrap="wrap">
              <SlideFade key={match} in={selectedFile[0] ? true : false}>
                {selectedFile.map((file: any, index: any) => {
                  if (index > 12) return null;
                  return (
                    <Tag
                      mr={1}
                      mb={1}
                      key={file}
                      cursor="pointer"
                      onClick={() => handleKeyDown(file)}
                    >
                      {file}
                    </Tag>
                  );
                })}
              </SlideFade>
            </Flex>
            <Flex flexDirection="row" mt={4}>
              <Input
                className="fixed w-full max-w-md bottom-0 border border-gray-300 rounded mb-8 shadow-xl p-2 dark:text-black"
                value={prompt}
                placeholder="Enter your task, e.g. Create a login page, or use @ to select a file from your repo."
                onChange={(e: any) => {
                  setPrompt(e.target.value);
                }}
                onKeyDown={async (e: any) => {
                  // If key equals tab, autocomplete
                  if (e.key === "Tab") {
                    e.preventDefault();
                    handleKeyDown(selectedFile[0]);
                    return;
                  }

                  // If key equals enter, submit
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    const checks = await submitChecks(false);
                    if (!checks) return null;
                    handleSubmit(e);
                  }
                }}
              />
              <Button
                bgGradient={"linear(to-r, blue.500, teal.500)"}
                color="white"
                ml={4}
                onClick={async (e: any) => {
                  const checks = await submitChecks(false);
                  if (!checks) return null;
                  handleSubmit(e);
                }}
              >
                Submit
              </Button>
            </Flex>
            <Flex mb={3}>
              <Text mt={2} fontSize={14}>
                {failMessage}
              </Text>
              <SlideFade in={hasSentAMessage} offsetY="20px">
                <Heading mt={5}>{previousPrompt}</Heading>
              </SlideFade>
            </Flex>
            {isLoading && !messages[messages.length - 1] ? (
              <SkeletonText
                mt="4"
                noOfLines={4}
                spacing="4"
                skeletonHeight="2"
              />
            ) : (
              <Response
                content={String(messages[messages.length - 1]?.content)}
              />
            )}
          </Box>
        )}

        {messages[messages.length - 1] && isFinished && (
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
      </Box>
      <Profile />
      <PromptCorrectionModal
        correctedPrompt={correctedPrompt}
        prompt={previousPrompt}
        isOpen={isOpen}
        onClose={onClose}
        submitHandlerReject={async (e: any) => {
          const checks = await submitChecks(true, false);
          if (!checks) return null;
          handleSubmit(e);
        }}
        submitHandler={async (e: any) => {
          const checks = await submitChecks(true);
          if (!checks) return null;
          handleSubmit(e);
        }}
      />
    </Flex>
  );
};

export default Chat;
