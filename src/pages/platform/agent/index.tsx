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

  const handleSubmit = async (prompt: string) => {
    const response = await fetch(
      "https://devgpt-api-production-f45a.up.railway.app/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: prompt,
          repo: "toms-private-sand-pit",
          owner: "tom-lewis-code",
        }),
      }
    )
      .then((res) => res.json())
      .catch((err) => console.log(err));
  };

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
          <Modal isOpen={true} onClose={() => {}} isCentered={true}>
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

  if (!user) {
    return (
      <Template>
        <Flex
          flexDirection="row"
          width="80%"
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

  return (
    <Template>
      <RepoDrawer />
      <Flex direction="column" flex={1} w="98%" maxW="full" p={5}>
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

              <PromptAreaAndButton
                prompt={prompt}
                loading={loading}
                setLoading={setLoading}
                setPrompt={setPrompt}
                handleSubmit={(prompt: any) => handleSubmit(prompt)}
              />

              <TableContainer bgColor={"#2c313a"} borderRadius={"sm"} mt={5}>
                <Table variant="simple">
                  <TableCaption>
                    Pro tip! Help is always available on our Discord server.
                  </TableCaption>
                  <Thead>
                    <Tr>
                      <Th>Recent Tickets</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Ticket />
                  </Tbody>
                  <Tfoot>
                    <Tr>
                      <Th>To convert</Th>
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

const Ticket = () => {
  const router = useRouter();

  return (
    <Tr
      _hover={{
        bgColor: "gray.700",
      }}
      cursor="pointer"
      onClick={() => {
        router.push("/platform/branch");
      }}
    >
      <Td>
        <Flex alignItems={"center"}>
          <FaCodeBranch />
          <Heading size="md" ml={1}>
            Docs: fix grammatical issue in "Data Fetching Patterns" section
          </Heading>
        </Flex>
        <Tag
          mt={2}
          size="md"
          variant="solid"
          colorScheme="green"
          borderRadius={"full"}
        >
          area: documentation
        </Tag>
        <Text fontWeight={"semibold"} fontSize="14" color="#7d8590" mt={2}>
          #57937 opened 3 minutes ago by{" "}
          <Text color="white" as="span">
            DevGPT Web • Review required
          </Text>
        </Text>
      </Td>
    </Tr>
  );
};

export default Chat;
