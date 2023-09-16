import React, { useState, useRef } from "react";
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

//components
import MainEducation from "@/src/components/global/MainEducation";

const PrePromptScreen = ({ prompt, setPrompt, handleSubmit }: any) => {
  const suggestionRef = useRef("");
  const textAreaRef = useRef(null);
  const [showRedBox, setShowRedBox] = useState(false);
  const [redBoxProps, setRedBoxProps] = useState({
    label: "",
    x: 0,
    y: 0,
  });

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
        <Flex
          width="100%"
          rounded={"lg"}
          boxShadow={"lg"}
          justifyContent="space-between"
          direction={"column"}
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

            <Textarea
              ref={textAreaRef}
              onChange={(e: any) => {
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
                const width = textAreaRef.current.getBoundingClientRect().width;
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
                  handleSubmit();
                }

                // If the user presses tab, we want to insert the first file name into the prompt
                if (showRedBox && e.key === "Tab") {
                  e.preventDefault();

                  setShowRedBox(false);

                  // Replace the last @ with the file name
                  const indexOfAt = prompt.lastIndexOf("@");
                  const promptWithoutLastAt = prompt.substring(0, indexOfAt);

                  setPrompt(promptWithoutLastAt + `${suggestionRef.current} `);
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
                "Enter a coding task, use @ to include your local files."
              }
              _placeholder={{ color: "gray.400" }}
            />

            <InputRightElement height="100%" pb={2} mr={2}>
              <IconButton
                aria-label="Send"
                onClick={() => {
                  handleSubmit();
                }}
                bgGradient={"linear(to-r, blue.500, teal.500)"}
                alignSelf="flex-end"
                icon={<LuSend />}
              />
            </InputRightElement>
          </InputGroup>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default PrePromptScreen;
