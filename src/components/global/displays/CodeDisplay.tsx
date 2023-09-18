import React, { useState, useEffect } from "react";
import {
  Flex,
  Text,
  Box,
  Tag,
  useToast,
  TagLabel,
  Input,
} from "@chakra-ui/react";
import { TbSend } from "react-icons/tb";
import {
  IoCopyOutline,
  IoThumbsDownOutline,
  IoThumbsUpOutline,
} from "react-icons/io5";
import {
  monokaiPro,
  cyberpunk,
  gruvboxDark,
  ecoLight,
  amethyst,
} from "@codesandbox/sandpack-themes";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { supabase } from "@/src/utils/supabase/supabase";
import { useAuthContext } from "@/src/context";

//utils
import syncCodeChangesWithLocalFileSystem from "@/src/utils/syncCodeChangesWithLocalFileSystem";
import { AiOutlineSync } from "react-icons/ai";
import audios from "@/src/config/audios";
import playAudio from "@/src/utils/playAudio";

interface CodeDisplayProps {
  code: string;
  path: string;
  transaction_id?: string;
}

const CodeDisplay = ({ code, path, transaction_id }: CodeDisplayProps) => {
  //const { sandpack } = useSandpack();
  const [userIsDownvoting, setUserIsDownvoting] = useState(false);
  const [feedback, setFeedback] = useState("");

  // Handle updating local state with code changes
  // const handleCodeChange = async (index, newCode) => {
  //   const updatedCodeChanges = [...codeChanges];
  //   if (newCode !== codeChanges[index]?.code) {
  //     updatedCodeChanges[index] = {
  //       ...updatedCodeChanges[index],
  //       code: newCode,
  //     };
  //   }
  // };

  // If transaction_id changes, refresh userIsDownvoting
  // useEffect(() => {
  //   setUserIsDownvoting(false);
  // }, [transaction_id]);

  // Update the code locally when changes are made immediately
  // useEffect(() => {
  //   // If the file_name doesn't start with a /, add one
  //   if (!file_name.startsWith("/")) {
  //     file_name = "/" + file_name;
  //   }

  //   handleCodeChange(index, sandpack?.files?.[file_name]?.code);
  // }, [sandpack.files]);

  return (
    <SandpackProvider>
      <Flex pos="relative" flexDirection="column">
        <Flex pos="absolute" bottom={0} zIndex={1000} p={2}>
          {/* {themeOptions.map((themeOption, index) => (
          <Tag
            key={`${index}_error_key1`}
            onClick={() => {
              setTheme(themeOption.name);
            }}
            mr={2}
            cursor="pointer"
            bgColor={themeOption.theme.colors.surface1}
            color={themeOption.theme.colors.accent}
            outline={theme === themeOption.name ? "2px solid" : "none"}
          >
            <TagLabel>{themeOption.name}</TagLabel>
          </Tag>
        ))} */}
        </Flex>
        <Flex
          p={2}
          mt={2}
          width="100%"
          zIndex={1}
          pos="absolute"
          flexDirection="row"
          justifyContent="space-between"
        >
          {path && (
            <Text p={1}>
              {path.length > 50
                ? "..." + path.substring(path.length - 50, path.length)
                : path}
            </Text>
          )}
          <Flex flexDirection="row">
            <Flex flexDirection="row">
              <CodeTag
                label="Upvote"
                icon={<IoThumbsUpOutline />}
                onClick={() => {
                  // giveCodeFeedback("upvote");
                }}
              />
              <CodeTag
                label="Downvote"
                icon={<IoThumbsDownOutline />}
                onClick={() => {
                  setUserIsDownvoting(true);
                  // giveCodeFeedback("downvote");
                }}
              />
            </Flex>
            <CodeTag
              label="Copy"
              icon={<IoCopyOutline />}
              onClick={() => {
                //copyCode(sandpack?.files?.[path]?.code); //todo
              }}
            />
            <CodeTag
              label="Sync To IDE"
              icon={<AiOutlineSync />}
              onClick={() => {
                playAudio(audios.synced, 0.1);

                // syncSingleFile(
                //   index,
                //   FULL_ABSOLUTE_PATH,
                //   sandpack?.files?.[path]?.code
                // ); //todo
              }}
            />
          </Flex>
        </Flex>
        <SandpackLayout>
          <SandpackCodeEditor
            style={{
              height: 450,
              width: "60vw",
              paddingTop: 45,
              paddingBottom: 45,
              fontSize: 14,
            }}
            readOnly={false}
            showLineNumbers={true}
            wrapContent={true}
          // showTabs={true}
          />
        </SandpackLayout>
      </Flex>
    </SandpackProvider>
  );
};

export default CodeDisplay;

interface CodeTagProps {
  label: string;
  icon: any;
  onClick: () => void;
}

const CodeTag = ({ label, icon, onClick }: CodeTagProps) => {
  let color;
  switch (label) {
    case "Upvote":
      color = "rgba(0,260,0,0.1)";
      break;
    case "Downvote":
      color = "rgba(260,0,0,0.1)";
      break;
    case "Copy":
      color = "rgba(0,0,0,0.1)";
      break;
    case "Sync To IDE":
      color = "rgba(0,0,0,0.1)";
      break;
    default:
      color = "rgba(0,0,0,0.1)";
      break;
  }

  return (
    <Flex
      cursor="pointer"
      p={2}
      mx={1}
      borderRadius={5}
      bg={color}
      alignItems="center"
      flexDirection="row"
      onClick={onClick}
    >
      <Text mr={2}>{label}</Text>
      {icon}
    </Flex>
  );
};
