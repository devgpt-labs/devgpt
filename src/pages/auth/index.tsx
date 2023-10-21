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
  Text,
} from "@chakra-ui/react";

import { useRouter } from "next/router";

//icons
import { AiFillGitlab } from "react-icons/ai";
import { FaBitbucket } from "react-icons/fa";
import { BiSolidBookBookmark, BiSolidStar } from "react-icons/bi";
import { BsDiscord, BsGithub } from "react-icons/bs";

//components
import GitConnectorButton from "./GitConnectorButton";
import Template from "@/components/Template";
import WhatIsDevGPT from "./WhatIsDevGPT";
import AuthOption from "./AuthOption";
import signInWithBitbucket from "@/utils/bitbucket/signInWithBitbucket";

//store
import useStore from "@/store/Auth";

//assets
import astro from "@/assets/astro.png";

const Auth = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { fetch, user, session, stripe_customer_id }: any = useStore();

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    if (user) {
      setLoading(true);
      // set user to loading
      router.push("/platform/agent", undefined, { shallow: true });
    }
  }, [user]);

  if (loading)
    return (
      <Template>
        <Flex height="100%" alignItems="center" justifyContent="center" mt={5}>
          <Spinner height={5} width={5} />
          <Text ml={3}>Just getting started...</Text>
        </Flex>
      </Template>
    );

  return (
    <>
      <Template>
        <Flex
          justifyContent="center"
          alignItems="center"
          width="30%"
          height="100%"
          rounded="lg"
          overflow="hidden"
          flexDirection="column"
        >
          <VStack spacing={2} width="100%" alignItems="center">
            <GitConnectorButton
              color="black"
              provider="Sign In With Github"
              handle={signInWithGithub}
              Icon={<BsGithub />}
              tooltip=""
            />
            <GitConnectorButton
              color="#0c61db"
              provider="Sign In With BitBucket"
              handle={signInWithBitbucket}
              Icon={<FaBitbucket />}
              tooltip="Coming soon!"
            />
            <GitConnectorButton
              color="#FC6D27"
              provider="Sign In With GitLab"
              handle={() => {}}
              Icon={<AiFillGitlab />}
              tooltip="Coming soon!"
            />
            <Heading size="xs" mt="2">
              Just getting started?
            </Heading>
            <WhatIsDevGPT />
            <AuthOption
              label="Read Our Docs"
              Icon={<BiSolidBookBookmark />}
              url="https://docs.devgpt.com"
            />
            <AuthOption
              label="Star Project On GitHub"
              Icon={<BiSolidStar />}
              url="https://github.com/devgpt-labs/devgpt-releases/"
            />
            <AuthOption
              label="Join Discord Community"
              Icon={<BsDiscord />}
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
        </Flex>
      </Template>
    </>
  );
};

export default Auth;
