"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  IconButton,
  Image,
  Text,
  useColorMode,
  Tooltip,
  Link,
  useDisclosure,
} from "@chakra-ui/react";

// Utils
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabase";
import getPromptCount from "@/utils/getPromptCount";
import { TbPrompt } from "react-icons/tb";
// Components
import UpgradeModal from "./UpgradeModal";
const { getAccessToken } = require("git-connectors");

// Icons
import { AiFillCreditCard } from "react-icons/ai";
import { MoonIcon, SunIcon, StarIcon } from "@chakra-ui/icons";
import { FaBug } from "react-icons/fa";

// Stores
import repoStore from "@/store/Repos";
import authStore from "@/store/Auth";
import KeyModal from "./KeyModal";
import { BsEye, BsEyeSlashFill } from "react-icons/bs";

interface FooterOptionIconButtonProps {
  tooltip?: any;
  comparison?: any;
  onClick?: any;
  ariaLabel?: any;
  label?: any;
  otherLabel?: any;
  Icon?: any;
  OtherIcon?: any;
}

interface Identity {
  provider: "github" | "gitlab" | "bitbucket" | "mock";
  avatar_url?: string;
  name?: string;
  email?: string;
  bio?: string;
}

// TODO: Convert all of the buttons on this menu to use this component
const FooterOptionIconButton = ({
  tooltip,
  comparison,
  onClick,
  ariaLabel,
  label,
  otherLabel,
  Icon,
  OtherIcon,
}: FooterOptionIconButtonProps) => {
  return (
    <Tooltip
      label={tooltip ? tooltip : comparison ? label : otherLabel}
      placement="top"
    >
      <IconButton
        _hover={{
          transform: "translateY(-4px)",
          transition: "all 0.2s ease-in-out",
        }}
        onClick={onClick}
        aria-label={ariaLabel}
        icon={comparison ? <Icon /> : <OtherIcon />}
      />
    </Tooltip>
  );
};

