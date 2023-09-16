import React, { useState, useRef, useEffect } from "react";
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
import { shell } from "electron";
import { FaDiscord } from "react-icons/fa";
import { LuSend } from "react-icons/lu";

//todo clean up imports

//components
import MainEducation from "@/src/components/global/MainEducation";

import store from "@/redux/store";
import PromptInput from "./PromptInput";

const PrePromptScreen = ({ prompt, setPrompt, handleSubmit }: any) => {
  return (
    <Flex
      flexDirection="row"
      maxH="100vh"
      width="full"
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
          <Flex id="blur" flexDirection="row">
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

        <MainEducation theme={"Normal" === "Normal" ? false : true} />
        <PromptInput
          prompt={prompt}
          setPrompt={setPrompt}
          handleSubmit={handleSubmit}
          followUpPrompt={false}
        />
      </Flex>
    </Flex>
  );
};

export default PrePromptScreen;
