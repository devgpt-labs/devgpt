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
  Link,
  StatUpArrow,
} from "@chakra-ui/react";
import { useChat } from "ai/react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Feedback from "@/components/repos/Feedback";

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
import PromptAreaAndButton from "./PromptAreaAndButton";
import DiscordAndGithubButtons from "./DiscordAndGithubButtons";

//utils
import { supabase } from "@/utils/supabase";
import { savePrompt } from "@/utils/savePrompt";
import { checkIfPro } from "@/utils/checkIfPro";
import getTokenLimit from "@/utils/getTokenLimit";
import getPromptCount from "@/utils/getPromptCount";
import promptCorrection from "@/utils/promptCorrection";
import getModels from "@/utils/getModels";
import getTokensFromString from "@/utils/getTokensFromString";
import calculateTokenCost from "@/utils/calculateTokenCost";
import chargeCustomer from "@/utils/stripe/chargeCustomer";
import TrainingStatus from "./TrainingStatus";

// Icons
import { BsDiscord, BsGithub, BsGraphUpArrow, BsStars } from "react-icons/bs";
import { AiFillCreditCard } from "react-icons/ai";
import getLofaf from "@/utils/github/getLofaf";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { RiRefreshFill } from "react-icons/ri";
import { PlusSquareIcon } from "@chakra-ui/icons";
import { BiConfused, BiRefresh, BiUpArrowAlt } from "react-icons/bi";
import Stripe from "stripe";
import { MdWork } from "react-icons/md";
import { GiIsland } from "react-icons/gi";

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
  const [correctedPrompt, setCorrectedPrompt] = useState<string>("");
  const [hasBeenReset, setHasBeenReset] = useState<boolean>(false);
  const [models, setModels] = useState<any>([]);
  const [workMode, setWorkMode] = useState<boolean>(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { repo, lofaf, setLofaf, setRepo }: any = repoStore();
  const { user, session, stripe_customer_id, signOut, status, credits }: any =
    authStore();

  // Handles responses, sending prompt, reloading and input.
  const { messages, handleInputChange, handleSubmit, input, reload } = useChat({
    initialMessages: initialMessages,
    onFinish: (data: any) => {
      const inputTokens = getTokensFromString(input);
      const responseTokens = getTokensFromString(String(data.content));

      const usage = inputTokens + responseTokens;
      const cost = calculateTokenCost(usage);

      chargeCustomer(
        { stripe_customer_id: stripe_customer_id },
        cost,
        user?.email
      );

      hasBeenReset && setHasBeenReset(false);
      savePrompt(user?.email, prompt, data.content, usage);
      setResponse(data.content);
    },
  });

  if (status?.isBanned) {
    return (
      <Template>
        <Flex
          alignItems="center"
          justifyContent="center"
          mt={5}
          h="100vh"
          w="100vw"
        >
          <BiConfused />
          <Text ml={3}>
            Oops, something went wrong! Please get in touch with the team via
            Discord.
          </Text>
        </Flex>
      </Template>
    );
  }

  useEffect(() => {
    // Get all models
    getModels(
      (data: any) => {
        setModels(data);
      },
      () => {},
      user?.email
    );

    // Get the users last used repo
    const lastUsedRepo = Cookies.get("recentlyUsedRepoKey");
    if (lastUsedRepo) {
      const lastUsedRepoObject = JSON.parse(lastUsedRepo);
      setRepo(lastUsedRepoObject);
    }

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

  useEffect(() => {
    setLoading(false);
  }, [messages]);

  useEffect(() => {
    if (promptCount != 0) return;
    getPromptCount(user?.email, setPromptCount);
  }, [user?.email]);

  // This logic breaks down the prompt to find @'d files
  const regex = /@([^ ]+)/g;
  const withAt: any = [];
  let match: any;
  while ((match = regex.exec(prompt))) {
    withAt.push(match[1]);
  }

  // Get the current file being targeted with @
  const selectedFile = lofaf?.filter((file: any) => {
    if (file?.toLowerCase()?.includes(withAt?.[0]?.toLowerCase())) {
      return file;
    }
  });

  // If the user clicks tab, we want to autocomplete the file name
  const handleUseTabSuggestion = (file: any) => {
    // Append currentSuggestion to prompt
    const promptArray = prompt.split(" ");
    const lastWord = promptArray[promptArray?.length - 1];
    const newPrompt = prompt.replace(lastWord, `~/${file}`);

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
      promptFeedback = await promptCorrection(user?.email, prompt, lofaf, {
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
            <>
              <Button width="100%" mt={4}>
                Train a model to get started
              </Button>
              <Text fontSize={12} mt={2}>
                {failMessage}
              </Text>
            </>
          )}
          {repo.repo && (
            <Box maxH={"100vh"} overflowY={"auto"}>
              {status?.isOverdue ||
                (credits < 0 && (
                  <Flex flexDirection="column" mt={4}>
                    <Text>
                      Before you continue prompting, we need to get your billing
                      in order!
                    </Text>
                    <Text mb={3} fontSize={14} color="gray.600">
                      You're accounts billing is currently overdue, so before
                      you continue we'll need to help you set up billing
                      correctly. You can continue using DevGPT and prompting
                      with your trained models immediately after this.
                    </Text>
                    <Button
                      bgGradient={"linear(to-r, blue.500, teal.500)"}
                      onClick={() => {
                        router.push("/platform/billing");
                      }}
                      width="100%"
                      mb={3}
                    >
                      <Text color="white" mr={2}>
                        Upgrade
                      </Text>
                      <BiUpArrowAlt color="white" />
                    </Button>
                    <Flex flexDirection="row" gap={3}>
                      <Link
                        width="50%"
                        href="https://discord.com/invite/6GFtwzuvtw"
                      >
                        <Button width="100%">
                          <Text mr={2}>Join Discord</Text>
                          <BsDiscord />
                        </Button>
                      </Link>
                      <Button
                        onClick={() => {
                          router.push("/platform/billing");
                        }}
                        width="50%"
                      >
                        <Text mr={2}>View Billing</Text>
                        <AiFillCreditCard />
                      </Button>
                    </Flex>
                  </Flex>
                ))}
              <TrainingStatus initialMessages={initialMessages} />
              {withAt?.length > 0 && (
                <Flex alignItems={"center"} my={2}>
                  <Kbd>Tab</Kbd>
                  <Text ml={1}> to accept suggestion</Text>
                </Flex>
              )}
              <Flex flexDirection="row" flexWrap="wrap" mb={2}>
                <SlideFade key={match} in={selectedFile?.[0] ? true : false}>
                  {selectedFile?.map((file: any, index: any) => {
                    if (index > 12) return null;
                    return (
                      <Tag
                        mr={1}
                        mb={1}
                        key={file}
                        cursor="pointer"
                        onClick={() => handleUseTabSuggestion(file)}
                      >
                        {file}
                      </Tag>
                    );
                  })}
                </SlideFade>
              </Flex>

              <PromptAreaAndButton
                prompt={prompt}
                selectedFile={selectedFile}
                loading={loading}
                setLoading={setLoading}
                handleUseTabSuggestion={handleUseTabSuggestion}
                setPrompt={setPrompt}
                handleInputChange={handleInputChange}
                submitChecks={submitChecks}
                setHasBeenReset={setHasBeenReset}
                handleSubmit={handleSubmit}
              />

              {failMessage && (
                <Text mb={3} mt={2} fontSize={14}>
                  {failMessage}
                </Text>
              )}

              {previousPrompt && (
                <SlideFade in={hasSentAMessage}>
                  <Text mb={3} color="gray" fontSize={12} mt={1}>
                    {previousPrompt}
                  </Text>
                </SlideFade>
              )}

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
            </Box>
          )}

          {!loading &&
            !hasBeenReset &&
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
                gap={2}
                my={2}
              >
                <IconButton
                  _hover={{
                    transform: "translateY(-4px)",
                    transition: "all 0.2s ease-in-out",
                  }}
                  aria-label="Join Discord"
                  onClick={() => {
                    setHasBeenReset(true);
                    setLoading(false);
                    setResponse("");
                    setFailMessage("");
                  }}
                  icon={
                    <Flex flexDirection="row" px={3}>
                      <PlusSquareIcon />
                      <Text ml={2} fontSize={14}>
                        {/* {activeOnDiscord && `Online: ${activeOnDiscord}`} */}
                        New
                      </Text>
                    </Flex>
                  }
                />
                <IconButton
                  _hover={{
                    transform: "translateY(-4px)",
                    transition: "all 0.2s ease-in-out",
                  }}
                  onClick={() => {
                    reload();
                    setLoading(true);
                  }}
                  aria-label="Join Discord"
                  icon={
                    <Flex flexDirection="row" px={3}>
                      <BiRefresh />
                      <Text ml={2} fontSize={14}>
                        {/* {activeOnDiscord && `Online: ${activeOnDiscord}`} */}
                        Regenerate
                      </Text>
                    </Flex>
                  }
                />
              </Flex>
            )}
        </Box>
        {!workMode && (
          <>
            {status?.isOverdue || credits < 0 ? null : (
              <Feedback
                models={models}
                response={response}
                messages={messages}
              />
            )}
            <Profile />
            <DiscordAndGithubButtons />
          </>
        )}
        {/* 
        <Tooltip label={workMode ? "Break Mode" : "Work Mode"} placement="top">
          <IconButton
            alignSelf='flex-end'
            _hover={{
              transform: "translateY(-4px)",
              transition: "all 0.2s ease-in-out",
            }}
            onClick={() => {
              setWorkMode(!workMode);
            }}
            aria-label={workMode ? "Break Mode" : "Work Mode"}
            icon={workMode ? <GiIsland size={18} /> : <MdWork size={18} />}
          />
        </Tooltip> */}
        <PromptCorrectionModal
          correctedPrompt={correctedPrompt}
          setCorrectedPrompt={setCorrectedPrompt}
          prompt={previousPrompt}
          setPrompt={setPrompt}
          isOpen={isOpen}
          onClose={onClose}
          onReject={async (e: any) => {
            e.preventDefault();

            // Run checks
            const checks = await submitChecks(true, true);
            if (!checks) return null;

            // Show that we haven't reset
            setHasBeenReset(false);

            // Submit to useChat
            handleSubmit(e);
          }}
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
