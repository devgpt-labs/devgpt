"use client";
import { useState, useEffect } from "react";
import signInWithGithub from "@/utils/github/signInWithGithub";
import AuthHeader from "./AuthHeader";
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
import { useRouter } from "next/router";

//components
import Template from "@/components/Template";
import WhatIsDevGPT from "./WhatIsDevGPT";
import AuthOption from "./AuthOption";

//store
import useStore from "@/store/Auth";

//assets
import astro from "@/assets/astro.png";

import signInWithBitbucket from "@/utils/bitbucket/signInWithBitbucket";
import trainModels from "@/utils/trainModels";

const Auth = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { fetch, user, session, stripe_customer_id }: any = useStore();

  useEffect(() => {
    fetch();

    trainModels(
      session,
      user,
      stripe_customer_id
    )
  }, []);

  useEffect(() => {
    if (user) {
      console.log("pushing to /platform/agent");
      setLoading(true);
      // set user to loading
      router.push("/platform/agent", undefined, { shallow: true });
    }
  }, [user]);

  if (loading)
    return (
      <Flex
        alignItems="center"
        justifyContent="center"
        mt={5}
        h="100vh"
        w="100vw"
      >
        <Spinner size="lg" />
      </Flex>
    );

  return (
    <>
      <Template>
        <Box
          w="40%"
          rounded="lg"
          overflow="hidden"
          p={5}
          flexDirection="column"
          // TODO: shadow needs readding / fixing here
          boxShadow="blues"
          border="1px solid #1a202c"
          shadow="2xl"
        >
          <AuthHeader />
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
              handle={signInWithBitbucket}
              Icon={FaBitbucket}
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
      </Template>
    </>
  );
};

export default Auth;
