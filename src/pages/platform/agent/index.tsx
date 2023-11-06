"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  SkeletonText,
  Button,
  SlideFade,
  Kbd,
  Tag,
  Link,
  Skeleton,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Badge,
  Table,
  Thead,
  Tbody,
  useToast,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import RepoDrawer from "@/components/repos/RepoDrawer";
import Editor, { DiffEditor } from "@monaco-editor/react";
import { FaCodeBranch } from "react-icons/fa";
import { supabase } from "@/utils/supabase";

//stores
import repoStore from "@/store/Repos";
import authStore from "@/store/Auth";

//components
import Template from "@/components/Template";
import PromptAreaAndButton from "./PromptAreaAndButton";
import Feedback from "@/components/repos/Feedback";

//utils
import getTokenLimit from "@/utils/getTokenLimit";
import getPromptCount from "@/utils/getPromptCount";
import promptCorrection from "@/utils/promptCorrection";
import getModels from "@/utils/getModels";
import getTokensFromString from "@/utils/getTokensFromString";

// Icons
import { AiFillCreditCard } from "react-icons/ai";
import { EmailIcon } from "@chakra-ui/icons";
import { BiConfused } from "react-icons/bi";
import { MdScience } from "react-icons/md";
import { useColorMode } from "@chakra-ui/react";

