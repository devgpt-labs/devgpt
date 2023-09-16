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

//todo clean up imports

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

  const resetState = () => {
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
      resetState();
    } else {
      //load this transaction from supabase and load it into in-transaction state
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
    setPrompt("");

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
            const newState = [...prevState];

            if (prevState[prevState.length - 1]?.source === "advice") {
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
        console.log({ err });
      });
    }
  };

  //bind technologiesUsed and localRepoDir with redux store
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setTechnologiesUsed(store.getState().technologiesUsed);
      setLocalRepoDir(store.getState().localRepoDirectory);
      setContext(store.getState().context);
    });

    return unsubscribe;
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

  return (
    <>
      {history.length === 0 ? (
        <PrePromptScreen
          prompt={prompt}
          setPrompt={setPrompt}
          handleSubmit={handleSubmit}
        />
      ) : (
        
      )}
    </>
  );
};

export default Environment;
