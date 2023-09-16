import React, { useState, useEffect, useRef } from "react";
import {
  useToast,
  Flex,
  useDisclosure,
  Box,
  Tag,
  Text,
  Heading,
  Button,
  Kbd,
  Input,
  InputGroup,
  InputRightElement,
  Tooltip,
  Textarea,
  IconButton,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useAuthContext } from "@/src/context";
import { supabase } from "@/src/utils/supabase/supabase";
import store from "@/redux/store";
import { FaDiscord } from "react-icons/fa";
import SettingsModal from "@/src/components/global/sidebar/elements/SettingsModal";
import { shell } from "electron";
import { LuSend } from "react-icons/lu";

//configs

import audios from "@/src/config/audios";

//components
import checkUsersCodeUsage from "@/src/components/global/functions/checkUsersCodeUsage";
import MainEducation from "@/src/components/global/MainEducation";
import MessagesDisplay from "../../global/displays/MessagesDisplay";
import Tutorial from "@/src/components/global/Tutorial";
import UpgradeModal from "../../global/UpgradeModal";
import Message from "../../global/Message";
import BlurredMessage from "../../global/BlurredMessage";

//utils
import getUserSubscription from "../../global/functions/getUserSubscription";
import getAllTasks from "@/src/utils/getAllTasks";
import getFilteredLofaf from "@/src/utils/getFilteredLofaf";
import themes from "@/src/config/themes";
import {
  getLofaf,
  generateQuestions,
  generateCode,
  generateNewGenerationCode,
  saveTaskInDatabase,
  generateAdvice,
  detectPromptIntent,
} from "@/src/components/platform/transaction/utils/code-generation";
import calculateTimeSaved from "@/src/utils/calculateTimeSaved";
import calculateUserRanking from "@/src/utils/calculateUserRanking";
import playAudio from "@/src/utils/playAudio";
import makeCodeParseable from "@/src/components/platform/transaction/utils/makeCodeParseable";
import syncCodeChangesWithLocalFileSystem from "@/src/components/platform/transaction/utils/syncCodeChangesWithLocalFileSystem";

//types
import MessageType from "@/src/types/message";

import router from "next/router";
import PrePromptScreen from "./PrePromptScreen";