const Chat = () => {
  // Constants
  const [promptCount, setPromptCount] = useState<number>(0);

  // Sending prompts
  const [loading, setLoading] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const toast = useToast();

  const [tasks, setTasks] = useState<any>([]);

  // Active state
  const router = useRouter();
  const { colorMode } = useColorMode();
  const {
    repo,
    lofaf,
    setLofaf,
    setRepo,
    repoWindowOpen,
    setRepoWindowOpen,
  }: any = repoStore();
  const {
    user,
    session,
    stripe_customer_id,
    signOut,
    status,
    credits,
    isPro,
  }: any = authStore();

  useEffect(() => {
    // Subscribe to output changes
    if (!supabase) return;
    const reponse = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "prompts" },
        (payload: any) => {
          // Merge the results
          const merged = [...tasks, payload?.new];

          // Filter the results (remove nulls)
          const filtered = merged.filter((task: any) => {
            return task.source !== null;
          });

          // Set state with the new tasks, reversed.
          setTasks(filtered.reverse());
        }
      )
      .subscribe();
  }, []);

  useEffect(() => {
    const getTasks = async () => {
      if (!supabase) return;

      const { data, error } = await supabase.from("prompts").select("*");

      console.log({ data, error });

      if (!error) {
        //filter tasks where output is null
        const filteredData = data.filter((task: any) => {
          return task.source !== null;
        });

        setTasks(filteredData?.reverse());
      }
    };

    getTasks();
  }, []);

  useEffect(() => {
    // Get the users last used repo
    const lastUsedRepo = Cookies.get("recentlyUsedRepoKey");
    if (lastUsedRepo) {
      const lastUsedRepoObject = JSON.parse(lastUsedRepo);
      setRepo(lastUsedRepoObject);
    }

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

  useEffect(() => {
    if (promptCount != 0) return;
    getPromptCount(user?.email, setPromptCount);
  }, [user?.email]);

  if (isPro === null || !user) {
    return (
      <Template>
        <Flex
          flexDirection="row"
          width="98%"
          height="70vh"
          gap={2}
          alignItems="center"
          justifyContent="center"
        >
          <Skeleton
            bg="gray.700"
            height="40px"
            width="85%"
            mb={4}
            borderRadius={10}
          />
          <Skeleton
            bg="gray.700"
            height="40px"
            width="15%"
            mb={4}
            borderRadius={10}
          />
        </Flex>
      </Template>
    );
  }

  if (isPro === false) {
    return (
      <Template>
        <Flex
          flexDirection="row"
          width="98%"
          height="70vh"
          gap={2}
          alignItems="center"
          justifyContent="center"
        >
          {isPro === false && (
            <Modal isOpen={true} onClose={() => { }} isCentered={true}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Start Your 7-day Free Trial</ModalHeader>
                <ModalBody>
                  <Text>
                    To use DevGPT, you need a plan that unlocks its full
                    potential. This allows you to train models and run prompts.
                  </Text>
                </ModalBody>

                <ModalFooter>
                  <Button
                    width="100%"
                    bgGradient="linear(to-r, blue.500, teal.500)"
                    color="white"
                    onClick={() => {
                      router.push("/platform/billing");
                    }}
                  >
                    <Text mr={2}>Billing</Text>
                    <AiFillCreditCard />
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          )}
          <Skeleton
            bg="gray.700"
            height="40px"
            width="85%"
            mb={4}
            borderRadius={10}
          />
          <Skeleton
            bg="gray.700"
            height="40px"
            width="15%"
            mb={4}
            borderRadius={10}
          />
        </Flex>
      </Template>
    );
  }

  return (
    <Template>
      <RepoDrawer />
      <Flex direction="column" flex={1} w="98%" maxW="full" p={4}>
        <Box
          rounded="lg"
          className="p-5 flex flex-col border border-blue-800/40 shadow-2xl shadow-blue-900/30"
          justifyContent="flex-start"
        >
          {!repo.repo && (
            <Box>
              <Button
                width="100%"
                bgGradient="linear(to-r, blue.500, teal.500)"
                color="white"
                mt={4}
                onClick={() => {
                  setRepoWindowOpen(!repoWindowOpen);
                }}
              >
                <MdScience />
                <Text ml={1}>Select a repo to get started</Text>
              </Button>
            </Box>
          )}
          {repo.repo && (
            <Box>
              {!isPro && (
                <Flex flexDirection="column" mt={4}>
                  <Text>
                    Before you continue prompting, we need to get your billing
                    in order!
                  </Text>
                  <Text mb={3} fontSize={14} color="gray.600">
                    You can continue using DevGPT and prompting with your
                    trained models immediately after this.
                  </Text>
                  <Flex flexDirection="row" gap={2}>
                    <Button
                      width="100%"
                      bgGradient={"linear(to-r, blue.500, teal.500)"}
                      color="white"
                      onClick={() => {
                        router.push("/platform/billing");
                      }}
                    >
                      <Text mr={2}>View Billing</Text>
                      <AiFillCreditCard />
                    </Button>
                    <Link href="mailto:support@devgpt.com">
                      <Button>
                        <Text mr={2}>Email Support</Text>
                        <EmailIcon />
                      </Button>
                    </Link>
                  </Flex>
                </Flex>
              )}

              <PromptAreaAndButton />

              <Flex>
                <Flex alignItems={"center"} ml={6}>
                  <FaCodeBranch size="15" />
                  <Heading size="sm" ml={1.5} fontWeight={"normal"}>
                    {tasks.length} Open
                  </Heading>
                </Flex>
                <Flex alignItems={"center"} ml={5}>
                  <FaCodeBranch size="15" />
                  <Heading size="sm" ml={1.5} fontWeight={"normal"}>
                    0 Closed
                  </Heading>
                </Flex>
              </Flex>

              <TableContainer borderRadius={"sm"} mt={5}>
                <Table variant="simple">
                  <TableCaption>
                    Tip: Help is always available on our Discord server.
                  </TableCaption>
                  <Thead>
                    <Tr>
                      <Th>Recent Tickets</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {tasks.length === 0 && (
                      <Tr>
                        <Td>
                          <Text>No tasks completed yet.</Text>
                        </Td>
                      </Tr>
                    )}
                    <Flex flexDirection="column" gap={2}>
                      {tasks.map((task: any) => {
                        return <Ticket task={task} />;
                      })}
                    </Flex>
                  </Tbody>
                  <Tfoot>
                    <Tr>
                      <Th>Page 1</Th>
                    </Tr>
                  </Tfoot>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Box>
      </Flex>
    </Template>
  );
};

const Ticket = ({ task }: any) => {
  const router = useRouter();
  const toast = useToast();

  return (
    <Tr
      // On hover, add a glow and raise the size of the ticekt slighlty
      _hover={{
        // boxShadow: "0 0 0 0.8rem rgba(0, 123, 255, .12)",
        // borderColor: "blue.500",
        transform: "scale(1.01)",
      }}
      // Animate the transform
      transition="transform 0.2s"
      // border="2px solid #e2e8f0"
      rounded="sm"
      cursor="pointer"
      onClick={() => {
        task.tag === "IN-PROGRESS"
          ? toast({
            title: "Ticket in progress",
            status: "info",
            duration: 5000,
            isClosable: true,
          })
          : router.push(`/platform/branch/${task.id}`);
      }}
    >
      <Td>
        <Flex alignItems={"center"}>
          <FaCodeBranch color="#3fba50" size="18" />
          <Heading size="md" ml={1.5}>
            {task.prompt || task.branchName}
          </Heading>
        </Flex>
        <Tag
          mt={2}
          size="md"
          variant="solid"
          colorScheme={task.tag === "IN-PROGRESS" ? "green" : "green"}
          borderRadius={"full"}
        >
          {task.tag}
        </Tag>
        <Text fontWeight={"semibold"} fontSize="14" color="#7d8590" mt={2}>
          #{task.id} opened 3 minutes ago via{" "}
          <Text as="span">{task.source} • Review required</Text>
        </Text>
      </Td>
    </Tr>
  );
};

export default Chat;
