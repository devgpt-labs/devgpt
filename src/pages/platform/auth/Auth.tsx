import { useState, useEffect } from "react";
import { Header } from "./AuthHeader";
import signInWithGithub from "@/utils/github/signInWithGithub";
// import signInWithBitbucket from "@/utils/bitbucket/signInWithBitbucket";
// import signInWithGitlab from "@/utils/gitlab/signInWithGitlab";
import {
  Box,
  Heading,
  VStack,
  Image,
  Flex,
  Tooltip,
  Spinner,
} from "@chakra-ui/react";
import { BiSolidBookBookmark, BiSolidStar } from "react-icons/bi";
import { BsDiscord, BsGithub } from "react-icons/bs";
import GitConnectorButton from "./GitConnectorButton";
import { AiFillGitlab } from "react-icons/ai";
import { FaBitbucket } from "react-icons/fa";
import WhatIsDevGPT from "./WhatIsDevGPT";
import AuthOption from "./AuthOption";

//store
import useStore from "@/store/Auth";

//assets
import astro from "@/assets/astro.png";

//components
import Chat from "@/pages/platform/chat/Chat";
import RepoDrawer from "@/components/repos/RepoDrawer";

const Auth = () => {
  const { fetch, user, session }: any = useStore();

  useEffect(() => {
    fetch();
  }, []);

  return (
    <>
      {!user ? (
        <>
          <Box
            w='full'
            rounded='lg'
            overflow='hidden'
            p={5}
            flexDirection='column'
            // TODO: shadow needs readding / fixing here
            boxShadow='blues'
            border="1px solid #1a202c"
            shadow="2xl"
          >
            <Header />
            <VStack spacing={2} mt={3} width="100%" alignItems="center">
              <GitConnectorButton
                color="black"
                provider="Sign In With Github"
                handle={signInWithGithub}
                Icon={BsGithub}
              />
              <GitConnectorButton
                color="#0c61db"
                provider="Sign In With BitBucket"
                handle={() => { }}
                Icon={FaBitbucket}
                tooltip="Coming soon!"
              />
              <GitConnectorButton
                color="#FC6D27"
                provider="Sign In With GitLab"
                handle={() => { }}
                Icon={AiFillGitlab}
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
                url="https://github.com/devgpt-labs/devgpt-releases/"
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
                  <Image maxH="80px" src={astro.src} alt="Astro Logo" />
                </Tooltip>
              </Flex>
            </VStack>
          </Box>
        </>
      ) : (
        <>
          <RepoDrawer />
          <Chat />
        </>
      )}
    </>
  );
};

export default Auth;
