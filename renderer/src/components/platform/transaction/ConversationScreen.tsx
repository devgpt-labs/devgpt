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
    <Flex
      flexDirection="column"
      maxH="100vh"
      width="full"
      overflowY="scroll"
      w={"full"}
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
            </Flex>
          </Message>
        </>
      )}
    </Flex>
  );
};

export default ConversationScreen;
