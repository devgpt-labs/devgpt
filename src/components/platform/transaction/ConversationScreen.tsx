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

import { LuSend } from "react-icons/lu";

//components
import MessagesDisplay from "../../global/displays/MessagesDisplay";
import checkUsersCodeUsage from "@/src/utils/checkUsersCodeUsage";
import MainEducation from "@/src/components/global/MainEducation";
import Tutorial from "@/src/components/global/Tutorial";
import UpgradeModal from "../../global/UpgradeModal";
import Message from "../../global/Message";
import BlurredMessage from "../../global/BlurredMessage";
import PromptInput from "./PromptInput";

//todo clean up imports

const ConversationScreen = ({
  history,
  setHistory,
  transaction_id,
  prompt,
  setPrompt,
  handleSubmit,
}: any) => {
  return (
    <Flex flexDirection="column" maxH="100vh" width="full" overflowY="scroll">
      <Flex
        mt={10}
        p={6}
        justifyContent="space-between"
        w={"full"}
        flexDirection="column"
      >
        {/* todo do not show to premium users, or replace the message with a thank you for supporting us */}
        <Alert status="info">
          <AlertIcon />
          Get 4X longer responses with gpt-4-32k - $16.99/month
        </Alert>

        <MessagesDisplay
          messages={history}
          transaction_id={transaction_id}
          setHistory={setHistory}
        />

        {history.length > 0 && (
          <>
            <PromptInput
              prompt={prompt}
              setPrompt={setPrompt}
              handleSubmit={handleSubmit}
              followUpPrompt={true}
            />
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default ConversationScreen;
