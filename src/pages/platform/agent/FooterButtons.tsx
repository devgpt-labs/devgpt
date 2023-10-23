"use client";
import { StarIcon } from "@chakra-ui/icons";
import { Flex, Text, Tooltip, IconButton, Link } from "@chakra-ui/react";

// Icons
import { BsDiscord, BsGithub, BsStars } from "react-icons/bs";
import authStore from "@/store/Auth";

// TODO: The discord icon would ideally show people online in discord
// TODO: The github icon would ideally show the number of stars on the repo

const FooterButtons = () => {
  const { isPro }: any = authStore();

  return (
    <Flex gap={2}>
      {isPro && (
        <Tooltip label="Thank you!" placement="top">
          <Link href="https://discord.com/invite/6GFtwzuvtw">
            <IconButton
              _hover={{
                transform: "translateY(-4px)",
                transition: "all 0.2s ease-in-out",
              }}
              aria-label="Thank you!"
              icon={
                <Flex flexDirection="row" px={3}>
                  <StarIcon />
                  <Text ml={2} fontSize={14}>
                    {/* {activeOnDiscord && `Online: ${activeOnDiscord}`} */}
                    Pro Plan
                  </Text>
                </Flex>
              }
            />
          </Link>
        </Tooltip>
      )}

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
                  365
                </Text>
              </Flex>
            }
          />
        </Link>
      </Tooltip>
    </Flex>
  );
};

export default FooterButtons;
