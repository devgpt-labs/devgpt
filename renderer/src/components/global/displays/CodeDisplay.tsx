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
import { supabase } from "@/src/utils/supabaseClient";
import { useAuthContext } from "@/src/context";

//utils
import syncCodeChangesWithLocalFileSystem from "@/src/components/platform/transaction/utils/syncCodeChangesWithLocalFileSystem";
import { AiOutlineSync } from "react-icons/ai";
import audios from "@/src/config/audios";
import playAudio from "@/src/utils/playAudio";

interface CodeDisplayProps {
  codeChanges: any;
  transaction_id: any;
}

const CodeDisplay = ({ codeChanges, transaction_id }: CodeDisplayProps) => {
  const [localRepoDir, setLocalRepoDir] = useState(false);
  const [theme, setTheme] = useState("DevGPT");
  const { user } = useAuthContext();
  const toast = useToast();

  const getlocalRepoDir = async () => {
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

    if (data?.local_repo_dir) {
      setLocalRepoDir(data?.local_repo_dir);
    }
  };

  useEffect(() => {
    getlocalRepoDir();
  }, []);

  const handleClick = (file: string) => {
    // Change the file path to the one you want to open in VSCode
    const filePath = file;

    // Construct the vscode:// URL with the file path
    const vscodeUrl: string = `vscode://file${filePath}`;
    const jetbrainsUrl: string = `jetbrains://open?file=${filePath}`;

    open(vscodeUrl);
  };

  const copyCode = (code) => {
    toast({
      title: "Code Copied",
      description: "Your code has been copied to your clipboard.",
      position: "top-right",
      status: "success",
      duration: 5000,
      isClosable: true,
    });

    navigator.clipboard.writeText(code);
  };

  const syncSingleFile = async (
    index: number,
    file_name: string,
    code: string
  ) => {
    let code_changes_prepared = [
      {
        file_name: file_name,
        code: code,
      },
    ];

    toast({
      title: "Code Synced",
      description: "I have synced this code into your local code editor.",
      position: "top-right",
      status: "success",
      duration: 5000,
      isClosable: true,
    });

    const updatedCodeChanges = [...codeChanges];

    updatedCodeChanges[index] = {
      ...updatedCodeChanges[index],
      code: code,
    };

    if (!supabase) {
      return;
    }

    // Update the code in supabase new_transactions table
    const { data, error } = await supabase
      .from("new_transactions")
      .update({ code: updatedCodeChanges })
      .eq("transaction_id", transaction_id.transaction_id)
      .eq("user_id", user?.id);

    if (error) {
      console.log(error);
    }
    syncCodeChangesWithLocalFileSystem(code_changes_prepared, localRepoDir);
  };

  const giveCodeFeedback = async (feedback) => {
    if (!supabase) {
      return;
    }

    // Insert 'downvote' into the feedback column
    const { data, error } = await supabase
      .from("new_transactions")
      .update({ feedback: feedback })
      .eq("transaction_id", transaction_id.transaction_id)
      .eq("user_id", user?.id);

    if (error) {
      console.log(error);
    }

    switch (feedback) {
      case "downvote":
        toast({
          title: "Downvote Recieved.",
          description:
            "Your vote has been stored. We're sorry to hear this code generation didn't go well, but your feedback helps us improve!",
          position: "top-right",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        break;
      case "upvote":
        toast({
          title: "Upvote Recieved.",
          description:
            "Your vote has been stored. We're happy to hear you liked it!",
          position: "top-right",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        break;
      default:
        toast({
          title: "Feedback Recieved.",
          description:
            "Even though we didn't perfectly create code this time around, your feedback helps us improve! Thank you for giving feedback.",
          position: "top-right",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        break;
    }
  };

  return (
    <Flex flexDirection="column">
      {codeChanges?.map(({ file_name, code }, index) => {
        return (
          <Box mt={4} key={`${index}_codechange_key1`}>
            <SandpackProvider
              customSetup={{
                entry: `${file_name}`,
              }}
              files={{
                [file_name]: code,
              }}
              theme={
                themeOptions.find((themeOption) => themeOption.name === theme)
                  ?.theme
              }
            >
              <Editor
                index={index}
                theme={theme}
                file_name={file_name}
                setTheme={setTheme}
                codeChanges={codeChanges}
                // setCodeChanges={setCodeChanges}
                transaction_id={transaction_id}
                user_id={user?.id}
                syncSingleFile={syncSingleFile}
                copyCode={copyCode}
                giveCodeFeedback={giveCodeFeedback}
                localRepoDir={localRepoDir}
              />
            </SandpackProvider>
          </Box>
        );
      })}
    </Flex>
  );
};

export default CodeDisplay;

interface EditorProps {
  codeChanges: any;
  file_name: string;
  theme: string;
  setTheme: any;
  // setCodeChanges: any;
  index: number;
  transaction_id: any;
  user_id: string;
  unsavedChanges?: boolean;
  setUnsavedChanges?: any;
  saveChanges?: any;
  syncSingleFile?: any;
  copyCode?: any;
  giveCodeFeedback: any;
  localRepoDir: any;
}

const Editor = ({
  file_name,
  theme,
  setTheme,
  codeChanges,
  // setCodeChanges,
  index,
  transaction_id,
  user_id,
  syncSingleFile,
  copyCode,
  giveCodeFeedback,
  localRepoDir,
}: EditorProps) => {
  const { sandpack } = useSandpack();
  const [userIsDownvoting, setUserIsDownvoting] = useState(false);
  const [feedback, setFeedback] = useState("");

  const FULL_RELATIVE_PATH = String(`/${file_name}`).trim();
  const FULL_ABSOLUTE_PATH = String(`${localRepoDir}/${file_name}`).trim();

  // Handle updating local state with code changes
  const handleCodeChange = async (index, newCode) => {
    const updatedCodeChanges = [...codeChanges];
    if (newCode !== codeChanges[index]?.code) {
      updatedCodeChanges[index] = {
        ...updatedCodeChanges[index],
        code: newCode,
      };
    }
  };

  // If transaction_id changes, refresh userIsDownvoting
  useEffect(() => {
    setUserIsDownvoting(false);
  }, [transaction_id]);

  // Update the code locally when changes are made immediately
  useEffect(() => {
    // If the file_name doesn't start with a /, add one
    if (!file_name.startsWith("/")) {
      file_name = "/" + file_name;
    }

    handleCodeChange(index, sandpack?.files?.[file_name]?.code);
  }, [sandpack.files]);

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

  return (
    <Flex pos="relative" flexDirection="column">
      <Flex pos="absolute" bottom={0} zIndex={1000} p={2}>
        {themeOptions.map((themeOption, index) => (
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
        ))}
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
        {file_name && (
          <Text p={1}>
            {file_name.length > 50
              ? "..." +
                file_name.substring(file_name.length - 50, file_name.length)
              : file_name}
          </Text>
        )}
        <Flex flexDirection="row">
          {userIsDownvoting ? (
            <Flex flexDirection="row">
              <Input
                value={feedback}
                onChange={(e) => {
                  setFeedback(e.target.value);
                }}
                mr={2}
                placeholder="What went wrong?"
                size="sm"
                borderRadius={10}
              />
              <CodeTag
                label="Send"
                icon={<TbSend />}
                onClick={() => {
                  giveCodeFeedback(feedback);
                }}
              />
            </Flex>
          ) : (
            <Flex flexDirection="row">
              <CodeTag
                label="Upvote"
                icon={<IoThumbsUpOutline />}
                onClick={() => {
                  giveCodeFeedback("upvote");
                }}
              />
              <CodeTag
                label="Downvote"
                icon={<IoThumbsDownOutline />}
                onClick={() => {
                  setUserIsDownvoting(true);
                  giveCodeFeedback("downvote");
                }}
              />
            </Flex>
          )}

          <CodeTag
            label="Copy"
            icon={<IoCopyOutline />}
            onClick={() => {
              copyCode(sandpack?.files?.[FULL_RELATIVE_PATH]?.code);
            }}
          />
          <CodeTag
            label="Sync To IDE"
            icon={<AiOutlineSync />}
            onClick={() => {
              playAudio(audios.synced, 0.1);

              syncSingleFile(
                index,
                FULL_ABSOLUTE_PATH,
                sandpack?.files?.[FULL_RELATIVE_PATH]?.code
              );
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
          // showTabs={true}
          wrapContent={true}
        />
      </SandpackLayout>
    </Flex>
  );
};

interface ThemeOption {
  name: string;
  theme: any; // Replace 'any' with the correct type if possible
}

const themeOptions: ThemeOption[] = [
  {
    name: "DevGPT",
    theme: {
      colors: {
        surface1: "#171923",
        surface2: "#171923",
        surface3: "#171923",
        clickable: "#999999",
        base: "#808080",
        disabled: "#4D4D4D",
        hover: "#C5C5C5",
        accent: "#4299e1",
        error: "#ff453a",
        errorSurface: "#ffeceb",
      },
      syntax: {
        plain: "#FFFFFF",
        comment: {
          color: "#757575",
          fontStyle: "italic",
        },
        keyword: "#4299e1",
        tag: "#d28cf6",
        punctuation: "#ffffff",
        definition: "#b3d6f3",
        property: "#4299e1",
        static: "#FF453A",
        string: "#bf5af2",
      },
      font: {
        body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        mono: '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
        size: "13px",
        lineHeight: "20px",
      },
    },
  },
  {
    name: "Amethyst",
    theme: amethyst,
  },
  {
    name: "Cobalt",
    theme: cyberpunk,
  },
  {
    name: "Gruvbox",
    theme: gruvboxDark,
  },
  {
    name: "Monokai",
    theme: monokaiPro,
  },
  {
    name: "Light",
    theme: ecoLight,
  },
];
