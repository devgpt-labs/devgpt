"use client";
import { useState, useEffect } from "react";
import { Modal, ModalContent, Tag } from "@chakra-ui/react";
import { supabase } from "@/utils/supabase";
import { useSessionContext } from "@/context/useSessionContext";
import Repos from "./Settings";
import {
  Box,
  Flex,
  IconButton,
  Image,
  Text,
  useColorMode,
  Button,
  SlideFade,
  Tooltip,
  Link,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Heading,
  Stack,
  Card,
  CardBody,
  CardFooter,
  useColorModeValue,
  TableProps,
} from "@chakra-ui/react";
import UpgradeModal from "./UpgradeModal";
import { AiFillFolderOpen } from "react-icons/ai";
import { BsDiscord, BsFillMoonStarsFill } from "react-icons/bs";
import { IoMdSettings } from "react-icons/io";
import { PiSignOutBold } from "react-icons/pi";
import { AiFillStar } from "react-icons/ai";
import getPromptCount from "@/utils/getPromptCount";
import { BiSolidBookBookmark } from "react-icons/bi";
import {
  GiBattery100,
  GiBattery75,
  GiBattery50,
  GiBattery25,
  GiBattery0,
} from "react-icons/gi";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  MoonIcon,
  SunIcon,
  StarIcon,
  PlusSquareIcon,
} from "@chakra-ui/icons";
import { FaBug } from "react-icons/fa";

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
    <Tooltip label={tooltip ? tooltip : comparison ? label : otherLabel} placement="top">
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
  const { user, methods, repoWindowOpen, isPro, repo } = useSessionContext();
  const { colorMode, toggleColorMode } = useColorMode();
  const {
    isOpen: isSettingsOpen,
    onOpen: onSettingsOpen,
    onClose: onSettingsClose,
    onToggle: onSettingsToggle,
  } = useDisclosure({ defaultIsOpen: false });

  const {
    isOpen: isUpgradeOpen,
    onOpen: onUpgradeOpen,
    onClose: onUpgradeClose,
  } = useDisclosure({ defaultIsOpen: false });

  const githubIdentity: any = user?.identities?.find(
    (identity) => identity?.provider === "github"
  )?.identity_data;

  useEffect(() => {
    getPromptCount(user, setPromptCount);
  }, []);

  if (!user) return null;
  if (!user?.identities) return null;

  return (
    <Flex
      mt={3}
      flexDirection="column"
      w="4xl"
      maxW="full"
      rounded="lg"
      className="overflow-hidden p-5 flex flex-col border border-blue-800/40 shadow-2xl shadow-blue-900/30"
    >
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
        <Flex flexDirection="row">
          {githubIdentity.avatar_url && (
            <Tooltip label="Looking golden! via Github">
              <Image
                _hover={{
                  boxShadow: "0px 0px 10px 0px gold",
                  transform: "translateY(-4px)",
                  transition: "all 0.2s ease-in-out",
                }}
                alt="Avatar"
                src={githubIdentity.avatar_url}
                style={{
                  borderRadius: 10,
                  objectFit: "cover",
                }}
                maxHeight={40}
                width="40px"
                height="40px"
              />
            </Tooltip>
          )}
          <Box ml={15} flexDirection="column">
            <Flex flexDirection="row" alignItems="center">
              <Text>{githubIdentity.name}</Text>
              {isPro ? (
                <Tag ml={2} colorScheme="teal">
                  <Text mr={1}>Pro</Text>
                  <AiFillStar />
                </Tag>
              ) : (
                <Tag ml={2} colorScheme="teal">
                  Free
                </Tag>
              )}
            </Flex>
            <Text>{githubIdentity.email}</Text>
          </Box>
        </Flex>
        <Flex flexDirection="row">
          <SlideFade in={isSettingsOpen}>
            {isSettingsOpen && (
              <Flex gap={2}>
                {!isPro && (
                  <>
                    <Tooltip
                      label={`${10 - promptCount
                        }/10 Free Prompts Remaining Today`}
                      placement="top"
                    >
                      <IconButton
                        _hover={{
                          transform: "translateY(-4px)",
                          transition: "all 0.2s ease-in-out",
                        }}
                        onClick={onUpgradeOpen}
                        aria-label="Upgrade"
                        icon={
                          promptCount === 10 ? (
                            <GiBattery0 />
                          ) : promptCount > 4 ? (
                            <GiBattery50 />
                          ) : promptCount > 0 ? (
                            <GiBattery75 />
                          ) : (
                            <GiBattery100 />
                          )
                        }
                      />
                    </Tooltip>
                  </>
                )}
                <ProfileOptionIconButton
                  comparison={colorMode === "light"}
                  onClick={toggleColorMode}
                  ariaLabel="Turn the lights on"
                  label="Dark"
                  otherLabel="Light"
                  Icon={MoonIcon}
                  OtherIcon={SunIcon}
                />
                <Tooltip label="Join Discord" placement="top">
                  <Link isExternal href="https://discord.com/invite/6GFtwzuvtw">
                    <IconButton
                      _hover={{
                        transform: "translateY(-4px)",
                        transition: "all 0.2s ease-in-out",
                      }}
                      aria-label="Join Discord"
                      icon={<BsDiscord />}
                    />
                  </Link>
                </Tooltip>
                <Tooltip label="Report An Issue" placement="top">
                  <Link
                    isExternal
                    href="https://github.com/february-labs/devgpt-releases/issues"
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
            )}
          </SlideFade>
          <Flex gap={2} ml={2}>
            {!isPro && (
              <Tooltip label="Upgrade" placement="top">
                <IconButton
                  _hover={{
                    transform: "translateY(-4px)",
                    transition: "all 0.2s ease-in-out",
                    color: "blue.500",
                  }}
                  bgGradient="linear(to-tr, teal.500, blue.500)"
                  onClick={onUpgradeOpen}
                  aria-label="Upgrade"
                  icon={<StarIcon color="white" />}
                />
              </Tooltip>
            )}
            <ProfileOptionIconButton
              tooltip={repoWindowOpen ? "Close Repo Drawer" : "Open Repo Drawer"}
              comparison={repoWindowOpen}
              onClick={() => {
                methods.setRepoWindowOpen(!repoWindowOpen);
              }}
              ariaLabel="Open Repo Drawer"
              label="Close"
              otherLabel="Open"
              Icon={AiFillFolderOpen}
              OtherIcon={AiFillFolderOpen}
            />
            <Tooltip label="Signout" placement="top">
              <IconButton
                _hover={{
                  transform: "translateY(-4px)",
                  transition: "all 0.2s ease-in-out",
                }}
                onClick={() => supabase?.auth.signOut()}
                aria-label="Signout"
                icon={<PiSignOutBold size={14} />}
              />
            </Tooltip>
            <Tooltip
              label={isSettingsOpen ? "Close Settings" : "Open Settings"}
              placement="top"
            >
              <IconButton
                _hover={{
                  transform: "translateY(-4px)",
                  transition: "all 0.2s ease-in-out",
                }}
                onClick={onSettingsToggle}
                aria-label="Open Settings"
                icon={<IoMdSettings size={18} />}
              />
            </Tooltip>
          </Flex>
        </Flex>
      </Flex>
      <SlideFade in={isSettingsOpen}>{isSettingsOpen && <Repos />}</SlideFade>
    </Flex>
  );
};

export default Profile;
