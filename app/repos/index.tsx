"use client";
import { useState } from "react";
import { Tag } from "@chakra-ui/react";
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
  useDisclosure,
  Tooltip,
  Link,
} from "@chakra-ui/react";
import { AiFillFolderOpen } from "react-icons/ai";
import { BsDiscord, BsFillMoonStarsFill } from "react-icons/bs";
import { IoMdSettings } from "react-icons/io";
import { BiSolidBookBookmark } from "react-icons/bi";

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
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, methods, repoWindowOpen, isPro } = useSessionContext();
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: false });

  if (!user) return null;
  if (!user?.identities) return null;

  // TODO: move to session context
  // get the user.identity that has provide github
  const githubIdentity: any = user?.identities?.find(
    (identity) => identity?.provider === "github"
  )?.identity_data;

  return (
    <Flex
      mt={3}
      mb={10}
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
          <SlideFade in={isOpen}>
            {isOpen && (
              <Flex gap={2}>
                <Tooltip label="Join Discord" placement="top">
                  <Link isExternal href="https://discord.com/invite/6GFtwzuvtw">
                    <IconButton aria-label="Join Discord" icon={<BsDiscord />} />
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
                <Tooltip label="Signout" placement="top">
                  <IconButton
                    onClick={() => supabase?.auth.signOut()}
                    aria-label="Signout"
                    icon={<BsFillMoonStarsFill size={14} />}
                  />
                </Tooltip>
              </Flex>
            )}

          </SlideFade>
          {!isPro && (
            <Tooltip label="Upgrade" placement="top">
              <Link
                href={`https://buy.stripe.com/5kA7sB7AMe9xaZ2aFP?client_reference_id=${user?.id}`}
              >
                <IconButton
                  bgGradient="linear(to-tr, teal.500, blue.500)"
                  _hover={{ color: "teal.500", bg: "white" }}
                  aria-label="Upgrade"
                  icon={<StarIcon />}
                />
              </Link>
            </Tooltip>
          )}
          <Tooltip
            label='New Task'
            placement="top"
          >
            <IconButton
              onClick={() => methods.setMessages([])}
              aria-label="New Task"
              icon={<PlusSquareIcon />}
            />
          </Tooltip>
          <Tooltip label="Select Repo" placement="top">
            <IconButton
              onClick={() => {
                methods.setRepoWindowOpen(!repoWindowOpen);
              }}
              aria-label="Open Repo Drawer"
              icon={<AiFillFolderOpen size={18} />}
            />
          </Tooltip>
          <Tooltip
            label={isOpen ? "Close Settings" : "Open Settings"}
            placement="top"
          >
            <IconButton
              onClick={onToggle}
              aria-label="Open Settings"
              icon={<IoMdSettings size={18} />}
            />
          </Tooltip>
        </Flex>
      </Flex>
      <SlideFade in={isOpen}>{isOpen && <Repos />}</SlideFade>
    </Flex>
  );
};

export default Profile;

{
  /* <Tooltip label="Dark Mode" placement="top">
  <IconButton
  onClick={toggleColorMode}
  aria-label="Turn Off The Lights"
  icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
  />
</Tooltip> */
}
