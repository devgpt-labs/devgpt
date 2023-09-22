"use client";
import { useState, useEffect } from "react";
import { Modal, ModalContent, Tag } from "@chakra-ui/react";
import { supabase } from "@/utils/supabase";
import { useSessionContext } from "@/context/useSessionContext";
import Repos from "./Settings";
import {
  Box,
  Flex,
  IconButton,
  Image,
  Text,
  useColorMode,
  Button,
  SlideFade,
  Tooltip,
  Link,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Heading,
  Stack,
  Card,
  CardBody,
  CardFooter,
  useColorModeValue,
  TableProps,
} from "@chakra-ui/react";
import { AiFillFolderOpen } from "react-icons/ai";
import { BsDiscord, BsFillMoonStarsFill } from "react-icons/bs";
import { IoMdSettings } from "react-icons/io";
import { BiSolidBookBookmark } from "react-icons/bi";
import {
  GiBattery100,
  GiBattery75,
  GiBattery50,
  GiBattery25,
  GiBattery0,
} from "react-icons/gi";

import {
  ArrowDownIcon,
  ArrowUpIcon,
  MoonIcon,
  SunIcon,
  StarIcon,
  PlusSquareIcon,
} from "@chakra-ui/icons";
import { FaBug } from "react-icons/fa";

