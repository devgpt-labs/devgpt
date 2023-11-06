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
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Editor, { DiffEditor } from "@monaco-editor/react";
import { supabase } from "@/utils/supabase";
import { ChevronDownIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { BiGitPullRequest, BiGlasses } from "react-icons/bi";
import { createBranch } from "git-connectors";

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

  const handleRaiseViaGit = async (pr: boolean) => {
    // The prop 'PR' here decides if a pr should be raised or not.
    // If false, it will only raise a branch.If true, it will raise a PR.

    if (!session?.provider_token) return;

    const blobs = [
      {
        filePath: "app2.js",
        content: "const a = b",
        comments: "i did this",
        examples: ["app.js"],
      },
    ];

    const auth = {
      owner: "tom-lewis-code",
      repo: "toms-public-sand-pit",
    };

    const randomly_generated_number = Math.floor(1000 + Math.random() * 9000);

    const branchDetails = {
      branch_name: "newest-branch",
      pr_title: "title",
      pr_body: "body",
      randomly_generated_5_digit_number: randomly_generated_number,
    };

    const commit = {
      commit_message: "my commit message",
      author_name: "tom",
      author_email: "tom@feb.co.uk",
    };

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

  const loadTask = async () => {
    //load this task from the prompts table in supabase

    if (!supabase) return;

    const { data, error } = await supabase
      .from("prompts")
      .select("*")
      .eq("id", router.query.id);

    if (!error) {
      setLoading(false);
      setTask(data);
    }
  };

  useEffect(() => {
    loadTask();

    if (!session?.provider_token) {
      signOut();
      router.push("/", undefined, { shallow: true });
      console.log("no session found, returning to home");
    }

    if (!user) {
      signOut();
      router.push("/", undefined, { shallow: true });
      console.log("no user found, returning to home");
    }
  }, []);

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
          {task.branchName && (
            <SlideFade in={!!task.branchName}>
              <Flex alignItems={"center"} mb={1}>
                <Button
                  mr={2}
                  leftIcon={<ArrowBackIcon />}
                  colorScheme="gray"
                  borderRadius="lg"
                  onClick={() =>
                    router.push("/platform/agent", undefined, { shallow: true })
                  }
                >
                  Back
                </Button>
                <Heading mt={2} mb={4} size="lg">
                  {task.branchName}
                </Heading>
              </Flex>
            </SlideFade>
          )}

          <Flex justifyContent={"space-between"} mb={3}>
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
                    {open && (
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

                {/* {open && (
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
                    colorScheme="white"
                  >
                    <BiGlasses size={20} />
                    Review Required
                  </Tag>
                )} */}
              </Flex>

              <Text fontWeight={"semibold"} fontSize={14} mt={2}>
                #{task.id} opened 3 minutes ago via{" "}
                <Text as="span">DevGPT Web</Text>
              </Text>
            </Flex>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                bgColor="#2da042"
                color="white"
                size="sm"
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
          <Box mt={2}>
            {/* generated files */}
            {task?.output?.map((file: any) => {
              return (
                <Box>
                  <Flex flexDirection="row" alignItems="center" gap={2}>
                    {file.originalContent ? (
                      <Badge colorScheme="blue">EDITED</Badge>
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
                        language="javascript"
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
                        language="javascript"
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

          <Flex flexDirection="column">
            <Heading size="sm" mb={3}>
              Any comments?
            </Heading>
            <Textarea
              maxH="75vh"
              // On focus, add a glow
              _focus={{
                boxShadow: "0 0 0 0.4rem rgba(0, 123, 255, .22)",
                borderColor: "blue.500",
              }}
              // On hover, add a glow
              _hover={{
                boxShadow: "0 0 0 0.8rem rgba(0, 123, 255, .12)",
                borderColor: "blue.500",
              }}
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
          <Flex mt={4} flexDirection="column">
            {!branch.name ? (
              <Text>No Branch</Text>
            ) : branch.loading ? (
              <Spinner />
            ) : (
              <Text>Your Branch: {branch.name}</Text>
            )}
            {!pullRequest.name ? (
              <Text>No PR</Text>
            ) : pullRequest.loading ? (
              <Spinner />
            ) : (
              <Text>Your PR: {pullRequest.name}</Text>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Template>
  );
};

export default Branch;
