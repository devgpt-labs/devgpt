"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Input,
  Tag,
  SlideFade,
  Text,
  Flex,
  useToast,
  Tooltip,
  Kbd,
  Spinner,
} from "@chakra-ui/react";
import { FC, FormEvent } from "react";
import getLofaf from "@/utils/github/getLofaf";
import { useSessionContext } from "@/context/useSessionContext";
import { LuSend } from "react-icons/lu";
import { BsHourglassSplit } from "react-icons/bs";

interface Props {
  promptCount: number;
  prompt: string;
  setPrompt: (_prompt: string) => void;
  onSubmit: (_prompt: string) => void;
  isLoading: boolean;
}

export const PromptInput: FC<Props> = (props) => {
  const [allFiles, setAllFiles] = useState<any[]>([]); // [ { name: 'file1', content: 'file1 content' }
  const [failMessage, setFailMessage] = useState<string>("");
  const [hasSentAMessage, setHasSentAMessage] = useState<boolean>(true);
  const [previousLofafSettings, setPreviousLofafSettings] = useState<any>({});
  const { repo, session, methods, repoWindowOpen, branch, messages } =
    useSessionContext();
  const toast = useToast();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (props.prompt.length === 0 || props.isLoading) return null;
    setHasSentAMessage(true);
    props.onSubmit(props.prompt);
  };

  // This logic breaks down the prompt to find @'d files
  const regex = /@([^ ]+)/g;
  const withAt: any = [];
  let match: any;
  while ((match = regex.exec(props.prompt))) {
    withAt.push(match[1]);
  }

  // Get the current file being targeted with @
  const selectedFile = allFiles?.filter((file) => {
    if (file?.toLowerCase()?.includes(withAt?.[0]?.toLowerCase())) {
      return file;
    }
  });

  // If the user clicks tab, we want to autocomplete the file name
  const handleKeyDown = (file: any) => {
    // Append currentSuggestion to prompt
    const promptArray = props.prompt.split(" ");

    const lastWord = promptArray[promptArray.length - 1];
    const newPrompt = props.prompt.replace(lastWord, `~${file}`);

    props.setPrompt(newPrompt);
    // Refocus on input
    const input = document.getElementById("message");
    input?.focus();
  };

  useEffect(() => {
    setAllFiles([]);

    if (!repo.owner || !repo.repo || !session?.provider_token) {
      return;
    }

    if (
      previousLofafSettings?.owner === repo?.owner &&
      previousLofafSettings?.repo === repo?.repo &&
      previousLofafSettings?.branch === branch
    ) {
      //skip if we already have the files for this repo
      return;
    }

    getLofaf(repo.owner, repo.repo, branch, session?.provider_token)
      .then((files: any) => {
        if (!files) return;

        // Move this to global session
        const repoFiles = files?.tree?.map((file: any) => {
          return file.path;
        });

        setPreviousLofafSettings({
          owner: repo.owner,
          repo: repo.repo,
          branch: branch,
        });

        methods.setLofaf(repoFiles);
        setAllFiles(repoFiles);
      })
      .catch((err) => {
        toast({
          title: "Error",
          description:
            "There was an error fetching your repo files. This is likely due to an incorrect branch name.",
        });
        setFailMessage(
          `There was an error fetching your repo files for ${repo.repo}. This is likely due to an incorrect branch name. You can change the branch name being used in "Settings", the default branch name is "main"`
        );
        methods.setRepo({ owner: "", repo: "" });
        console.error({ err });
      });
  }, [repo.owner, repo.repo, branch, methods, session?.provider_token, toast]);

  if (repo.repo === "") {
    return (
      <>
        <Button
          mt={4}
          onClick={() => {
            methods.setRepoWindowOpen(!repoWindowOpen);
          }}
        >
          Select a repo to get started
        </Button>
        <Text fontSize={12} mt={2}>
          {failMessage}
        </Text>
      </>
    );
  }

  if (
    messages.length === 0 &&
    repo.repo !== "" &&
    process.env.NODE_ENV !== "development"
  ) {
    return (
      <Flex flexDirection="row" alignItems="center" mt={5}>
        <Spinner />
        <Text ml={4}>Training a model with context from your codebase...</Text>
      </Flex>
    );
  }

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="column" alignItems="flex-start">
        {withAt.length > 0 && (
          <Flex alignItems={"center"} my={2}>
            <Kbd>Tab</Kbd>
            <Text ml={1}> to accept suggestion</Text>
          </Flex>
        )}
        <Flex flexDirection="row" flexWrap="wrap">
          <SlideFade key={match} in={selectedFile[0] ? true : false}>
            {selectedFile.map((file, index) => {
              if (index > 12) return null;
              return (
                <Tag
                  mr={1}
                  mb={1}
                  key={file}
                  cursor="pointer"
                  onClick={() => handleKeyDown(file)}
                >
                  {file}
                </Tag>
              );
            })}
          </SlideFade>
        </Flex>
      </Flex>
      <form
        className="-mx-5 px-5 mt-5 flex gap-2 items-center"
        onSubmit={onSubmit}
      >
        <Tooltip
          placement="top"
          isOpen
          label={!hasSentAMessage && "Write your task for DevGPT here!"}
        >
          <Input
            onKeyDown={(e: any) => {
              // If key equals tab, autocomplete
              if (e.key === "Tab") {
                e.preventDefault();
                handleKeyDown(selectedFile[0]);
                return;
              }

              // If key equals enter, submit
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit(e);
                return;
              }
            }}
            onChange={(e) => {
              props.setPrompt(e.target.value);
            }}
            value={props.prompt}
            type="text"
            id="message"
            autoComplete="off"
            name="message"
            required
            className=" bg-transparent rounded-md p-4 flex-1 max-h-56 focus:ring-0 focus:outline-none"
            placeholder="Enter your task, e.g. Create a login page, or use @ to select a file from your repo."
          />
        </Tooltip>
        <Button
          bgGradient="linear(to-tr, teal.500, blue.500)"
          disabled={props.isLoading}
          type="submit"
          px={6}
          _hover={{ bg: "slate.600" }}
          cursor="pointer"
        >
          {props.isLoading ? (
            <BsHourglassSplit color="white" />
          ) : (
            <LuSend color="white" />
          )}
        </Button>
      </form>
    </Flex>
  );
};