const Environment = (transaction_id: any) => {
  //history of this transaction
  const [history, setHistory] = useState<MessageType[]>([]);
  const [maxPromptLength, setMaxPromptLength] = useState(0);
  const [userIsPremium, setUserIsPremium] = useState(false);

  //in-transaction state
  const [prompt, setPrompt] = useState("");
  const [originalPrompt, setOriginalPrompt] = useState("");
  const [lofaf, setLofaf] = useState("");
  const [generationRound, setGenerationRound] = useState(0);
  const [initialPromptLoading, setInitialPromptLoading] = useState(false);

  //user settings
  const [files, setFiles] = useState([] as any); //used for auto-complete files with @
  const [viewingTargetRepo, setViewingTargetRepo] = useState(false);
  const [showTutorial, setShowTutorial] = useState(null);
  const [progress, setProgress] = useState(33.3);

  //redux
  const [technologiesUsed, setTechnologiesUsed] = useState(
    store.getState().technologiesUsed
  );
  const [localRepoDir, setLocalRepoDir] = useState(
    store.getState().localRepoDirectory
  );
  const [context, setContext] = useState(store.getState().context);
  const [theme, setTheme] = useState(null);

  const [tasks, setTasks] = useState([]);

  const router = useRouter();

  const {
    isOpen: isSettingsOpen,
    onOpen: onSettingsOpen,
    onClose: onSettingsClose,
  } = useDisclosure();

  const {
    isOpen: isUpgradeOpen,
    onOpen: onUpgradeOpen,
    onClose: onUpgradeClose,
  } = useDisclosure();

  const [transactionId, setTransactionId] = useState(transaction_id);
  const [generationsSubmitted, setGenerationsSubmitted] = useState([]);
  const [returningToOldPrompt, setReturningToOldPrompt] = useState(false);
  const { user } = useAuthContext();
  const toast = useToast();

  const createFollowUpQuestionsString = (historyCopy) => {
    const followUpQuestions = historyCopy.filter(
      (message) => message.source === "question" || message.source === "answer"
    );

    //convert follow up questions to string of all questions and answers
    const followUpQuestionsString = followUpQuestions
      .map((message) => {
        return `${message.source}: ${message.content} \n`;
      })
      .join(" ");

    return followUpQuestionsString;
  };

  const resetState = (followUp) => {
    setPrompt("");
    setInitialPromptLoading(false);

    if (followUp) {
      setGenerationRound(generationRound + 1);
    } else if (followUp === false) {
      setHistory([]);
    }
  };

  const resetForBrandNewPrompt = () => {
    setInitialPromptLoading(false);
    setHistory([]);
    setPrompt("");
    setOriginalPrompt("");
    setLofaf("");
    setTransactionId("new");
    setGenerationRound(0);
    setGenerationsSubmitted([]);
  };

  useEffect(() => {
    if (transaction_id.transaction_id === "new") {
      resetForBrandNewPrompt();
    } else {
      if (
        history.length === 0 ||
        transaction_id.transaction_id != transactionId
      ) {
        setReturningToOldPrompt(true);
        //fetch this transaction from supabase and load it into in-transaction state
        supabase
          .from("new_transactions")
          .select("*")
          .eq("transaction_id", transaction_id.transaction_id)
          .single()
          .then((transaction) => {
            if (!transaction) return;

            if (!transaction.data?.history) return;

            const parsedHistory = JSON.parse(transaction.data?.history);

            if (!parsedHistory || parsedHistory.length === 0) return;

            setTransactionId(transaction_id.transaction_id);
            setPrompt("");
            setOriginalPrompt(transaction.data.prompt);
            setLofaf("");
            setHistory(parsedHistory);
            //get generation round from last message in history
            setGenerationRound(
              parsedHistory[parsedHistory.length - 1].generation_round
            );
            //create array of all numbers of generations that have been submitted from history, without duplicates
            const generationsSubmitted = parsedHistory
              .map((message) => message.generation_round)
              .filter((value, index, self) => self.indexOf(value) === index);
            setGenerationsSubmitted(generationsSubmitted);
          });
      }
    }
  }, [transaction_id]);

  const handleSubmit = async () => {
    alert("submitted");

    //add generation round to generations submitted, so we don't submit it again
    //setGenerationsSubmitted([...generationsSubmitted, generationRound]);

    // const historyCopy = structuredClone(
    //   history.filter((message) => message.generation_round === generationRound)
    // );

    //make sure all conditions for final submit are met
    //if (historyCopy.length === 0) return;

    //const followUpQuestionsString = createFollowUpQuestionsString(historyCopy);

    const res = await generateAdvice(prompt);

    if (res.ok && prompt) {
      const reader = res.body.getReader();
      const processStream = async () => {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }
          let chunk = new TextDecoder("utf-8").decode(value);
          chunk = chunk.replace(/^data: /, "");

          setHistory((prevState: any) => {
            //this stops the advice being written after the code
            if (prevState[prevState.length - 1]?.signOffMessageInGeneration) {
              return [...prevState];
            }

            const newState = [...prevState];

            if (prevState[prevState.length - 1].source === "advice") {
              const lastMessage = newState[newState.length - 1];
              lastMessage.content = lastMessage.content + chunk;
              return newState;
            } else {
              return [
                ...prevState,
                {
                  content: chunk,
                  type: "output",
                  isUser: false,
                  source: "advice",
                  streamResponse: true,
                  generation_round: generationRound,
                },
              ];
            }
          });
        }
      };
      processStream().catch((err) => {
        //error
      });
    } else {
      //error
    }
  };

  const handleRegenerateResponse = () => {
    //remove the last message from history
    const historyCopy = structuredClone(history);
    //remove final two messages from history
    historyCopy.pop();
    historyCopy.pop();
    setHistory(historyCopy);
    //remove this from generations submitted
    const generationsSubmittedCopy = structuredClone(generationsSubmitted);
    generationsSubmittedCopy.pop();
    setGenerationsSubmitted(generationsSubmittedCopy);
    //set generation round back to the last generation round
    setGenerationRound(generationRound - 1);
    //re-run the code generation
    handleSubmit();
  };

  useEffect(() => {
    const historyCopy = structuredClone(
      history.filter((message) => message.generation_round === generationRound)
    );

    //check when it's time to handleSubmit, if all follow up questions have been submitted
    if (
      lofaf &&
      historyCopy.length > 1 &&
      historyCopy.every(
        (message) =>
          message.submitted === true || message?.submitted === undefined
      )
    ) {
      if (!generationsSubmitted.includes(generationRound)) {
        handleSubmit();
      }
    }
  }, [history, lofaf]);

  //bind technologiesUsed and localRepoDir with redux store
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setTheme(store.getState().theme);
      setTechnologiesUsed(store.getState().technologiesUsed);
      setLocalRepoDir(store.getState().localRepoDirectory);
      setContext(store.getState().context);
    });

    return unsubscribe;
  }, []);

  let picture;

  // Find the theme in themes that has the matching name to the theme
  themes.forEach((themeFromConfig: any) => {
    if (themeFromConfig.name === theme) {
      picture = themeFromConfig.image;
    }
  });

  useEffect(() => {
    if (user) {
      getAllTasks(user?.id, toast).then((tasks: any) => {
        setTasks(tasks);
      });
    }
  }, [user]);

  const getUserSettings = async () => {
    if (!user) return;
    if (!supabase) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id)
      .single();

    if (error) {
      console.log(error);
      return;
    }

    setTheme(data.theme);

    store.dispatch({
      type: "SETTINGS_CHANGED",
      payload: {
        theme: data.theme,
        technologiesUsed: data.technologies_used,
        localRepoDirectory: data?.local_repo_dir,
        context: data?.context,
      },
    });
  };

  useEffect(() => {
    getUserSettings();
  }, []);

  useEffect(() => {
    const setLocalFilesForAutoComplete = async () => {
      if (!localRepoDir) {
        return;
      }
      const autocompletingFiles = await getFilteredLofaf(localRepoDir);
      //remove the localRepoDir from the file path of every file
      autocompletingFiles.forEach((file, index) => {
        autocompletingFiles[index] = file.replace(localRepoDir, "");
      });
      setFiles(autocompletingFiles);
    };
    setLocalFilesForAutoComplete();
  }, [localRepoDir]);

  useEffect(() => {
    if (
      transaction_id.transaction_id === "new" ||
      !transaction_id.transaction_id
    ) {
      setHistory([]);
      router.push(`/platform/transactions/new`);
    }
  }, [transaction_id.transaction_id]);

  return (
    <>
      {transaction_id.transaction_id === "new" && history.length === 0 ? (
        <PrePromptScreen
          prompt={prompt}
          setPrompt={setPrompt}
          handleSubmit={handleSubmit}
        />
      ) : (
        <Flex
          flexDirection="column"
          maxH="100vh"
          width="full"
          overflowY="scroll"
        >
          <Flex
            w={"full"}
            flexDirection="column"
            mt={10}
            p={6}
            justifyContent="space-between"
          >
            <Alert status="info">
              <AlertIcon />
              Get 4X longer responses with gpt-4-32k context - Upgrade now
            </Alert>

            <MessagesDisplay
              messages={history}
              transaction_id={transaction_id}
              setHistory={setHistory}
            />

            {history.length > 0 && (
              <>
                <Message isUser={true}>
                  <Flex flexDirection={"row"} flex={1}>
                    <Flex flex={1}>
                      <InputGroup>
                        <Input
                          variant="flushed"
                          borderBottomRadius={0}
                          borderTopRadius={5}
                          value={prompt}
                          w={"95%"}
                          maxW="90%"
                          onChange={(e: any) => {
                            //make sure prompt is less than max prompt length
                            if (e.target.value.length > 150) {
                              return;
                            }

                            setPrompt(e.target.value);
                          }}
                          onKeyUp={(e: any) => {
                            if (e.key === "Enter") {
                              handleSubmit();
                            }
                          }}
                          p={2}
                          placeholder={"Follow up prompt..."}
                          _placeholder={{ color: "gray.400" }}
                          fontSize="md"
                          flexWrap="wrap"
                        />
                        <InputRightElement>
                          <Text fontSize={12}>
                            {prompt.length}/{150}
                          </Text>
                          <IconButton
                            bgGradient={"linear(to-r, teal.500,blue.500)"}
                            mr={8}
                            ml={4}
                            aria-label="Send"
                            icon={<LuSend />}
                            size="sm"
                          />
                        </InputRightElement>
                      </InputGroup>
                    </Flex>

                    <Flex justifyContent={"flex-end"}>
                      <Flex
                        flexDirection="row"
                        alignItems="center"
                        justifyContent={"center"}
                      >
                        {!userIsPremium && (
                          <Tag
                            ml={2}
                            alignItems={"center"}
                            justifyContent={"center"}
                            display={"flex"}
                            backgroundColor="teal.600"
                            _hover={{ backgroundColor: "teal.500" }}
                            cursor={"pointer"}
                            onClick={() => {
                              onUpgradeOpen();
                            }}
                            fontWeight={"bold"}
                          >
                            Upgrade
                          </Tag>
                        )}
                      </Flex>
                    </Flex>
                  </Flex>
                </Message>
              </>
            )}
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default Environment;
