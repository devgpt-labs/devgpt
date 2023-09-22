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
import getTokensFromString from "@/utils/getTokensFromString"
import AuthOption from "./AuthOption";

//assets
import astro from "@/images/astro.png";

const Auth = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useSessionContext();

  console.log(
    getTokensFromString(
      "hello this is my s tringnrgn adf !!!!!!!!!! o fiskoasfkoask "
    )
  );

  if (!supabase) return <Text>Loading...</Text>;

  return (
    <Box className="w-[500px] rounded-lg overflow-hidden text-slate-400 p-5 flex flex-col border border-blue-800/40 shadow-2xl shadow-blue-900/30">
      <Header />
      <VStack spacing={2} mt={3} width="100%" alignItems="flex-start">
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
          provider="Coming Soon"
          setLoading={setLoading}
          loading={loading}
          handle={signInWithGitlab}
          Icon={AiFillGitlab}
        />
        <GitConnectorButton
          color="#0c61db"
          provider="Coming Soon"
          setLoading={setLoading}
          loading={loading}
          handle={signInWithBitbucket}
          Icon={FaBitbucket}
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
