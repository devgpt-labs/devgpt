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
import { connect } from "react-redux";

//todo clean up imports

//utils
import getFilteredLofaf from "@/src/utils/getFilteredLofaf";

//components
import MainEducation from "@/src/components/global/MainEducation";

import store from "@/redux/store";

const PromptInput = ({
  prompt,
  setPrompt,
  handleSubmit,
  followUpPrompt,
  technologiesUsed,
  localRepoDir,
  context,
}: any) => {
  const suggestionRef = useRef("");
  const textAreaRef = useRef(null);
  const [files, setFiles] = useState([] as any); //used for auto-complete files with @
  const [showSelectFile, setShowSelectFile] = useState(false);
  const [selectFileProps, setSelectFileProps] = useState({
    label: "",
    x: 0,
    y: 0,
  });

  const submitToLLM = () => {
    handleSubmit(technologiesUsed, context);
  };

  useEffect(() => {
    const setLocalFilesForAutoComplete = async () => {
      if (!localRepoDir) {
        return;
      }
      const autoCompletingFiles = await getFilteredLofaf(localRepoDir);
      //remove the localRepoDir from the file path of every file
      autoCompletingFiles.forEach((file, index) => {
        autoCompletingFiles[index] = file.replace(localRepoDir, "");
      });

      setFiles(autoCompletingFiles);
    };
    setLocalFilesForAutoComplete();
  }, [localRepoDir]);

  return (
    <Flex
      width="100%"
      rounded={"lg"}
      boxShadow={"lg"}
      justifyContent="space-between"
      direction={"column"}
      mt={5}
    >
      {!followUpPrompt && (
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
      )}
      <InputGroup>
        {showSelectFile && (
          <Flex
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            style={{
              position: "absolute",
              left: selectFileProps.x - 40,
              top: selectFileProps.y,
              zIndex: 1000000,
            }}
          >
            {selectFileProps.label === "" ? (
              <Tag pr={2} color="gray.500" fontSize="sm">
                Type the file name...
              </Tag>
            ) : (
              files
                .filter((file) =>
                  file
                    .toLowerCase()
                    .includes(selectFileProps.label.toLowerCase())
                )
                .map((file, index) => {
                  if (index > 0) return null;

                  const indexOfAt = prompt.lastIndexOf("@");
                  const promptWithoutLastAt = prompt.substring(0, indexOfAt);

                  suggestionRef.current = file;

                  return (
                    <Tag
                      // On click of the tag we want to insert the file name into the prompt
                      onClick={() => {
                        setShowSelectFile(false);
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
          autoFocus
          ref={textAreaRef}
          onChange={(e: any) => {
            const inputValue = e.target.value;
            const indexOfAt = inputValue.lastIndexOf("@");

            if (inputValue.includes("@")) {
              setShowSelectFile(true);
              setSelectFileProps({
                ...selectFileProps,
                label: inputValue.substring(indexOfAt + 1),
              });
            } else {
              setShowSelectFile(false);
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

            setSelectFileProps({
              ...selectFileProps,
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

            if (!showSelectFile && e.key === "Enter") {
              e.preventDefault();
              submitToLLM();
            }

            // If the user presses tab, we want to insert the first file name into the prompt
            if (showSelectFile && e.key === "Tab") {
              e.preventDefault();

              setShowSelectFile(false);

              // Replace the last @ with @filepath
              const indexOfAt = prompt.lastIndexOf("@");
              const promptWithoutLastAt = prompt.substring(0, indexOfAt);

              setPrompt(promptWithoutLastAt + `@${suggestionRef.current} `);
            }
          }}
          autoFocus
          resize="none"
          fontSize="md"
          height={160}
          flexWrap="wrap"
          justifyContent="space-between"
          color="white"
          border="1px solid rgba(150, 150, 180)"
          borderRadius="0.5rem"
          backdropFilter="blur(10px)"
          p={6}
          value={prompt}
          placeholder={`${!followUpPrompt ? "Enter a coding task, U" : "U"
            }se @ to include your local files.`}
          _placeholder={{ color: "gray.400" }}
        />

        <InputRightElement height="100%" pb={2} mr={2}>
          <IconButton
            aria-label="Send"
            onClick={() => {
              submitToLLM();
            }}
            bgGradient={"linear(to-r, blue.500, teal.500)"}
            alignSelf="flex-end"
            icon={<LuSend />}
          />
        </InputRightElement>
      </InputGroup>
    </Flex>
  );
};

const mapStateToProps = (state) => {
  return {
    technologiesUsed: state.technologiesUsed,
    localRepoDir: state.localRepoDir,
    context: state.context,
  };
};

export default connect(mapStateToProps)(PromptInput);
