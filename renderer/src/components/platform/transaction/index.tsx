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
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useAuthContext } from "@/src/context";
import { supabase } from "@/src/utils/supabase/supabase";
import store from "@/redux/store";
import { FaDiscord } from "react-icons/fa";
import Settings from "@/src/components/global/sidebar/elements/Settings";
import { shell } from "electron";
import { LuSend } from "react-icons/lu";

//configs
import planIntegers from "@/src/config/planIntegers";
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
  syncCodeChangesWithLocalFileSystem,
  saveTaskInDatabase,
  generateAdvice,
  detectPromptIntent,
} from "@/src/components/platform/transaction/utils/code-generation";
import calculateTimeSaved from "@/src/utils/calculateTimeSaved";
import calculateUserRanking from "@/src/utils/calculateUserRanking";
import playAudio from "@/src/utils/playAudio";
import makeCodeParseable from "@/src/components/platform/transaction/utils/makeCodeParseable";

//types
import MessageType from "@/src/types/message";

import router from "next/router";

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
  const [showTutorial, setShowTutorial] = useState(null);
  const [progress, setProgress] = useState(33.3);

  //redux
  const [technologiesUsed, setTechnologiesUsed] = useState(
    store.getState().technologiesUsed
  );
  const [localRepoDir, setLocalRepoDir] = useState(
    store.getState().localRepoDir
  );
  const [context, setContext] = useState(store.getState().context);
  const [theme, setTheme] = useState(null);

  const [tasks, setTasks] = useState([]);

  const [showRedBox, setShowRedBox] = useState(false);
  const [redBoxProps, setRedBoxProps] = useState({
    label: "",
    x: 0,
    y: 0,
  });
  const suggestionRef = useRef("");
  const textAreaRef = useRef(null);

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

  const handleLocalFileSync = async () => {
    toast({
      title: "Synced your changes to local",
      description: "Your local environment settings have been saved.",
      status: "success",
      duration: 5000,
      position: "top-right",
      isClosable: true,
    });

    const codeChanges = getLatestCodeChanges(history);
    syncCodeChangesWithLocalFileSystem(codeChanges, localRepoDir);
  };

  const getLatestCodeChanges = (history) => {
    const lastCodeMessage = history
      .filter((message) => message.source === "code")
      .pop();

    if (!lastCodeMessage) return;

    const existingCodeString = lastCodeMessage.content;
    return existingCodeString;
  };

  const runGamificationCalculations = async (formattedCode?: any) => {
    //re-calculate time saved
    const codeChanges = formattedCode || getLatestCodeChanges(history);

    return new Promise((resolve, reject) => {
      if (!codeChanges)
        return resolve({
          timeSaved: "0 minutes",
          totalTimeSaved: "0 minutes",
          userRanking: "0%",
        });

      //promise all to calculate time saved and user ranking
      Promise.all([
        calculateTimeSaved(codeChanges, user),
        calculateUserRanking(user),
      ]).then((values) => {
        resolve({
          timeSaved: values[0]?.timeSaved,
          totalTimeSaved: values[0]?.totalTimeSaved,
          userRanking: values[1],
        });
      });
    });
  };

  const handleNewGenerationSubmit = () => {
    if (prompt.length < 6) return;

    setGenerationsSubmitted([...generationsSubmitted, generationRound]);

    const newPromptObject = {
      content: prompt,
      type: "output",
      isUser: true,
      source: "prompt",
      generation_round: generationRound,
    };

    const newState: any = [...history, newPromptObject];

    setHistory((prevState: any) => [...prevState, newPromptObject]);

    const historyCopy = structuredClone(
      newState.filter((message) => message.generation_round === generationRound)
    );

    //make sure all conditions for final submit are met
    if (historyCopy.length === 0) return;

    setGenerationRound(generationRound + 1);

    const followUpQuestionsString = createFollowUpQuestionsString(newState);

    const existingCodeString = JSON.stringify(getLatestCodeChanges(newState));

    generateNewGenerationCode(
      originalPrompt,
      prompt,
      followUpQuestionsString,
      lofaf,
      localRepoDir,
      technologiesUsed,
      existingCodeString,
      context
    ).then((code) => {
      //prepare for a new prompt
      resetState(true);

      saveIncomingCodeResponse(code);
    });
  };

  const saveIncomingCodeResponse = (code) => {
    //parse code json string
    let formattedCode;
    try {
      formattedCode = JSON.parse(makeCodeParseable(code));

      //filter out any empty code
      formattedCode = formattedCode.filter(({ code }) => code !== "");

      runGamificationCalculations(formattedCode).then((rankings: any) => {
        //push code and additional messages to history
        setHistory((prevState: any) => [
          ...prevState,
          {
            content: formattedCode,
            type: "code",
            isUser: false,
            source: "code",
            generation_round: generationRound,
          },
          {
            // content: `You just saved ${rankings?.timeSaved}! That's ${rankings?.totalTimeSaved} in total. That puts you in the top ${rankings?.userRanking} of users!`,
            content: `You just saved ${rankings?.timeSaved}! That's ${rankings?.totalTimeSaved} in total!`,
            type: "output",
            isUser: false,
            source: "message",
            generation_round: generationRound,
          },
          {
            content: `Shall I edit the code I generated? I'm here to help.`,
            type: "output",
            isUser: false,
            source: "message",
            generation_round: generationRound,
            signOffMessageInGeneration: true,
          },
        ]);

        //save task in database
        saveTaskInDatabase(user?.id, transactionId, originalPrompt, [
          ...history,
          {
            content: formattedCode,
            type: "code",
            isUser: false,
            source: "code",
            generation_round: generationRound,
          },
          {
            // content: `You just saved ${rankings?.timeSaved}! That's ${rankings?.totalTimeSaved} in total. That puts you in the top ${rankings?.userRanking} of users!`,
            content: `You just saved ${rankings?.timeSaved}! That's ${rankings?.totalTimeSaved} in total!`,
            type: "output",
            isUser: false,
            source: "message",
            generation_round: generationRound,
          },
          {
            content: `Shall I edit the code I generated? I'm here to help.`,
            type: "output",
            isUser: false,
            source: "message",
            generation_round: generationRound,
            signOffMessageInGeneration: true,
          },
        ]).then((newTransactionId) => {
          setTransactionId(newTransactionId);
        });
      });
      return;
    } catch (e) {
      //push error to history

      setHistory((prevState: any) => [
        ...prevState,
        {
          content: code,
          type: "error",
          isUser: false,
          source: "error",
          signOffMessageInGeneration: true,
          generation_round: generationRound,
        },
      ]);

      //save task in database
      saveTaskInDatabase(user?.id, transactionId, originalPrompt, [
        ...history,
        {
          content: code,
          type: "error",
          isUser: false,
          source: "error",
          signOffMessageInGeneration: true,
          generation_round: generationRound,
        },
      ]).then((newTransactionId) => {
        setTransactionId(newTransactionId);
      });
    }
  };

  const handleInitialSubmit = async () => {
    if (prompt.length < 4) return;

    setInitialPromptLoading(true);

    await detectPromptIntent(prompt).then(async (intent) => {
      if (intent === "false") {
        setInitialPromptLoading(false);
        //user is attempting to use us as a chat bot, educate the user
        toast({
          title: "Please give me some code to write...",
          description:
            "I work best when you give me a task to complete with code changes in it.",
          status: "info",
          duration: 5000,
          position: "top-right",
          isClosable: true,
        });
      } else {
        const checkUsage = await checkUsersCodeUsage(user.id);

        if (checkUsage?.userIsCapped) {
          const initState: any = [
            ...history,
            {
              content: prompt,
              type: "output",
              isUser: true,
              source: "prompt",
              generation_round: generationRound,
            },
          ];

          setHistory(initState);

          getLofaf(prompt, localRepoDir, context).then((lofaf) => {
            setLofaf(lofaf);
          });

          generateQuestions(prompt, technologiesUsed, context).then(
            (questions) => {
              try {
                //convert questions csv to array
                let questionsArray = ["What is the purpose of this task?"];
                if (questions.includes("\n")) {
                  questionsArray = questions.split("\n");
                } else if (questions.includes(",")) {
                  questionsArray = questions.split(",");
                }

                let questionsAndAnswers = questionsArray.map((question) => {
                  return {
                    question: question,
                    answer: "",
                    submitted: false,
                  };
                });

                //filter out empty questions or questions that are less than 10 characters
                questionsAndAnswers = questionsAndAnswers.filter(
                  (question) => question.question.length > 10
                );

                //push each question to history
                const questionsAndHistoryMessages = questionsAndAnswers.flatMap(
                  (question) => {
                    return [
                      {
                        content: question.question,
                        type: "output",
                        isUser: false,
                        source: "question",
                        generation_round: generationRound,
                      },
                      {
                        content: "",
                        type: "input",
                        isUser: true,
                        submitted: false,
                        source: "answer",
                        generation_round: generationRound,
                      },
                    ];
                  }
                );

                setHistory([...initState, ...questionsAndHistoryMessages]);
              } catch (e) {
                handleFinalSubmit();
              }
            }
          );
        } else {
          toast({
            title: "Code limit reached today",
            description: "Upgrade to premium to get unlimited daily coding.",
            status: "info",
            duration: 5000,
            position: "top-right",
            isClosable: true,
          });
        }
      }
    });
  };

  const handleFinalSubmit = async () => {
    //add generation round to generations submitted, so we don't submit it again
    setGenerationsSubmitted([...generationsSubmitted, generationRound]);

    const historyCopy = structuredClone(
      history.filter((message) => message.generation_round === generationRound)
    );

    //make sure all conditions for final submit are met
    if (historyCopy.length === 0) return;

    const followUpQuestionsString = createFollowUpQuestionsString(historyCopy);

    generateAdvice(
      prompt,
      followUpQuestionsString,
      technologiesUsed,
      context
    ).then((advice) => {
      let trimmedAdvice = (advice = advice.trim());

      if (prompt) {
        setHistory((prevState: any) => {
          //this stops the advice being written after the code
          if (prevState[prevState.length - 1]?.signOffMessageInGeneration) {
            return [...prevState];
          }

          return [
            ...prevState,
            {
              content: trimmedAdvice,
              type: "output",
              isUser: false,
              source: "advice",
              streamResponse: true,
              generation_round: generationRound,
            },
          ];
        });
      }
    });

    generateCode(
      prompt,
      followUpQuestionsString,
      lofaf,
      localRepoDir,
      technologiesUsed,
      context
    ).then((code) => {
      //prepare for a new prompt
      saveIncomingCodeResponse(code);
      resetState(true);
    });
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
    handleFinalSubmit();
  };

  useEffect(() => {
    const historyCopy = structuredClone(
      history.filter((message) => message.generation_round === generationRound)
    );

    //check when it's time to handleFinalSubmit, if all follow up questions have been submitted
    if (
      lofaf &&
      historyCopy.length > 1 &&
      historyCopy.every(
        (message) =>
          message.submitted === true || message?.submitted === undefined
      )
    ) {
      if (!generationsSubmitted.includes(generationRound)) {
        handleFinalSubmit();
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
    if (localRepoDir === undefined || technologiesUsed === undefined) {
      return;
    }

    if (localRepoDir) {
      setProgress(progress + 33.3);
    }

    if (technologiesUsed) {
      setProgress(progress + 33.3);
    }

    if (localRepoDir && technologiesUsed) {
      setShowTutorial(false);
    } else {
      setShowTutorial(true);
    }
  }, [technologiesUsed, localRepoDir]);

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
    const setPlan = async () => {
      const premium = await getUserSubscription(user.id);

      if (premium.activeSubscription) {
        setMaxPromptLength(planIntegers?.paid_character_count);
        setUserIsPremium(true);
      } else {
        setMaxPromptLength(planIntegers?.free_character_count);
        setUserIsPremium(false);
      }
    };
    if (user) {
      setPlan();
    }
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
        <Flex
          flexDirection="row"
          maxH="100vh"
          width="full"
          bgImage={`url(${picture});`}
          bgSize="cover"
          bgRepeat="no-repeat"
        >
          <Flex
            mt={10}
            p={6}
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            flexDirection="column"
          >
            <Flex width="100%" justifyContent="space-between">
              <Box>
                <Tag
                  as={"a"}
                  target={"_blank"}
                  onClick={async () => {
                    shell.openExternal(
                      "https://february-labs.gitbook.io/february-labs/product-guides/devgpt-set-up/quick-start-tutorial"
                    );
                  }}
                  cursor={"pointer"}
                >
                  View Docs
                </Tag>
                <Tag
                  ml={2}
                  as={"a"}
                  target={"_blank"}
                  onClick={async () => {
                    await supabase.auth.signOut();
                    router.push("/login");
                  }}
                  cursor={"pointer"}
                >
                  Sign Out
                </Tag>
              </Box>
              <Flex
                id="blur"
                flexDirection="row"
                style={
                  showTutorial ? { filter: "blur(5px)", opacity: 0.5 } : {}
                }
              >
                <Tag
                  mb={2}
                  cursor="pointer"
                  // bg='#738adb'
                  onClick={() => {
                    shell.openExternal("https://discord.gg/6GFtwzuvtw");
                  }}
                >
                  <FaDiscord />
                  <Text ml={2}>Join discord</Text>
                </Tag>
              </Flex>
            </Flex>
          

            {showTutorial ? (
              <Tutorial
                onSettingsOpen={onSettingsOpen}
                progress={progress}
                localRepoDir={localRepoDir}
                technologiesUsed={technologiesUsed}
              />
            ) : (
              <MainEducation
                theme={theme === "Normal" ? false : true}
                setPrompt={setPrompt}
              />
            )}
            <Flex
              width="100%"
              rounded={"lg"}
              boxShadow={"lg"}
              justifyContent="space-between"
              direction={"column"}
              style={showTutorial ? { filter: "blur(5px)", opacity: 0.5 } : {}}
            >
              <Flex
                flex={1}
                justifyContent={"space-between"}
                alignItems={"center"}
                p={2}
              >
                <Box>
                  <Flex flexDirection="row">
                    <Kbd mb={2} mr={2}>
                      Tab
                    </Kbd>
                    <Text fontSize={12}>Accept Suggestions</Text>
                  </Flex>

                  <Flex flexDirection="row">
                    <Kbd mr={2}>@</Kbd>
                    <Text fontSize={12}>Search Files</Text>
                  </Flex>
                </Box>

                <Flex flexDirection="row" alignItems="center">
                  <Text fontSize={"sm"}>
                    {`${prompt.length}`}/{maxPromptLength} task length
                  </Text>
                  {userIsPremium ? (
                    <Tag
                      ml={2}
                      bgGradient="linear(to-t, blue.500, teal.500)"
                      _hover={{ backgroundColor: "teal.500" }}
                      cursor={"pointer"}
                      fontWeight={"bold"}
                    >
                      Premium
                    </Tag>
                  ) : (
                    <Tag
                      cursor="pointer"
                      onClick={() => {
                        onUpgradeOpen();
                      }}
                      ml={2}
                      bgGradient="linear(to-t, blue.500, teal.500)"
                      fontWeight={"bold"}
                    >
                      Upgrade
                    </Tag>
                  )}
                </Flex>
              </Flex>
              <InputGroup>
                {showRedBox && (
                  <Flex
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                    style={{
                      position: "absolute",
                      left: redBoxProps.x - 40,
                      top: redBoxProps.y,
                      zIndex: 1000000,
                    }}
                  >
                    {redBoxProps.label === "" ? (
                      <Tag pr={2} color="gray.500" fontSize="sm">
                        Type the file name...
                      </Tag>
                    ) : (
                      files
                        .filter((file) =>
                          file
                            .toLowerCase()
                            .includes(redBoxProps.label.toLowerCase())
                        )
                        .map((file, index) => {
                          if (index > 0) return null;

                          const indexOfAt = prompt.lastIndexOf("@");
                          const promptWithoutLastAt = prompt.substring(
                            0,
                            indexOfAt
                          );

                          suggestionRef.current = file;

                          return (
                            <Tag
                              // On click of the tag we want to insert the file name into the prompt
                              onClick={() => {
                                setShowRedBox(false);
                                setPrompt(promptWithoutLastAt + file);
                              }}
                              cursor="pointer"
                              mr={2}
                              key={file}
                              borderRadius={5}
                              fontSize="sm"
                            >
                              {file}
                              <Text ml={2}>
                                <Kbd size="md">Tab</Kbd> to accept
                              </Text>
                            </Tag>
                          );
                        })
                    )}
                  </Flex>
                )}
                <Tooltip
                  isOpen={
                    !isSettingsOpen && !showTutorial && tasks.length === 0
                  }
                  hasArrow
                  label="Write your prompt here, get creative!"
                  bg="gray.700"
                  color="white"
                  mb={1}
                >
                  <Textarea
                    ref={textAreaRef}
                    onChange={(e: any) => {
                      //make sure prompt is less than max prompt length
                      if (e.target.value.length > maxPromptLength) {
                        return;
                      }

                      const inputValue = e.target.value;
                      const indexOfAt = inputValue.lastIndexOf("@");

                      if (inputValue.includes("@")) {
                        setShowRedBox(true);
                        setRedBoxProps({
                          ...redBoxProps,
                          label: inputValue.substring(indexOfAt + 1),
                        });
                      } else {
                        setShowRedBox(false);
                      }

                      // Get the position of the caret
                      const caretPosition = e.target.selectionStart;
                      const width =
                        textAreaRef.current.getBoundingClientRect().width;
                      const typingLength = e.target.value.length * 8;
                      const numberOfWraps = Math.floor(typingLength / width);

                      const startingBonusSideWays = 80;
                      const incrementSideWays = 8;
                      const incrementDown = 25;
                      const startingBonusDown = 25;
                      const reset = numberOfWraps * -width;

                      setRedBoxProps({
                        ...redBoxProps,
                        label: e.target.value.substring(
                          e.target.value.lastIndexOf("@") + 1
                        ),
                        x:
                          reset +
                          caretPosition * incrementSideWays +
                          startingBonusSideWays,
                        y: numberOfWraps * incrementDown + startingBonusDown,
                      });

                      setPrompt(e.target.value);
                    }}
                    onKeyDown={(e: any) => {
                      // If the user does shift + enter, we dont want to submit the task
                      if (e.key === "Enter" && e.shiftKey) {
                        return;
                      }

                      if (!showRedBox && e.key === "Enter") {
                        e.preventDefault();
                        handleInitialSubmit();
                        setOriginalPrompt(prompt);
                      }

                      // If the user presses tab, we want to insert the first file name into the prompt
                      if (showRedBox && e.key === "Tab") {
                        e.preventDefault();

                        setShowRedBox(false);

                        // Replace the last @ with the file name
                        const indexOfAt = prompt.lastIndexOf("@");
                        const promptWithoutLastAt = prompt.substring(
                          0,
                          indexOfAt
                        );

                        setPrompt(
                          promptWithoutLastAt + `${suggestionRef.current} `
                        );
                      }
                    }}
                    autoFocus
                    resize="none"
                    fontSize="md"
                    height={160}
                    flexWrap="wrap"
                    justifyContent="space-between"
                    color="white"
                    border="1px solid rgba(255, 255, 255, 0.08)"
                    borderRadius="0.5rem"
                    backdropFilter="blur(10px)"
                    p={6}
                    value={prompt}
                    placeholder={
                      localRepoDir
                        ? "Enter a coding task, use @ to include your local files."
                        : "You must configure your local repository in settings before you can start a task."
                    }
                    _placeholder={{ color: "gray.400" }}
                  />
                </Tooltip>
                <InputRightElement height="100%" pb={2} mr={2}>
                  <Tooltip
                    label={
                      prompt.length < 6
                        ? "Unlock this by typing a task that is longer than 6 characters."
                        : !localRepoDir ||
                          technologiesUsed === "none" ||
                          technologiesUsed === "" ||
                          !technologiesUsed
                        ? "Unlock this by configuring your local repo, tech stack, and typing a task that is longer than 6 characters."
                        : "Complete task for me using AI"
                    }
                    aria-label="A tooltip"
                  >
                    {initialPromptLoading ? (
                      <Spinner size="md" />
                    ) : (
                      <IconButton
                        aria-label="Send"
                        isDisabled={
                          prompt.length < 6 ||
                          !localRepoDir ||
                          technologiesUsed === "none" ||
                          technologiesUsed === "" ||
                          !technologiesUsed
                        }
                        onClick={() => {
                          handleInitialSubmit();
                          setOriginalPrompt(prompt);
                        }}
                        // If the prompt is less than 6 characters, disable the hover

                        _hover={
                          prompt.length < 6
                            ? {}
                            : {
                                bgGradient: "linear(to-t, blue.500, teal.500)",
                              }
                        }
                        bgGradient={"linear(to-r, blue.500, teal.500)"}
                        alignSelf="flex-end"
                        icon={<LuSend />}
                      />
                    )}
                  </Tooltip>
                </InputRightElement>
              </InputGroup>
              <UpgradeModal
                isUpgradeOpen={isUpgradeOpen}
                onUpgradeClose={onUpgradeClose}
              />
            </Flex>
          </Flex>
        </Flex>
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
            <Heading pt={6} pb={4} size="md">
              Let's write some code!
            </Heading>

            <MessagesDisplay
              messages={history}
              transaction_id={transaction_id}
              setHistory={setHistory}
            />

            {history[history.length - 1]?.source === "error" && (
              <Button
                size="md"
                bgColor={"orange.400"}
                onClick={handleRegenerateResponse}
              >
                <Text>Regenerate response</Text>
              </Button>
            )}

            {history[history.length - 1]?.signOffMessageInGeneration && (
              <>
                <Button
                  mt={4}
                  onClick={() => {
                    playAudio(audios.synced, 0.1);
                    handleLocalFileSync();
                  }}
                  backgroundColor="green.600"
                  _hover={{ backgroundColor: "green.700" }}
                  minH="50"
                  w="full"
                  isDisabled={!localRepoDir}
                >
                  Sync Latest Changes to Local
                </Button>
                {userIsPremium ||
                !planIntegers?.is_follow_up_prompts_premium ? (
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
                                handleNewGenerationSubmit();
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
                ) : (
                  <Flex
                    borderRadius={6}
                    alignItems="center"
                    mt={4}
                    p={4}
                    position={"relative"}
                    justifyContent="center"
                    width={"100%"}
                  >
                    <Flex
                      style={{
                        filter: "blur(1px)",
                      }}
                      justifyContent="center"
                      alignItems="center"
                      width={"100%"}
                    >
                      <BlurredMessage isUser={true}>
                        <Flex flexDirection={"row"} flex={1}>
                          <Flex flex={1}>
                            <Input
                              isDisabled={true}
                              variant="flushed"
                              borderBottomRadius={0}
                              borderTopRadius={5}
                              w={"95%"}
                              p={2}
                              placeholder={"Follow up prompt..."}
                              _placeholder={{ color: "gray.400" }}
                              fontSize="md"
                              flexWrap="wrap"
                            />
                          </Flex>
                        </Flex>
                      </BlurredMessage>
                    </Flex>
                    <Flex
                      position="absolute"
                      zIndex={1}
                      top="50%"
                      left="50%"
                      transform="translate(-50%, -50%)"
                      flexDirection={"row"}
                      mt={2}
                    >
                      <Flex
                        flexDirection={"row"}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        <Text
                          mr={2}
                          justifyContent={"center"}
                          alignItems={"center"}
                          textAlign={"center"}
                        >
                          Upgrade to{" "}
                          <Text as="span" fontWeight={"bold"}>
                            Premium
                          </Text>{" "}
                          to unlock follow up prompts
                        </Text>
                        <Tag
                          cursor="pointer"
                          onClick={() => {
                            onUpgradeOpen();
                          }}
                          ml={2}
                          bgGradient={"linear(to-r, blue.500, teal.500)"}
                          fontWeight={"bold"}
                        >
                          Upgrade
                        </Tag>
                      </Flex>
                    </Flex>
                    <UpgradeModal
                      isUpgradeOpen={isUpgradeOpen}
                      onUpgradeClose={onUpgradeClose}
                    />
                  </Flex>
                )}
              </>
            )}
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default Environment;
