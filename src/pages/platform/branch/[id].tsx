"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  SkeletonText,
  Button,
  SlideFade,
  Textarea,
  Heading,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tag,
  Spinner,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Editor, { DiffEditor } from "@monaco-editor/react";
import { supabase } from "@/utils/supabase";
import {
  ChevronDownIcon,
  ArrowBackIcon,
  CopyIcon,
  ExternalLinkIcon,
} from "@chakra-ui/icons";
import { BiGitPullRequest, BiGlasses } from "react-icons/bi";
import { createBranch } from "git-connectors";
import moment from "moment";

//stores
import authStore from "@/store/Auth";

//components
import Template from "@/components/Template";

//utils
import getPromptCount from "@/utils/getPromptCount";

// Icons
import { useColorMode } from "@chakra-ui/react";
import { BiGitBranch } from "react-icons/bi";
import { TbGitBranchDeleted } from "react-icons/tb";
import checkCodeLanguage from "@/utils/checkCodeLanguage";
import { RiOpenSourceLine } from "react-icons/ri";
import { FaExternalLinkAlt } from "react-icons/fa";

const Branch = () => {
  // Sending prompts
  const [loading, setLoading] = useState<any>(true);
  const [task, setTask] = useState<any>(true);
  const [comment, setComment] = useState<any>("");
  const [open, setOpen] = useState<boolean>(true);

  // Git states
  const [branch, setBranch] = useState<any>({
    name: null,
    loading: false,
  });

  const [pullRequest, setPullRequest] = useState<any>({
    name: null,
    loading: false,
  });

  // Active state
  const router = useRouter();
  const { colorMode } = useColorMode();
  const { user, session, signOut }: any = authStore();
  const toast = useToast();

  const handleRaiseViaGit = async (pr: boolean) => {
    // The prop 'PR' here decides if a pr should be raised or not.
    // If false, it will only raise a branch.If true, it will raise a PR.

    if (!session?.provider_token) return;

    const parsedChanges = JSON.parse(task.output);

    // Map parsedChanges (an array of objects) into the blobs schema below
    const blobs = parsedChanges.map((change: any) => {
      return {
        filePath: change.fileName,
        content: change.newContent,
        comments: change.taskCompletedPreviously,
        examples: change.similarFile,
      };
    });

    const auth = {
      owner: task.owner,
      repo: task.repo,
    };

    const branchDetails = {
      branch_name: task.branchName,
      pr_title: `Task ${task.id} - ${task.tag}`,
      pr_body: task.branchDescription,
      randomly_generated_5_digit_number:
        String(task.id)
    };

    const commit = {
      commit_message: task.branchDescription,
      author_name: "DevGPT-AI",
      author_email: user?.email,
    };

    console.log({ blobs, auth, branchDetails, commit });


    // Pr decides if a PR should be raised or not, if false, it will only raise a branch. If true, it will raise a PR.
    if (pr) {
      setPullRequest({ ...pullRequest, loading: true });
      setBranch({ ...branch, loading: true });
    } else {
      setBranch({ ...branch, loading: true });
    }

    const data = await createBranch(
      blobs,
      auth,
      branchDetails,
      commit,
      session.provider_token,
      pr
    );

    if (data?.branch_name) {
      setBranch({ loading: false, name: data.branch_name });
    }

    if (data?.pull_request) {
      setPullRequest({ loading: false, name: data.pull_request });
    }
  };

  const closeBranch = async () => {
    // Update the status of this branch in supabase as 'false' / closed
    setOpen(false);
  };

  const handleAddComment = async () => {
    // Run this through the AI
    // Add comment to the branch in supabase
  };

  const handleCopyBranch = (branch: any) => {
    // Copy to clipboard
    navigator.clipboard.writeText(branch);

    // Tell the user via toast
    toast({
      title: "Copied to clipboard",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  const handleNavigateToPR = (url: any) => {
    // Open the URL in a new tab
    window.open(url, "_blank");

    // Tell the user via toast
    toast({
      title: "Opening PR in new tab",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  const loadTask = async () => {
    //load this task from the prompts table in supabase

    if (!supabase) return;

    const { data, error } = await supabase
      .from("prompts")
      .select("*")
      .eq("id", router.query.id);

    if (error) {
      console.error(error);
      return;
    } else {
      setLoading(false);
      setTask(data[0]);
    }
  };

  useEffect(() => {
    loadTask();
  }, [user]);

  if (loading) {
    return (
      <Template>
        <SkeletonText
          mt={4}
          mb={4}
          noOfLines={4}
          spacing={4}
          skeletonHeight="2"
        />
      </Template>
    );
  }

  return (
    <Template>
      <Flex
        direction="column"
        flex={1}
        w="98%"
        maxW="full"
        justifyContent={"center"}
        p={5}
      >
        <Flex
          flexDirection="column"
          className="flex flex-col border border-blue-800/40 shadow-2xl shadow-blue-900/30"
          justifyContent="space-between"
        >
          <Flex justifyContent={"space-between"} mb={6}>
            <Flex flexDirection="column">
              <Flex flexDirection="row">
                {pullRequest.name || branch.name ? (
                  <Tag
                    cursor="default"
                    borderRadius={"full"}
                    bgColor="#2da042"
                    color="white"
                    size="md"
                    mr={2}
                    px={4}
                    py={2}
                    gap={1}
                  >
                    <BiGitPullRequest size={18} />
                    Raised
                  </Tag>
                ) : (
                  <>
                    <Button
                      mr={4}
                      leftIcon={<ArrowBackIcon />}
                      colorScheme="gray"
                      borderRadius="lg"
                      onClick={() =>
                        router.push("/platform/agent", undefined, {
                          shallow: true,
                        })
                      }
                    >
                      Back
                    </Button>
                    {open && (
                      <Tag
                        cursor="default"
                        bgColor="#2da042"
                        color="white"
                        size="md"
                        mr={2}
                        px={4}
                        py={2}
                        gap={1}
                      >
                        <BiGitBranch size={18} />
                        Open
                      </Tag>
                    )}

                    {!open && (
                      <Tag
                        cursor="default"
                        borderRadius={"full"}
                        bgColor="#2da042"
                        color="white"
                        size="md"
                        mr={2}
                        px={4}
                        py={2}
                        gap={1}
                      >
                        <TbGitBranchDeleted size={18} />
                        Closed
                      </Tag>
                    )}
                  </>
                )}
              </Flex>
              <Heading mt={3}>{task.prompt}</Heading>
              <Text fontWeight={"semibold"} fontSize={14} mt={4}>
                #{task?.id}/{task?.branchName?.replace(/"/g, "")} opened{" "}
                {task?.created_at ? moment(task?.created_at).fromNow() : ""} via{" "}
                <Text as="span">DevGPT Web</Text>
              </Text>
            </Flex>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                bgColor="#2da042"
                color="white"
                size="md"
              >
                Review Changes
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => handleRaiseViaGit(true)}>
                  Raise PR
                </MenuItem>
                <MenuItem onClick={() => handleRaiseViaGit(false)}>
                  Open Git Branch
                </MenuItem>
                <MenuItem onClick={closeBranch}>Close Branch</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
          <Box>
            {/* generated files */}
            {JSON.parse(task?.output)?.map((file: any) => {
              return (
                <Box>
                  <Flex flexDirection="row" alignItems="center" gap={2}>
                    {file.originalContent ? (
                      <Badge colorScheme="green">EDITED</Badge>
                    ) : (
                      <Badge colorScheme="purple">NEW</Badge>
                    )}

                    <Text fontSize="sm" color="gray.400">
                      {file.fileName}
                    </Text>
                  </Flex>

                  <Text fontSize={14} mt={1}>
                    {file.tasksCompletedPreviously
                      ? file.tasksCompletedPreviously
                      : ""}
                  </Text>

                  <Box borderRadius={10} mt={2} mb={4} overflow="hidden">
                    {file.originalContent ? (
                      <DiffEditor
                        theme="vs-dark"
                        language={checkCodeLanguage(file.fileName)}
                        original={file.originalContent}
                        modified={file.newContent}
                        options={{
                          scrollBeyondLastLine: false,
                          padding: {
                            top: 20,
                            bottom: 0,
                          },
                          renderWhitespace: "none",
                        }}
                        height="300px"
                        className="editor"
                      />
                    ) : (
                      <Editor
                        value={file.newContent}
                        theme="vs-dark"
                        language={checkCodeLanguage(file.fileName)}
                        options={{
                          scrollBeyondLastLine: false,
                          padding: {
                            top: 20,
                            bottom: 0,
                          },
                          renderWhitespace: "none",
                        }}
                        height="300px"
                        className="editor"
                      />
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>

          <Flex mt={2} mb={2} flexDirection="column" gap={2}>
            <Flex
              border="0.5px solid green"
              p={4}
              rounded="lg"
              justifyContent="space-between"
              mb={4}
            >
              <Box>
                <Text fontWeight="bold" mb={1}>
                  Want to work on this in your own code-editor?
                </Text>
                <Text mb={1} fontSize={14}>
                  This will return a git branch ready to be copy-and-pasted.
                </Text>

                {branch.name && (
                  <SlideFade in={!!branch.name} offsetY="20px">
                    <InputGroup mt={2} cursor="pointer" width="100%">
                      <Input
                        fontSize={14}
                        width="100%"
                        value={`git fetch && git checkout ${branch.name.replace(
                          /"/g,
                          ""
                        )} `}
                        isReadOnly={true}
                        cursor="pointer"
                        onClick={() => {
                          handleCopyBranch(
                            `git fetch && git checkout ${branch.name.replace(
                              /"/g,
                              ""
                            )} `
                          );
                        }}
                      />
                      <InputRightElement
                        onClick={() => {
                          handleCopyBranch(
                            `git fetch && git checkout ${branch.name.replace(
                              /"/g,
                              ""
                            )} `
                          );
                        }}
                        children={<CopyIcon />}
                      />
                    </InputGroup>
                  </SlideFade>
                )}
              </Box>
              <Button onClick={() => handleRaiseViaGit(false)}>
                {branch.loading ? <Spinner size="sm" /> : "Create Branch"}
              </Button>
            </Flex>
            <Flex
              border="0.5px solid green"
              p={4}
              rounded="lg"
              justifyContent="space-between"
              mb={4}
            >
              <Box>
                <Text fontWeight="bold" mb={1}>
                  Ready to raise a pull request?
                </Text>
                <Text mb={1} fontSize={14}>
                  This will return a github URL of your pull request.
                </Text>
                {pullRequest.name && (
                  <SlideFade in={!!pullRequest.name} offsetY="20px">
                    <InputGroup mt={2} cursor="pointer" width="100%">
                      <Input
                        fontSize={14}
                        width="100%"
                        value={pullRequest.name}
                        isReadOnly={true}
                        cursor="pointer"
                        onClick={() => {
                          handleNavigateToPR(pullRequest.name);
                        }}
                      />
                      <InputRightElement
                        onClick={() => {
                          handleNavigateToPR(pullRequest.name);
                        }}
                        children={<ExternalLinkIcon />}
                      />
                    </InputGroup>
                  </SlideFade>
                )}
              </Box>
              <Button onClick={() => handleRaiseViaGit(true)}>
                {pullRequest.loading ? (
                  <Spinner size="sm" />
                ) : (
                  "Raise Pull Request"
                )}
              </Button>
            </Flex>
          </Flex>
          <Flex flexDirection="column">
            <Text mb={2} fontSize={14}>
              Add a comment
            </Text>
            <Textarea
              maxH="75vh"
              // On focus, add a glow
              // _focus={{
              //   boxShadow: "0 0 0 0.4rem rgba(0, 123, 255, .22)",
              //   borderColor: "blue.500",
              // }}
              // // On hover, add a glow
              // _hover={{
              //   boxShadow: "0 0 0 0.8rem rgba(0, 123, 255, .12)",
              //   borderColor: "blue.500",
              // }}
              className="fixed w-full max-w-md bottom-0 rounded shadow-xl p-2 dark:text-black"
              value={comment}
              p={5}
              placeholder="Add your comment here..."
              onChange={(e: any) => {
                setComment(e.target.value);
              }}
              onKeyDown={async (e: any) => {
                if (loading) return;

                // If key equals enter, submit
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                }
              }}
            />

            <Button
              mt={4}
              bg="#2da042"
              isDisabled={loading}
              color="white"
              width="10rem"
              onClick={handleAddComment}
              size="sm"
            >
              Comment
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Template>
  );
};

export default Branch;
