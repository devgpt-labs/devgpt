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
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Editor, { DiffEditor } from "@monaco-editor/react";

import { supabase } from "@/utils/supabase";

import { ChevronDownIcon, ArrowBackIcon } from "@chakra-ui/icons";

//stores
import authStore from "@/store/Auth";

//components
import Template from "@/components/Template";

//utils
import getPromptCount from "@/utils/getPromptCount";

// Icons
import { useColorMode } from "@chakra-ui/react";

const Branch = () => {
  // Constants

  // Sending prompts
  const [loading, setLoading] = useState<any>(true);
  const [task, setTask] = useState<any>(true);

  // Active state
  const router = useRouter();
  const { colorMode } = useColorMode();
  const {
    user,
    session,
    stripe_customer_id,
    signOut,
    status,
    credits,
    isPro,
  }: any = authStore();

  const loadTask = async () => {
    //load this task from the prompts table in supabase

    if (!supabase) return;

    const { data, error } = await supabase
      .from("prompts")
      .select("*")
      .eq("id", router.query.id);

    console.log({ data, error });

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
        <Box
          rounded="lg"
          className="p-5 flex flex-col border border-blue-800/40 shadow-2xl shadow-blue-900/30"
          justifyContent="flex-start"
        >
          <Box>
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
            <Flex justifyContent={"space-between"} mb={3}>
              <Flex>
                <Button borderRadius={"full"} bgColor="#2da042" mr={4}>
                  Open
                </Button>
                <Text
                  fontWeight={"semibold"}
                  fontSize="14"
                  color="#7d8590"
                  mt={2}
                >
                  #{task.id} opened 3 minutes ago by{" "}
                  <Text color="white" as="span">
                    DevGPT Web • Review required
                  </Text>
                </Text>
              </Flex>
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  bgColor="#2da042"
                >
                  Review Changes
                </MenuButton>
                <MenuList>
                  <MenuItem>Raise PR</MenuItem>
                  <MenuItem>Close Branch</MenuItem>
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

            <Heading size="md" color="gray.400" mb={3}>
              Add a comment
            </Heading>
            <Flex flexDirection="column">
              <Flex flexDirection="column" alignItems={"flex-end"}>
                <Textarea
                  // On focus, add a glow
                  _focus={{
                    boxShadow: "0 0 0 0.5rem rgba(0, 123, 255, .22)",
                    borderColor: "blue.500",
                  }}
                  // On hover, add a glow
                  _hover={{
                    boxShadow: "0 0 0 1.0rem rgba(0, 123, 255, .12)",
                    borderColor: "blue.500",
                  }}
                  bgColor="#0d1116"
                  className="fixed w-full max-w-md bottom-0 rounded shadow-xl p-2 dark:text-black"
                  value={"null"}
                  p={5}
                  placeholder="Add your comment here..."
                  onChange={(e: any) => {}}
                  onKeyDown={async (e: any) => {
                    if (loading) return;

                    // If key equals enter, submit
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                    }
                  }}
                />

                <Button
                  mt={2}
                  bg="#2da042"
                  isDisabled={loading}
                  color="white"
                  width="10rem"
                  onClick={async (e: any) => {}}
                >
                  Comment
                </Button>
              </Flex>
            </Flex>
          </Box>
        </Box>
      </Flex>
    </Template>
  );
};

export default Branch;
