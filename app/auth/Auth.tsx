"use client";
import { useState } from "react";
import { supabase } from "@/utils/supabase";
import { Header } from "./AuthHeader";
import signInWithGithub from "@/utils/github/signInWithGithub";
import signInWithBitbucket from "@/utils/bitbucket/signInWithBitbucket";
import signInWithGitlab from "@/utils/gitlab/signInWithGitlab";
import { useSessionContext } from "@/context/useSessionContext";
import {
  Box,
  Heading,
  Button,
  Stack,
  VStack,
  Link,
  Image,
  Text,
  Flex,
  Center,
  Tooltip,
} from "@chakra-ui/react";
import { BiSolidBookBookmark, BiSolidStar } from "react-icons/bi";
import { BsDiscord, BsFillJournalBookmarkFill, BsGithub } from "react-icons/bs";
import GitConnectorButton from "./GitConnectorButton";
import { AiFillGitlab } from "react-icons/ai";
import { FaBitbucket } from "react-icons/fa";
import { GrCircleInformation } from "react-icons/gr";
import WhatIsDevGPT from "./WhatIsDevGPT";
import getTokensFromString from "@/utils/getTokensFromString";
import AuthOption from "./AuthOption";

//assets
import astro from "@/images/astro.png";

const Auth = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { user, session } = useSessionContext();

  return (
    <Box
      className="w-full rounded-lg overflow-hidden p-5 flex flex-col border border-blue-800/40 shadow-2xl shadow-blue-900/30"
      maxW="500px" // Set maximum width for larger screens
      mx="auto"    // Center the box horizontally
    >
      <Header />
      <VStack spacing={2} mt={3} width="100%" alignItems="center">
        <GitConnectorButton
          color="black"
          provider="Sign In With Github"
          setLoading={setLoading}
          loading={loading}
          handle={signInWithGithub}
          Icon={BsGithub}
        />
        <GitConnectorButton
          color="#FC6D27"
          provider="Sign In With GitLab"
          setLoading={setLoading}
          loading={loading}
          handle={signInWithGitlab}
          Icon={AiFillGitlab}
          tooltip="Coming soon!"
        />
        <GitConnectorButton
          color="#0c61db"
          provider="Sign In With BitBucket"
          setLoading={setLoading}
          loading={loading}
          handle={signInWithBitbucket}
          Icon={FaBitbucket}
          tooltip="Coming soon!"
        />
        <Heading size="xs" mt="2">
          New here?
        </Heading>
        <WhatIsDevGPT />
        <AuthOption
          label="Read Our Docs"
          Icon={BiSolidBookBookmark}
          url="https://docs.devgpt.com"
        />
        <AuthOption
          label="Star Project On GitHub"
          Icon={BiSolidStar}
          url="https://github.com/february-labs/devgpt-releases"
        />
        <AuthOption
          label="Join Discord Community"
          Icon={BsDiscord}
          url="https://discord.com/invite/6GFtwzuvtw"
        />
        <Flex
          flex={1}
          alignItems="center"
          justifyContent="center"
          mt={5}
          w="full"
        >
          <Tooltip label="Hi, I'm Astro!">
            <Image maxH="80px" src={astro.src} />
          </Tooltip>
        </Flex>
      </VStack>
    </Box>
  );
};

export default Auth;
