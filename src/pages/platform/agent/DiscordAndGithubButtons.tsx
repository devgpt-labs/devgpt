"use client";
import { Flex, Text, Tooltip, IconButton, Link } from "@chakra-ui/react";

//stores

//prompts

//components

//utils

// Icons
import { BsDiscord, BsGithub, BsStars } from "react-icons/bs";

const DiscordAndGithubButtons = () => {
  return (
    <Flex mt={3} gap={2}>
      <Tooltip label="Join Discord" placement="top">
        <Link href="https://discord.com/invite/6GFtwzuvtw">
          <IconButton
            _hover={{
              transform: "translateY(-4px)",
              transition: "all 0.2s ease-in-out",
            }}
            aria-label="Join Discord"
            icon={
              <Flex flexDirection="row" px={3}>
                <BsDiscord />
                <Text ml={2} fontSize={14}>
                  {/* {activeOnDiscord && `Online: ${activeOnDiscord}`} */}
                  Join
                </Text>
              </Flex>
            }
          />
        </Link>
      </Tooltip>
      <Tooltip label="Github Stars" placement="top">
        <Link href="https://github.com/devgpt-labs/devgpt-releases">
          <IconButton
            _hover={{
              transform: "translateY(-4px)",
              transition: "all 0.2s ease-in-out",
            }}
            aria-label="Github Stars"
            icon={
              <Flex flexDirection="row" px={3}>
                <BsGithub />
                <BsStars />
                <Text ml={2} fontSize={14}>
                  360
                </Text>
              </Flex>
            }
          />
        </Link>
      </Tooltip>
    </Flex>
  );
};

export default DiscordAndGithubButtons;
