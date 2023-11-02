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
  Tag,
  TagLabel,
} from "@chakra-ui/react";

// Utils
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabase";
import getPromptCount from "@/utils/getPromptCount";
import { MdScience } from "react-icons/md";
import { TbPrompt } from "react-icons/tb";
import createBranch from "@/utils/github/createBranch";
import { FiExternalLink } from "react-icons/fi";
// Components
import UpgradeModal from "./UpgradeModal";
import FooterButtons from "@/pages/platform/agent/FooterButtons";

// Icons
import { PiSignOutBold } from "react-icons/pi";
import {
  BiCopy,
  BiGitBranch,
  BiGitPullRequest,
  BiSolidBookBookmark,
} from "react-icons/bi";
import { AiFillCreditCard } from "react-icons/ai";
import { MoonIcon, SunIcon, StarIcon } from "@chakra-ui/icons";
import { FaBug } from "react-icons/fa";

// Stores
import repoStore from "@/store/Repos";
import authStore from "@/store/Auth";
import KeyModal from "./KeyModal";

interface ProfileOptionIconButtonProps {
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
const ProfileOptionIconButton = ({
  tooltip,
  comparison,
  onClick,
  ariaLabel,
  label,
  otherLabel,
  Icon,
  OtherIcon,
}: ProfileOptionIconButtonProps) => {
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

const Profile = () => {
  const [promptCount, setPromptCount] = useState<number>(0);
  const [credits, setCredits] = useState<number>(0);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const { user, isPro, signOut, session }: any = authStore();
  const { repoWindowOpen, setRepoWindowOpen }: any = repoStore();
  const { colorMode, toggleColorMode } = useColorMode();
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

  const fetchData = async () => {
    const credits: any = await getCredits(user?.email);

    if (credits !== null) {
      setCredits(credits);
    }
  };

  // Raise a bra

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
        mt={3}
        flexDirection="column"
        rounded="lg"
        borderTop={
          colorMode === "light" ? "1px solid #CBD5E0" : "1px solid #1a202c"
        }
        p={4}
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
          px={4}
        >
          <Flex flexDirection="row" alignItems="center">
            {identity?.avatar_url && (
              <Image
                _hover={{
                  boxShadow: "0px 0px 10px 0px gold",
                  transform: "translateY(-2px)",
                  transition: "all 0.2s ease-in-out",
                }}
                alt="Avatar"
                src={identity?.avatar_url}
                style={{
                  borderRadius: 10,
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
                  <Text onClick={onCreditsOpen}>{identity?.name}</Text>
                  <Text>{identity?.email}</Text>
                </Flex>
                <FooterButtons />
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
                </Tooltip>
                <Tooltip label={"Select A Repo"} placement="top">
                  <IconButton
                    _hover={{
                      transform: "translateY(-4px)",
                      transition: "all 0.2s ease-in-out",
                    }}
                    onClick={() => {
                      setRepoWindowOpen(!repoWindowOpen);
                    }}
                    aria-label="Select A Repo"
                    icon={<MdScience size={18} />}
                  />
                </Tooltip>



                <Tooltip label="Read The Docs" placement="top">
                  <Link isExternal href="https://docs.devgpt.com">
                    <IconButton
                      _hover={{
                        transform: "translateY(-4px)",
                        transition: "all 0.2s ease-in-out",
                      }}
                      aria-label="Read The Docs"
                      icon={<BiSolidBookBookmark />}
                    />
                  </Link>
                </Tooltip>
              </Flex>
              <Flex gap={2} ml={2}>
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

                <ProfileOptionIconButton
                  comparison={colorMode === "light"}
                  onClick={toggleColorMode}
                  ariaLabel="Turn the lights on"
                  label="Go Dark Mode"
                  otherLabel="Go Light Mode"
                  Icon={MoonIcon}
                  OtherIcon={SunIcon}
                />
                <Tooltip label="Report An Issue" placement="top">
                  <Link
                    isExternal
                    href="https://github.com/devgpt-labs/devgpt-releases/issues"
                  >
                    <IconButton
                      _hover={{
                        transform: "translateY(-4px)",
                        transition: "all 0.2s ease-in-out",
                      }}
                      aria-label="Report An Issue"
                      icon={<FaBug />}
                    />
                  </Link>
                </Tooltip>
                <Tooltip label="Signout" placement="top">
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
                </Tooltip>
              </Flex>
            </Flex>
          )}
        </Flex>
      </Flex>
    </>
  );
};

export default Profile;

// Now unused profile options
{
  /* <>
  <Tooltip label="Enter Open AI key" placement="top">
    <IconButton
      _hover={{
        transform: "translateY(-4px)",
        transition: "all 0.2s ease-in-out",
      }}
      onClick={onKeyOpen}
      aria-label="Enter Open AI key"
      icon={<BiKey size={18} />}
    />
  </Tooltip>
  <ProfileOptionIconButton
    tooltip={"Train Repo"}
    comparison={repoWindowOpen}
    onClick={() => {
      setRepoWindowOpen(!repoWindowOpen);
    }}
    ariaLabel="Train Repo"
    label="Close"
    otherLabel="Open"
    Icon={AiFillFolderOpen}
    OtherIcon={AiFillFolderOpen}
  />
  <Tooltip
    label={isSettingsOpen ? "Close Settings" : "Open Settings"}
    placement="top"
  >
    <IconButton
      _hover={{
        transform: "translateY(-4px)",
        transition: "all 0.2s ease-in-out",
      }}
      onClick={() => {
        onSettingsToggle();
        onModelsClose();
      }}
      aria-label="Open Settings"
      icon={<IoMdSettings size={18} />}
    />
  </Tooltip>
</>; */
}
