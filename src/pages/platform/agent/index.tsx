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
  Spinner,
  Tooltip,
  IconButton,
  Badge,

} from "@chakra-ui/react";
import { useChat } from "ai/react";
import Cookies from "js-cookie";
import Link from "next/link";

//stores
import repoStore from "@/store/Repos";
import authStore from "@/store/Auth";
import messageStore from "@/store/Messages";

//prompts
import userPrompt from "@/prompts/user";

//components
import Template from "@/components/Template";
import Response from "@/components/Response";
import Profile from "@/components/repos/Profile";
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
import getModels from "@/utils/getModels";
import { useRouter } from "next/router";
import Models from "../models";

import { BsDiscord, BsGithub } from "react-icons/bs";


const Chat = () => {
  // Constants
  const [promptCount, setPromptCount] = useState<number>(0);

  // Sending prompts
  const [loading, setLoading] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const [failMessage, setFailMessage] = useState<string>("");

  // Load state
  const [initialMessages, setInitialMessages] = useState<any>([]);
  const [response, setResponse] = useState<string>("");

  // Active state
  const [hasSentAMessage, setHasSentAMessage] = useState<boolean>(true);
  const [previousPrompt, setPreviousPrompt] = useState<string>("");
  const [trainingDataRetrieved, setTrainingDataRetrieved] =
    useState<boolean>(false);
  const [correctedPrompt, setCorrectedPrompt] = useState<string>("");
  const [activeOnDiscord, setActiveOnDiscord] = useState<number>(0);
  const [models, setModels] = useState<any>([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const { messages: savedMessages }: any = messageStore();
  const { repo, lofaf, repoWindowOpen, setRepoWindowOpen }: any = repoStore();
  const { colorMode } = useColorMode();
  const { user, session, stripe_customer_id, fetch }: any = authStore();

  const { messages, handleInputChange, handleSubmit } = useChat({
    initialMessages: initialMessages,
  });

  // Find the model in the models table that has the same name and owner


  const getDiscordOnline = async () => {
    try {
      const response = await fetch(
        "https://discord.com/api/guilds/931533612313112617/widget.json"
      );
      console.log({ response });

      const json = await response.json();
      return json.presence_count;
    } catch (error) {
      console.log(error);

      // Handle errors here
      console.error("Error fetching Discord data:", error);
      return null;
    }
  };

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

  const fetchData = async () => {
    const count: any = await getDiscordOnline();
    if (count !== null) {
      setActiveOnDiscord(count);
    }
  };

  useEffect(() => {
    fetchData();
    fetch();

    // Log the user out if they are not logged in
    if (!user) {
      router.push("/", undefined, { shallow: true });
      return;
    }

    retrieveTrainingData();

    getModels(
      (data: any) => {
        setModels(data)
      },
      () => { },
      stripe_customer_id
    );

    const model = models?.find(
      (model: any) => model?.repo === repo?.repo
    );

    setInitialMessages(model?.messages || []);
  }, []); // Empty dependency array means this effect runs once when the component mounts

  // This logic breaks down the prompt to find @'d files
  const regex = /@([^ ]+)/g;
  const withAt: any = [];
  let match: any;
  while ((match = regex.exec(prompt))) {
    withAt.push(match[1]);
  }

  useEffect(() => {
    setLoading(false);
  }, [messages]);

  useEffect(() => {
    retrieveTrainingData();
  }, [repo, savedMessages.length]);

  useEffect(() => {
    if (promptCount != 0) return;
    getPromptCount(user?.email, setPromptCount);
  }, [user?.email]);

  // todo move this to session context
  if (!user) return null;

  // Get the current file being targeted with @
  const selectedFile = lofaf?.filter((file: any) => {
    if (file?.toLowerCase()?.includes(withAt?.[0]?.toLowerCase())) {
      return file;
    }
  });

  console.log(messages);


  // If the user clicks tab, we want to autocomplete the file name
  const handleKeyDown = (file: any) => {
    // Append currentSuggestion to prompt
    const promptArray = prompt.split(" ");
    const lastWord = promptArray[promptArray?.length - 1];
    const newPrompt = prompt.replace(lastWord, `~${file}`);

    // Set prompts
    setPrompt(newPrompt);

    // Refocus on input
    const input = document.getElementById("message");
    input?.focus();
  };

  const submitChecks = async (
    ignoreFeedback: boolean,
    useOriginalPrompt?: boolean
  ) => {
    setLoading(true);
    setFailMessage("");
    setPreviousPrompt(prompt);
    setLoading(true);

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
      setLoading(false);
      setFailMessage(
        "You have reached your prompt limit for today, upgrade or check back tomorrow!"
      );
      return false;
    }

    if (tokensInString > tokenLimit) {
      setLoading(false);
      setFailMessage(
        "Your prompt is too long currently to run, try to include less files and more precise information."
      );
      return false;
    }

    return true;
  };

  return (
    <Template>
      <Flex
        overflowY="scroll"
        width="full"
        direction="column"
        maxW="90%"
        py={6}
      >
        <Box
          rounded="lg"
          className="overflow-hidden p-5 flex flex-col border border-blue-800/40 shadow-2xl shadow-blue-900/30"
          justifyContent="flex-start"
        >
          <Header />
          {!repo.repo && (
            <Link href="/platform/models">
              <Button width="100%" mt={4}>
                Train a model to get started
              </Button>
              <Text fontSize={12} mt={2}>
                {failMessage}
              </Text>
            </Link>
          )}
          {initialMessages.length === 0 && repo.repo && (
            <Text mt={4}>Your model is <Badge>Training</Badge>, the AI until this is done won't be able to access your repos context.</Text>
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
                    if (prompt.length < 3) {
                      return;
                    }

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
                  width="10rem"
                  onClick={async (e: any) => {
                    const checks = await submitChecks(false);
                    if (!checks) return null;
                    handleSubmit(e);
                  }}
                >
                  {loading ? <Spinner size="sm" /> : "Submit"}
                </Button>
              </Flex>
              <Flex mb={3}>
                <Text mt={2} fontSize={14}>
                  {failMessage}
                </Text>
                <SlideFade in={hasSentAMessage} offsetY="20px">
                  {/* <Heading mt={5}>{previousPrompt}</Heading> */}
                </SlideFade>
              </Flex>
              {loading && !messages[messages.length - 1] ? (
                <SkeletonText
                  mb={2}
                  mt={4}
                  noOfLines={4}
                  spacing={4}
                  skeletonHeight="2"
                />
              ) : (
                <Response
                  content={String(messages[messages.length - 1]?.content)}
                />
              )}
            </Box>
          )}

          {messages[messages.length - 1] && loading && (
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
                  setLoading(false);
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
        <Flex mt={2} gap={2} >
          <Tooltip label="Join Discord" placement="top">
            <Link isExternal={true} href="https://discord.com/invite/6GFtwzuvtw">
              <IconButton
                _hover={{
                  transform: "translateY(-4px)",
                  transition: "all 0.2s ease-in-out",
                }}
                aria-label="Join Discord"
                icon={
                  <Flex flexDirection="row" px={3}>
                    <BsDiscord />
                    <Text ml={2} fontSize={14}>
                      {/* {activeOnDiscord && `Online: ${activeOnDiscord}`} */}
                      Active
                    </Text>
                  </Flex>
                }
              />
            </Link>
          </Tooltip>
          <Tooltip label="Github Stars" placement="top">
            <Link isExternal={true} href="https://github.com/">
              <IconButton
                _hover={{
                  transform: "translateY(-4px)",
                  transition: "all 0.2s ease-in-out",
                }}
                aria-label="Github Stars"
                icon={
                  <Flex flexDirection="row" px={3}>
                    <BsGithub />
                    <Text ml={2} fontSize={14}>
                      332
                    </Text>
                  </Flex>
                }
              />
            </Link>
          </Tooltip>
        </Flex>
        <PromptCorrectionModal
          correctedPrompt={correctedPrompt}
          setCorrectedPrompt={setCorrectedPrompt}
          prompt={previousPrompt}
          setPrompt={setPrompt}
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={handleSubmit}
          setLoading={setLoading}
        />
      </Flex>
    </Template>
  );
};

export default Chat;