const Footer = () => {
  const [promptCount, setPromptCount] = useState<number>(0);
  const [credits, setCredits] = useState<number>(0);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const { user, isPro, signOut, session }: any = authStore();
  const { repoWindowOpen, setRepoWindowOpen, repo }: any = repoStore();
  const { colorMode, toggleColorMode } = useColorMode();
  const [gitValid, setGitValid] = useState<any>(null);
  const router = useRouter();

  const {
    isOpen: isUpgradeOpen,
    onOpen: onUpgradeOpen,
    onClose: onUpgradeClose,
  } = useDisclosure({ defaultIsOpen: false });

  const {
    isOpen: isKeyOpen,
    onOpen: onKeyOpen,
    onClose: onKeyClose,
  } = useDisclosure({ defaultIsOpen: false });

  const {
    isOpen: isCreditsOpen,
    onOpen: onCreditsOpen,
    onClose: onCreditsClose,
  } = useDisclosure({ defaultIsOpen: false });

  const getCredits = async (emailAddress: string) => {
    if (!supabase) return;
    if (!emailAddress) return;

    const { data, error } = await supabase
      .from("customers")
      .select("credits")
      .eq("email_address", emailAddress);

    if (error) throw error;
    if (data) {
      setCredits(data?.[0]?.credits);
    }
  };

  const checkAccess = async () => {
    // Get the identity in user.identities that has 'provider' github, and then get the identity_data from it
    const identity = user?.identities?.find((identity: { provider: string }) =>
      ["github"].includes(identity?.provider)
    )?.identity_data;

    // Send a POST request to https://devgpt-api-production-f45a.up.railway.app/validation with the JSON of { repo: "x" }
    const response = await fetch(
      "https://devgpt-api-production-f45a.up.railway.app/validation",
      {
        method: "POST",
        body: JSON.stringify({ login: identity?.user_name, repo: repo?.repo }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    response.json().then((data) => {
      data.success ? setGitValid(true) : setGitValid(false);
    });
  };

  const fetchData = async () => {
    const credits: any = await getCredits(user?.email);

    if (credits !== null) {
      setCredits(credits);
    }
  };

  useEffect(() => {
    checkAccess();
  }, [repo]);

  useEffect(() => {
    fetchData();
  }, [isCreditsOpen]);

  useEffect(() => {
    const identity = user?.identities?.find((identity: { provider: string }) =>
      ["github", "gitlab", "bitbucket", "mock"].includes(identity?.provider)
    )?.identity_data;
    setIdentity(identity);
  }, [user]);

  useEffect(() => {
    if (promptCount != 0) return;
    getPromptCount(user?.email, setPromptCount);
  }, [user?.email, promptCount]);

  return (
    <>
      <Flex
        w="full"
        flexDirection="column"
        rounded="lg"
        borderTop={
          colorMode === "light" ? "1px solid #CBD5E0" : "1px solid #1a202c"
        }
        p={3}
      >
        {/* <CreditsModal
          isCreditsOpen={isCreditsOpen}
          onCreditsOpen={onCreditsOpen}
          onCreditsClose={onCreditsClose}
        /> */}
        <KeyModal
          isKeyOpen={isKeyOpen}
          onKeyOpen={onKeyOpen}
          onKeyClose={onKeyClose}
        />
        <UpgradeModal
          isUpgradeOpen={isUpgradeOpen}
          onUpgradeOpen={onUpgradeOpen}
          onUpgradeClose={onUpgradeClose}
        />
        <Flex
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Flex flexDirection="row" alignItems="center">
            {identity?.avatar_url && (
              <Image
                ml={2}
                _hover={{
                  boxShadow: "0px 0px 10px 0px gold",
                  transform: "translateY(-2px)",
                  transition: "all 0.2s ease-in-out",
                }}
                alt="Avatar"
                src={identity?.avatar_url}
                style={{
                  borderRadius: 100,
                  objectFit: "cover",
                }}
                maxHeight={40}
                width="40px"
                height="40px"
              />
            )}
            <Box ml={15} flexDirection="column">
              <Flex flexDirection={"row"} alignItems={"center"}>
                <Flex flexDirection="column" mr={3}>
                  <Text onClick={onCreditsOpen}>{identity?.full_name}</Text>
                </Flex>
              </Flex>
            </Box>
          </Flex>
          {user?.email && (
            <Flex flexDirection="row">
              <Flex gap={2}>
                {!isPro && (
                  <Tooltip label="Upgrade" placement="top">
                    <IconButton
                      _hover={{
                        transform: "translateY(-4px)",
                        transition: "all 0.2s ease-in-out",
                      }}
                      bgGradient="linear(to-tr, teal.500, blue.500)"
                      onClick={onUpgradeOpen}
                      aria-label="Upgrade"
                      icon={<StarIcon color="white" />}
                    />
                  </Tooltip>
                )}
                {/* 
                <Tooltip label={"Write Prompts"} placement="top">
                  <IconButton
                    _hover={{
                      transform: "translateY(-4px)",
                      transition: "all 0.2s ease-in-out",
                    }}
                    onClick={() => {
                      router.push("/platform/agent", undefined, {
                        shallow: true,
                      });
                    }}
                    aria-label="Write Prompts"
                    icon={<TbPrompt size={18} />}
                  />
                </Tooltip> */}
                {gitValid !== null && !gitValid && (
                  <Tooltip
                    label="Enable git access via GitHub for DevGPT"
                    placement="top"
                  >
                    <IconButton
                      colorScheme="orange"
                      onClick={() => {
                        window.open(
                          "https://github.com/apps/devgpt-labs",
                          "_blank"
                        );
                      }}
                      isDisabled={gitValid}
                      _hover={{
                        transform: "translateY(-4px)",
                        transition: "all 0.2s ease-in-out",
                      }}
                      aria-label="Access"
                      icon={
                        <Flex flexDirection="row" px={3}>
                          {gitValid ? <BsEye /> : <BsEyeSlashFill />}
                          <Text ml={2} fontSize={14}>
                            No connection to Git
                          </Text>
                        </Flex>
                      }
                    />
                  </Tooltip>
                )}

                <Tooltip label={"Select A Repo"} placement="top">
                  <IconButton
                    _hover={{
                      transform: "translateY(-4px)",
                      transition: "all 0.2s ease-in-out",
                    }}
                    onClick={() => {
                      router.push("/platform/agent", undefined, {
                        shallow: true,
                      });
                      setRepoWindowOpen(!repoWindowOpen);
                    }}
                    aria-label="Select A Repo"
                    icon={<TbPrompt size={18} />}
                  />
                </Tooltip>
              </Flex>
              <Flex gap={2} mx={2}>
                <Tooltip label={"View Billing"} placement="top">
                  <IconButton
                    _hover={{
                      transform: "translateY(-4px)",
                      transition: "all 0.2s ease-in-out",
                    }}
                    onClick={() => {
                      router.push("/platform/billing", undefined, {
                        shallow: true,
                      });
                    }}
                    aria-label="View Billing"
                    icon={<AiFillCreditCard size={18} />}
                  />
                </Tooltip>

                <FooterOptionIconButton
                  comparison={colorMode === "light"}
                  onClick={toggleColorMode}
                  ariaLabel="Turn the lights on"
                  label="Go Dark Mode"
                  otherLabel="Go Light Mode"
                  Icon={MoonIcon}
                  OtherIcon={SunIcon}
                />
                <Tooltip label="Report A Bug" placement="top">
                  <Link
                    isExternal
                    href="https://github.com/devgpt-labs/devgpt-releases/issues"
                  >
                    <IconButton
                      _hover={{
                        transform: "translateY(-4px)",
                        transition: "all 0.2s ease-in-out",
                      }}
                      aria-label="Report A Bug"
                      icon={<FaBug />}
                    />
                  </Link>
                </Tooltip>
                {/* <Tooltip label="Signout" placement="top">
                  <IconButton
                    _hover={{
                      transform: "translateY(-4px)",
                      transition: "all 0.2s ease-in-out",
                    }}
                    onClick={() => {
                      signOut();
                      router.push("/", undefined, { shallow: true });
                    }}
                    aria-label="Signout"
                    icon={<PiSignOutBold size={14} />}
                  />
                </Tooltip> */}
              </Flex>
            </Flex>
          )}
        </Flex>
      </Flex>
    </>
  );
};

export default Footer;
