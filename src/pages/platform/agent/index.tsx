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
import { useRouter } from "next/router";
import Science from "@/components/repos/Science";

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
import RateConversation from "./RateConversation";
import ChatHeader from "./ChatHeader";
import PromptCorrectionModal from "@/components/PromptCorrectionModal";
import Models from "../models";
import Calculator from "@/components/repos/Calculator";

//utils
import { savePrompt } from "@/utils/savePrompt";
import { checkIfPro } from "@/utils/checkIfPro";
import getTokenLimit from "@/utils/getTokenLimit";
import getPromptCount from "@/utils/getPromptCount";
import promptCorrection from "@/utils/promptCorrection";
import getModels from "@/utils/getModels";
import getTokensFromString from "@/utils/getTokensFromString";
import calculateTokenCost from "@/utils/calculateTokenCost";
import chargeCustomer from "@/utils/stripe/chargeCustomer";
import trainModels from "@/utils/trainModels";

// Icons
import { BsDiscord, BsGithub, BsStars } from "react-icons/bs";
import getLofaf from "@/utils/github/getLofaf";

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
  const [hasBeenReset, setHasBeenReset] = useState<boolean>(false);
  const [models, setModels] = useState<any>([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { messages: savedMessages }: any = messageStore();
  const { repo, lofaf, setLofaf, setRepo }: any = repoStore();
  const { colorMode } = useColorMode();
  const { user, session, stripe_customer_id, fetch, signOut }: any =
    authStore();
  const { messages, handleInputChange, handleSubmit, input, reload } = useChat({
    initialMessages: initialMessages,
    onFinish: (data: any) => {
      const inputTokens = getTokensFromString(input);
      const responseTokens = getTokensFromString(
        String(messages[messages.length - 1]?.content)
      );

      const usage = inputTokens + responseTokens;
      const cost = calculateTokenCost(usage);

      chargeCustomer({ stripe_customer_id: stripe_customer_id }, cost);

      savePrompt(
        user?.email,
        prompt,
        messages[messages.length - 1]?.content,
        usage
      );
    },
  });

  useEffect(() => {
    // Train models on load
    trainModels(session, user, stripe_customer_id);

    // Get the users last used repo
    const lastUsedRepo = Cookies.get("recentlyUsedRepoKey");
    if (lastUsedRepo) {
      const lastUsedRepoObject = JSON.parse(lastUsedRepo);
      setRepo(lastUsedRepoObject);
    }
  }, []);

  const getDiscordOnline = async () => {
    try {
      const response = await fetch(
        "https://discord.com/api/guilds/931533612313112617/widget.json"
      );

      const json = await response.json();
      return json.presence_count;
    } catch (error) {
      console.log(error);

      // Handle errors here
      console.error("Error fetching Discord data:", error);
      return null;
    }
  };

  useEffect(() => {
    if (!session?.provider_token) {
      signOut();
      router.push("/", undefined, { shallow: true });
      console.log("no session found, returning to home");
    }

    if (!user) {
      signOut();
      router.push("/", undefined, { shallow: true });
      console.log("no user found, returning to home");
    }
  }, []);

  useEffect(() => {
    // Get all models
    getModels(
      (data: any) => {
        setModels(data);
      },
      () => { },
      stripe_customer_id
    );
  }, []);

  useEffect(() => {
    if (initialMessages.length !== 0) return;

    // Update the model to the newest selected one
    const model = models?.find((model: any) => model?.repo === repo?.repo);

    if (model?.output) {
      setInitialMessages(JSON.parse(model?.output));
    }

    getLofaf(repo.owner, repo.repo, session).then((data) => {
      if (!data?.tree) return console.log("no data found");
      const files = data?.tree?.map((file: any) => file.path);
      // set this
      setLofaf(files);
    });
  }, [repo, models]);

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
    if (promptCount != 0) return;
    getPromptCount(user?.email, setPromptCount);
  }, [user?.email]);

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
      promptFeedback = await promptCorrection(prompt, lofaf, {
        stripe_customer_id: stripe_customer_id,
      });

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
        direction="column"
        overflowY="scroll"
        flex={1}
        w="full"
        justifyContent={"center"}
        p={5}
      >
        <Box
          rounded="lg"
          className="overflow-hidden p-5 flex flex-col border border-blue-800/40 shadow-2xl shadow-blue-900/30"
          justifyContent="flex-start"
        >
          <ChatHeader />
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
          {initialMessages?.length === 0 && repo.repo ? (
            <Text mt={4} mb={4}>
              Your AI model is <Badge>Training</Badge>, until this is done the
              AI won't be able to access your repos context.
            </Text>
          ) : (
            <Text mt={4} mb={4}>
              Your trained AI model is{" "}
              <Badge colorScheme="teal">READY FOR PROMPTING</Badge>
            </Text>
          )}
          {repo.repo && (
            <Box maxH={"45vh"} overflowY={"auto"}>
              {withAt?.length > 0 && (
                <Flex alignItems={"center"} my={2}>
                  <Kbd>Tab</Kbd>
                  <Text ml={1}> to accept suggestion</Text>
                </Flex>
              )}
              <Flex flexDirection="row" flexWrap="wrap">
                <SlideFade key={match} in={selectedFile?.[0] ? true : false}>
                  {selectedFile?.map((file: any, index: any) => {
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
                  hasBeenReset={hasBeenReset}
                  initialMessages={initialMessages}
                  content={String(messages[messages.length - 1]?.content)}
                />
              )}
              <Flex flexDirection="row" mt={4}>
                <Input
                  className="fixed w-full max-w-md bottom-0 border border-gray-300 rounded mb-8 shadow-xl p-2 dark:text-black"
                  value={prompt}
                  placeholder="Enter your task, e.g. Create a login page, or use @ to select a file from your repo."
                  onChange={(e: any) => {
                    setPrompt(e.target.value);
                    handleInputChange(e);
                  }}
                  onKeyDown={async (e: any) => {
                    if (prompt.length < 3) {
                      return;
                    }

                    if (loading) return;

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
                      setHasBeenReset(false);
                      handleSubmit(e);
                    }
                  }}
                />
                <Button
                  bgGradient={"linear(to-r, blue.500, teal.500)"}
                  isDisabled={loading}
                  color="white"
                  ml={4}
                  width="10rem"
                  onClick={async (e: any) => {
                    // setLoading(true);
                    // const checks = await submitChecks(false);
                    // if (!checks) {
                    //   console.log("checks failed, stopping");
                    //   return null;
                    // }
                    setHasBeenReset(false);
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
                  <Text color="gray" fontSize={12} mt={1}>
                    {previousPrompt}
                  </Text>
                </SlideFade>
              </Flex>
            </Box>
          )}

          {!loading &&
            messages[messages.length - 1] &&
            !initialMessages?.find(
              (message: any) =>
                message?.content === messages[messages.length - 1]?.content
            ) && (
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
                    bg: "gray.400",
                    color: "white",
                  }}
                  alignSelf="center"
                  rounded="full"
                  onClick={() => {
                    setHasBeenReset(true);
                    setLoading(false);
                    setResponse("");
                    setFailMessage("");
                  }}
                >
                  Start A New Chat
                </Button>
                {/* <Button
                px={4}
                _hover={{
                  bg: colorMode === "light" ? "gray.300" : "black",
                }}
                bg={colorMode === "light" ? "white" : "gray.800"}
                alignSelf="center"
                rounded="full"
                onClick={() => {
                  reload();
                  setLoading(true)
                }}
              >
                Re-run Prompt
              </Button> */}
              </Flex>
            )}
        </Box>
        {/* <Science
          models={models}
        /> */}
        <Profile />
        <Flex mt={2} gap={2}>
          <Tooltip label="Join Discord" placement="top">
            <Link href="https://discord.com/invite/6GFtwzuvtw">
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
                      Join
                    </Text>
                  </Flex>
                }
              />
            </Link>
          </Tooltip>
          <Tooltip label="Github Stars" placement="top">
            <Link href="https://github.com/devgpt-labs/devgpt-releases">
              <IconButton
                _hover={{
                  transform: "translateY(-4px)",
                  transition: "all 0.2s ease-in-out",
                }}
                aria-label="Github Stars"
                icon={
                  <Flex flexDirection="row" px={3}>
                    <BsGithub />
                    <BsStars />
                    <Text ml={2} fontSize={14}>
                      339
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
          onSubmit={async (e: any) => {
            e.preventDefault();

            // Run checks
            const checks = await submitChecks(true, false);
            if (!checks) return null;

            // Show that we haven't reset
            setHasBeenReset(false);

            // Submit to useChat
            handleSubmit(e);
          }}
          setLoading={setLoading}
        />
      </Flex>
    </Template>
  );
};

export default Chat;
