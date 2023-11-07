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
import { BsDiscord, BsGithub, BsStars } from "react-icons/bs";

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
import getModels from "@/utils/getModels";
import { RiStarSFill } from "react-icons/ri";

const Auth = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState<any[]>([]);

  const { fetch, user, session }: any = useStore();

  useEffect(() => {
    handleLogin();
  }, [user]);

  useEffect(() => {
    if (loading || user || session || router.asPath.includes("access_token")) {
      setLoading(true);
    }
  }, [loading, user, session, router.asPath]);

  useEffect(() => {
    fetch();
  }, []);

  const handleLogin = async () => {
    if (user) {
      await getModels(setModels, () => { }, user?.email);

      if (models.length > 0) {
        // Navigate user to the prompting page
        router.push("/platform/agent", undefined, { shallow: true });
      } else {
        // If the user has no models, navigate them to the add a model page
        router.push("/platform/agent", undefined, { shallow: true });
      }
    } else {
      setLoading(false);
    }
  };

  // If the user is on mobile, show them a message saying that this is a desktop app
  // if (typeof window !== "undefined" && window.innerWidth < 768) {
  //   return (
  //     <Template>
  //       <Flex height="70vh" alignItems="center" justifyContent="center" mt={5}>
  //         <Text ml={3}>Sorry, DevGPT is not available on mobile devices.</Text>
  //       </Flex>
  //     </Template>
  //   );
  // } else {
  //   console.log("Not mobile");
  // }

  if (loading) {
    return (
      <Template>
        <Flex height="70vh" alignItems="center" justifyContent="center" mt={5}>
          <Spinner height={5} width={5} />
          <Text ml={3}>Waiting for GitHub...</Text>
        </Flex>
      </Template>
    );
  }

  return (
    <Template>
      <Flex
        justifyContent="center"
        alignItems="center"
        width="30%"
        height="80vh"
        rounded="lg"
        overflow="hidden"
        flexDirection="column"
      >
        <VStack spacing={2} width="100%" alignItems="center">
          <GitConnectorButton
            color="black"
            provider="Sign In With GitHub"
            handle={() => {
              setLoading(true);
              signInWithGithub();
            }}
            Icon={<BsGithub />}
            tooltip=""
          />
          {/* <GitConnectorButton
            color="#0c61db"
            provider="Sign In With BitBucket"
            handle={() => { }}
            Icon={<FaBitbucket />}
            tooltip="Coming soon!"
          />
          <GitConnectorButton
            color="#FC6D27"
            provider="Sign In With GitLab"
            handle={() => { }}
            Icon={<AiFillGitlab />}
            tooltip="Coming soon!"
          /> */}
          <Heading size="xs" my={2}>
            Just getting started?
          </Heading>
          {/* <WhatIsDevGPT /> */}
          {/* <AuthOption
            label="Read Our Docs"
            Icon={<BiSolidBookBookmark />}
            url="https://docs.devgpt.com"
          /> */}
          <AuthOption
            label="Authenticate With Github"
            Icon={<BsGithub />}
            url="https://github.com/apps/devgpt-labs"
          />
          <AuthOption
            label="Star Project On GitHub"
            Icon={<BsStars />}
            url="https://github.com/devgpt-labs/devgpt-releases/"
          />
          <AuthOption
            label="Join Our Discord Community"
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
  );
};

export default Auth;
