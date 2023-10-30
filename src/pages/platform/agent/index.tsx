"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  SkeletonText,
  Button,
  SlideFade,
  Kbd,
  Tag,
  useDisclosure,
  IconButton,
  Link,
  Stat,
  StatLabel,
  Switch,
  StatNumber,
  StatHelpText,
  Grid,
  Tooltip,
  Alert,
  AlertIcon,
  Fade,
  Skeleton,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useChat } from "ai/react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import moment from "moment";

//stores
import repoStore from "@/store/Repos";
import authStore from "@/store/Auth";

//prompts
import userPrompt from "@/prompts/user";

//components
import Template from "@/components/Template";
import Response from "@/components/Response";
import PromptCorrectionModal from "@/components/PromptCorrectionModal";
import PromptAreaAndButton from "./PromptAreaAndButton";
import Feedback from "@/components/repos/Feedback";

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
import TrainingStatus from "./TrainingStatus";

// Icons
import { BsDiscord } from "react-icons/bs";
import { AiFillCreditCard } from "react-icons/ai";
import getLofaf from "@/utils/github/getLofaf";
import { FaBrain } from "react-icons/fa";
import { EmailIcon, PlusSquareIcon } from "@chakra-ui/icons";
import { BiConfused, BiRefresh, BiUpArrowAlt } from "react-icons/bi";
import { MdScience } from "react-icons/md";
import { useColorMode } from "@chakra-ui/react";
import { RiInformationFill } from "react-icons/ri";
import { GiUpgrade } from "react-icons/gi";

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
  const [activeModelFilesTrained, setActiveModelFilesTrained] =
    useState<number>(0);
  const [previousPrompt, setPreviousPrompt] = useState<string>("");
  const [showModelAssessment, setShowModelAssessment] =
    useState<boolean>(false);
  const [correctedPrompt, setCorrectedPrompt] = useState<string>("");
  const [hasBeenReset, setHasBeenReset] = useState<boolean>(false);
  const [models, setModels] = useState<any>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { colorMode } = useColorMode();
  const { repo, lofaf, setLofaf, setRepo }: any = repoStore();
  const {
    user,
    session,
    stripe_customer_id,
    signOut,
    status,
    credits,
    isPro,
  }: any = authStore();

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
      setFailMessage("");
      setPrompt("");
      setLoading(false);
      savePrompt(user?.email, prompt, data.content, usage);
      setResponse(data.content);
      setShowModelAssessment(false);
    },
  });

  const MAX_MESSAGES = 7; //todo - this should come from training status

  useEffect(() => {
    // Get all models
    getModels(
      (data: any) => {
        setModels(data);
      },
      () => { },
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

    console.log(
      "Helpful debugging information, if all of these are true, it's probably working fine.:",
      {
        "User is pro": isPro,
        "User email": user?.email,
        "Valid Repo": !!lofaf,
        "Valid Stripe": !!stripe_customer_id,
        "Valid Github": !!session?.provider_token,
      }
    );
  }, []);

  useEffect(() => {
    if (initialMessages.length !== 0) return;

    // Update the model to the newest selected one

    if (model?.output) {
      setInitialMessages(JSON.parse(model?.output).slice(0, MAX_MESSAGES));
      setActiveModelFilesTrained((JSON.parse(model?.output).length - 1) / 2);
    }

    getLofaf(repo.owner, repo.repo, session).then((data) => {
      // If no data tree, return
      if (!data?.tree) return null;

      // Get files from the data tree
      const files = data?.tree?.map((file: any) => file.path);

      // Set lofaf to the files found
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
    if (!file) {
      setFailMessage(`Couldn't find a file containing ${withAt?.[0]}`);
      return null;
    }
    // Append currentSuggestion to prompt
    const promptArray = prompt.split(" ");
    const lastWord = promptArray[promptArray?.length - 1];
    const newPrompt = prompt.replace(lastWord, `~/${file}`);

    // Set prompts
    setPrompt(newPrompt);
    setFailMessage("");

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
    const tokenLimit = getTokenLimit();

    if (tokensInString > tokenLimit) {
      setLoading(false);
      setFailMessage(
        "Your prompt is too long currently to run, try to include less files and more precise information."
      );
      return false;
    }
    return true;
  };

  const model = models?.find((model: any) => model?.repo === repo?.repo);

  if (!isPro) {
    return (
      <Template>
        <Flex
          flexDirection="row"
          width="80%"
          height="70vh"
          gap={2}
          alignItems="center"
          justifyContent="center"
        >
          <Modal isOpen={true} onClose={() => { }} isCentered={true}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>It's time to upgrade</ModalHeader>
              <ModalBody>
                <Text>
                  To use DevGPT, you need a plan that unlocks its full
                  potential. This allows you to train models and run prompts.
                </Text>
              </ModalBody>

              <ModalFooter>
                <Button
                  width="100%"
                  bgGradient="linear(to-r, blue.500, teal.500)"
                  color="white"
                  onClick={() => {
                    router.push("/platform/billing");
                  }}
                >
                  <Text mr={2}>Billing</Text>
                  <AiFillCreditCard />
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <Skeleton
            bg="gray.700"
            height="40px"
            width="85%"
            mb={4}
            borderRadius={10}
          />
          <Skeleton
            bg="gray.700"
            height="40px"
            width="15%"
            mb={4}
            borderRadius={10}
          />
        </Flex>
      </Template>
    );
  }

  if (status?.isBanned) {
    return (
      <Template>
        <Flex
          alignItems="center"
          justifyContent="center"
          mt={5}
          h="70vh"
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

  if (!user) {
    return (
      <Template>
        <Flex
          flexDirection="row"
          width="80%"
          height="70vh"
          gap={2}
          alignItems="center"
          justifyContent="center"
        >
          <Skeleton
            bg="gray.700"
            height="40px"
            width="85%"
            mb={4}
            borderRadius={10}
          />
          <Skeleton
            bg="gray.700"
            height="40px"
            width="15%"
            mb={4}
            borderRadius={10}
          />
        </Flex>
      </Template>
    );
  }

  return (
    <Template>
      <Flex
        direction="column"
        flex={1}
        w="80%"
        maxW="full"
        justifyContent={"center"}
        p={5}
      >
        <Box
          rounded="lg"
          className="p-5 flex flex-col border border-blue-800/40 shadow-2xl shadow-blue-900/30"
          justifyContent="flex-start"
        >
          {!repo.repo && (
            <Box>
              <Button
                width="100%"
                bgGradient="linear(to-r, blue.500, teal.500)"
                color="white"
                mt={4}
                onClick={() => {
                  router.push("/platform/models", undefined, { shallow: true });
                }}
              >
                <MdScience />
                <Text ml={1}>Train or select a model to get started</Text>
              </Button>
              <Text fontSize={12} mt={2}>
                {failMessage}
              </Text>
            </Box>
          )}
          {repo.repo && (
            <Box>
              {!isPro && (
                <Flex flexDirection="column" mt={4}>
                  <Text>
                    Before you continue prompting, we need to get your billing
                    in order!
                  </Text>
                  <Text mb={3} fontSize={14} color="gray.600">
                    You can continue using DevGPT and prompting with your
                    trained models immediately after this.
                  </Text>
                  <Flex flexDirection="row" gap={2}>
                    <Button
                      width="100%"
                      bgGradient={"linear(to-r, blue.500, teal.500)"}
                      color="white"
                      onClick={() => {
                        router.push("/platform/billing");
                      }}
                    >
                      <Text mr={2}>View Billing</Text>
                      <AiFillCreditCard />
                    </Button>
                    <Link href="mailto:support@devgpt.com">
                      <Button>
                        <Text mr={2}>Email Support</Text>
                        <EmailIcon />
                      </Button>
                    </Link>
                  </Flex>
                </Flex>
              )}

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
                <SlideFade in={!!previousPrompt}>
                  <Heading mb={3} size="lg">
                    {previousPrompt}
                  </Heading>
                </SlideFade>
              )}

              {loading ? (
                <SkeletonText
                  mb={4}
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


              <Box mt={4}>
                <Flex
                  flexDirection="row"
                  gap={2}
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <Flex flexDirection="row" alignItems="center">
                    <FaBrain />
                    <Text ml={1} mr={2}>
                      Model Empirical Assessment
                    </Text>
                    <Switch
                      id="isChecked"
                      isChecked={showModelAssessment}
                      onChange={() =>
                        setShowModelAssessment(!showModelAssessment)
                      }
                    />
                  </Flex>
                </Flex>
              </Box>
              {showModelAssessment && (
                <>
                  <Text
                    fontSize="sm"
                    mb={3}
                    color={colorMode === "light" ? "#CBD5E0" : "gray"}
                  >
                    Hover over each one to learn more.
                  </Text>
                  <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                    <ModelStat
                      label="Training Size Target"
                      number={model?.sample_size > 0 ? model?.sample_size : 0}
                      tip={moment(Date.now()).format("MMMM Do YYYY")}
                      tooltip="This is the number of files you've selected for training your model. It serves as an initial target for how many files should be trained. You are only charged for the actual files that were successfully trained."
                    />
                    <ModelStat
                      label="Actual Sample Size"
                      number={
                        activeModelFilesTrained > 0
                          ? activeModelFilesTrained
                          : 0
                      }
                      tip={moment(Date.now()).format("MMMM Do YYYY")}
                      tooltip="This is the actual number of files that were used to train your model. This number may be less than the 'Training Size Target' due to file validation, large file size or filtering. You are only charged for the actual files that were successfully trained."
                    />
                    <ModelStat
                      label="Training Accuracy"
                      number={`${(
                        (activeModelFilesTrained / model?.sample_size) *
                        100
                      ).toFixed(2)}%`}
                      tip={
                        (activeModelFilesTrained / model?.sample_size) * 100 <
                          60
                          ? "Below 60% accuracy, we recommend retraining"
                          : moment(Date.now()).format("MMMM Do YYYY")
                      }
                      tooltip="This represents the accuracy of your trained model based on the files used for training. A higher accuracy indicates better performance, but remember, real-world scenarios might vary. Use this as an initial metric to gauge your model's effectiveness."
                    />
                  </Grid>
                </>
              )}
            </Box>
          )}

        </Box>
        <Feedback models={models} response={response} messages={messages} />
        {response && !hasBeenReset && (
          <Flex
            width="100%"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            gap={2}
            mt={4}
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

const ModelStat = ({ label, number, tip, tooltip }: any) => {
  const { colorMode } = useColorMode();

  return (
    <Stat
      border={colorMode === "light" ? "1px solid #CBD5E0" : "1px solid #1a202c"}
      p={4}
      borderRadius={10}
    >
      <Tooltip label={tooltip} placement="bottom">
        <Flex flexDirection="row" alignItems="center" gap={1}>
          <StatLabel>{label}</StatLabel>
          <RiInformationFill />
        </Flex>
      </Tooltip>

      <>
        <StatNumber>{number}</StatNumber>
        <StatHelpText fontSize={14} color="gray">
          {tip}
        </StatHelpText>
      </>
    </Stat>
  );
};
