"use client";
import { useState } from "react";
import { supabase } from "@/utils/supabase";
import { Header } from "./AuthHeader";
import signInWithGithub from "@/utils/github/signInWithGithub";
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
import AuthOption from "./AuthOption";

//assets
import astro from "@/images/astro.png";

const Auth = () => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Box className="w-[400px] rounded-lg overflow-hidden text-slate-400 p-5 flex flex-col border border-blue-800/40 shadow-2xl shadow-blue-900/30">
      <Header />
      <VStack spacing={2} mt={3} width="100%" alignItems="flex-start">
        <Button
          justifyContent="space-between"
          width="100%"
          onClick={() => {
            signInWithGithub()
              .then(() => {
                setLoading(true);
              })
              .catch(() => {
                setLoading(false);
              });
          }}
        >
          {loading ? "Loading..." : "Sign In With GitHub"}
          <BsGithub />
        </Button>
        <Heading size="xs" mt="2">
          New here?
        </Heading>
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