const Profile = () => {
  const [promptCount, setPromptCount] = useState<number>(0);
  const { user, methods, repoWindowOpen, isPro, repo } = useSessionContext();
  const { colorMode, toggleColorMode } = useColorMode();
  const {
    isOpen: isSettingsOpen,
    onOpen: onSettingsOpen,
    onClose: onSettingsClose,
    onToggle: onSettingsToggle,
  } = useDisclosure({ defaultIsOpen: false });

  const {
    isOpen: isUpgradeOpen,
    onOpen: onUpgradeOpen,
    onClose: onUpgradeClose,
  } = useDisclosure({ defaultIsOpen: false });

  const githubIdentity: any = user?.identities?.find(
    (identity) => identity?.provider === "github"
  )?.identity_data;

  // Get the number of prompts this user has ran today from supabase 'prompts' table
  const getPromptCount = async () => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("prompts")
      .select("id")
      .eq("user_id", user?.id)
      .gte("created_at", new Date().toISOString().slice(0, 10));
    if (error) throw error;

    setPromptCount(data?.length);
  };

  useEffect(() => {
    getPromptCount();
  }, []);

  if (!user) return null;
  if (!user?.identities) return null;

  return (
    <Flex
      mt={3}
      flexDirection="column"
      w="4xl"
      maxW="full"
      rounded="lg"
      className="overflow-hidden text-slate-400 p-5 flex flex-col border border-blue-800/40 shadow-2xl shadow-blue-900/30"
    >
      <Flex flexDirection="row" justifyContent="space-between">
        <Flex flexDirection="row" alignItems="center">
          {githubIdentity.avatar_url && (
            <Tooltip label="via Github">
              <Image
                alt="Avatar"
                src={githubIdentity.avatar_url}
                style={{
                  borderRadius: 10,

                  objectFit: "cover",
                }}
                maxHeight={40}
                width="40px"
                height="40px"
              />
            </Tooltip>
          )}
          <Box ml={15} flexDirection="column">
            <Flex flexDirection="row" alignItems="center">
              <Text color="white">{githubIdentity.name}</Text>
              {isPro && (
                <Tag ml={2} colorScheme="teal">
                  Pro
                </Tag>
              )}
            </Flex>
            <Text color="white">{githubIdentity.email}</Text>
          </Box>
        </Flex>
        <Flex alignItems="center" justifyContent="flex-end" gap={2}>
          <SlideFade in={isSettingsOpen}>
            {isSettingsOpen && (
              <Flex gap={2}>
                <Tooltip label="Join Discord" placement="top">
                  <Link isExternal href="https://discord.com/invite/6GFtwzuvtw">
                    <IconButton
                      aria-label="Join Discord"
                      icon={<BsDiscord />}
                    />
                  </Link>
                </Tooltip>
                <Tooltip label="Report An Issue" placement="top">
                  <Link
                    isExternal
                    href="https://github.com/february-labs/devgpt-releases/issues"
                  >
                    <IconButton aria-label="Report An Issue" icon={<FaBug />} />
                  </Link>
                </Tooltip>
                <Tooltip label="Read The Docs" placement="top">
                  <Link isExternal href="https://docs.devgpt.com">
                    <IconButton
                      aria-label="Read The Docs"
                      icon={<BiSolidBookBookmark />}
                    />
                  </Link>
                </Tooltip>
              </Flex>
            )}
          </SlideFade>

          <Modal isOpen={isUpgradeOpen} onClose={onUpgradeClose} size="2xl">
            <ModalOverlay />
            <ModalContent>
              <Card p="10">
                <ModalCloseButton />
                <CardBody textAlign={"center"}>
                  <Stack>
                    <Heading size="lg" mb={2}>
                      Pro Plan: Early Bird
                    </Heading>
                    <Text mb={6} fontSize={16}>
                      This is our early bird price, it will be available for a
                      limited time only. This will also include these benefits
                      in our desktop app.
                    </Text>
                  </Stack>
                  <TableContainer>
                    <Table size="md">
                      <Thead fontWeight={"bold"}>
                        <Tr>
                          <Th>Feature</Th>
                          <Th>Free</Th>
                          <Th>Pro</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td>Daily Prompts </Td>
                          <Td>10</Td>
                          <Td>150</Td>
                        </Tr>
                        <Tr>
                          <Td>Model </Td>
                          <Td>GPT-4-8K</Td>
                          <Td>GPT-4-32K</Td>
                        </Tr>
                        <Tr>
                          <Td>Discord Support</Td>
                          <Td>✓</Td>
                          <Td>✓</Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </TableContainer>
                </CardBody>
                <CardFooter>
                  <Flex
                    justifyContent="center"
                    alignItems={"center"}
                    flex={1}
                    flexDirection={"column"}
                  >
                    <Link
                      href={`https://buy.stripe.com/5kA7sB7AMe9xaZ2aFP?client_reference_id=${user?.id}`}
                    >
                      <Button
                        size="lg"
                        bgGradient={"linear(to-r, blue.500, teal.500)"}
                        _hover={{
                          bgGradient: "linear(to-r, blue.400, teal.400)",
                        }}
                        mb={2}
                      >
                        <Text as="s" mr={2} fontSize={15}>
                          {" "}
                          $25.99
                        </Text>{" "}
                        $15.99 /month
                      </Button>
                    </Link>

                    <Text pt={5} textAlign={"center"}>
                      Cancel anytime. Billing provided by Stripe.
                    </Text>
                  </Flex>
                </CardFooter>
              </Card>
            </ModalContent>
          </Modal>
          {!isPro && (
            <>
              <Tooltip label="10/10 Prompts Remaining Today" placement="top">
                <IconButton
                  aria-label="Upgrade"
                  icon={
                    promptCount === 10 ? (
                      <GiBattery0 />
                    ) : promptCount > 5 ? (
                      <GiBattery50 />
                    ) : (
                      <GiBattery100 />
                    )
                  }
                />
              </Tooltip>
              <Tooltip label="Upgrade" placement="top">
                <IconButton
                  bgGradient="linear(to-tr, teal.500, blue.500)"
                  onClick={() => {
                    onUpgradeOpen();
                  }}
                  _hover={{ color: "blue.500", bg: "white" }}
                  aria-label="Upgrade"
                  icon={<StarIcon />}
                />
              </Tooltip>
            </>
          )}
          <Tooltip label="Select Repo" placement="top">
            <IconButton
              onClick={() => {
                methods.setRepoWindowOpen(!repoWindowOpen);
              }}
              aria-label="Open Repo Drawer"
              icon={<AiFillFolderOpen size={18} />}
            />
          </Tooltip>
          <Tooltip label="Signout" placement="top">
            <IconButton
              onClick={() => supabase?.auth.signOut()}
              aria-label="Signout"
              icon={<BsFillMoonStarsFill size={14} />}
            />
          </Tooltip>
          {repo.repo && (
            <Tooltip
              label={isSettingsOpen ? "Close Settings" : "Open Settings"}
              placement="top"
            >
              <IconButton
                onClick={onSettingsToggle}
                aria-label="Open Settings"
                icon={<IoMdSettings size={18} />}
              />
            </Tooltip>
          )}
          {/* <Tooltip
            label={colorMode === 'light' ? "Dark" : "Light"}
            placement="top"
          >
            <IconButton
              onClick={toggleColorMode}
              aria-label="Turn the lights on"
              icon={<IoMdSettings size={18} />}
            />
          </Tooltip> */}
        </Flex>
      </Flex>
      <SlideFade in={isSettingsOpen}>{isSettingsOpen && <Repos />}</SlideFade>
    </Flex>
  );
};

export default Profile;
