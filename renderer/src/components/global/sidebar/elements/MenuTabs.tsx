import React, { useEffect, useState } from "react";
import { ipcRenderer, shell } from "electron";
import router from "next/router";
import {
  Box,
  Collapse,
  Divider,
  Kbd,
  useDisclosure,
  InputGroup,
  TagLabel,
  TagCloseButton,
  Input,
  FormLabel,
  Tag,
  Button,
  InputRightElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Flex,
  Grid,
  Image,
  Stack,
  Heading,
  Card,
  CardBody,
  CardFooter,
  ButtonGroup,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  useToast,
} from "@chakra-ui/react";
import { FiHeart, FiMessageSquare, FiPlus, FiSettings } from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai";
import { IconType } from "react-icons";
import { AiFillBug } from "react-icons/ai";
import checkOS from "@/src/utils/checkOS";
import NavItem from "../../navigation/NavItem";
import SettingsModal from "@/src/components/global/sidebar/elements/SettingsModal";
import Logo from "../../Logo";
import { MdBiotech } from "react-icons/md";
import { AiOutlineFolderOpen } from "react-icons/ai";
import getProfile from "@/src/utils/getProfile";
import { useAuthContext } from "@/src/context";
import checkIfPremium from "@/src/utils/checkIfPremium";
import getUserSubscription from "@/src/utils/getUserSubscription";
import UpgradeModal from "@/src/components/global/UpgradeModal";

interface LinkItemProps {
  name: string;
  icon: IconType;
  command?: any;
  onClick?: () => void;
}

const MenuTabs = () => {
  const [viewingTargetRepo, setViewingTargetRepo] = useState(false);
  const [newTaskCreated, setNewTaskCreated] = useState(false);
  const [isUserPremium, setIsUserPremium] = useState(false);
  const [targetRepo, setTargetRepo] = useState(null);
  const [targetRepoUserFriendly, setTargetRepoUserFriendly] = useState(null);
  const newTaskHandler = () => {
    setNewTaskCreated(true);
    router.push(`/platform/transactions/new`);
  };

  const { user } = useAuthContext();

  getProfile(user).then((profile: any) => {
    setTargetRepo(profile?.local_repo_dir);

    //check if path contains / or \ and split by that
    const splitPath = profile?.local_repo_dir?.split(/\/|\\/);
    //get the last item in the array
    const lastItem = splitPath?.[splitPath?.length - 1];
    //set the last item as the targetRepoUserFriendly
    setTargetRepoUserFriendly(lastItem);
  });

  const setPlan = async () => {
    const premium: any = await getUserSubscription(user.id);
    if (premium.activeSubscription) {
      setIsUserPremium(true);
    } else {
      setIsUserPremium(false);
    }
  };

  useEffect(() => {
    if (user) {
      setPlan();
    }
  }, [user]);

  const {
    isOpen: isSettingsOpen,
    onOpen: onSettingsOpen,
    onClose: onSettingsClose,
  } = useDisclosure();

  const {
    isOpen: isUpgradeOpen,
    onOpen: onUpgradeOpen,
    onClose: onUpgradeClose,
  } = useDisclosure();

  const LinkItems: any = [
    {
      name: "New Task",
      icon: FiPlus,
      command: checkOS("⌘ + N", "Ctrl + N"),
      onClick: () => {
        newTaskHandler();
      },
    },
    !isUserPremium && {
      name: "Upgrade",
      upgradeButton: true,
      icon: AiFillHeart,
      command: checkOS("⌘ + U", "Ctrl + U"),
      onClick: () => {
        onUpgradeOpen();
      },
    },
    {
      name: "Report a bug",
      icon: AiFillBug,
      command: checkOS("⌘ + B", "Ctrl + B"),
      onClick: () => {
        // Open a discord server with this ID: 931533612313112617 and this channel ID: 1121545816113418421
        shell.openExternal("https://discord.gg/6GFtwzuvtw");
        shell.openExternal(
          "https://github.com/february-labs/devgpt-releases/issues/new"
        );
      },
    },
    {
      name: targetRepoUserFriendly
        ? `Repo: ${targetRepoUserFriendly}`
        : "Set Target Repo",
      icon: AiOutlineFolderOpen,
      command: checkOS("⌘ + T", "Ctrl + T"),
      onClick: () => {
        openRepoSettings();
      },
    },
  ];

  const openRepoSettings = () => {
    onSettingsOpen();
    setViewingTargetRepo(true);
  };

  const openTechStackSettings = () => {
    onSettingsOpen();
    setViewingTargetRepo(false);
  };

  // Listen for the message from the main process
  ipcRenderer.on("new-task", (event, arg) => {
    newTaskHandler();
  });

  ipcRenderer.on("open-settings", (event, arg) => {
    onSettingsOpen();
  });

  const useGlobalKeyboardShortcut = (key: string, action: () => void) => {
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === key && (event.ctrlKey || event.metaKey)) {
          event.preventDefault();
          action();
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [action, key]);
  };

  useGlobalKeyboardShortcut("s", onSettingsOpen);

  // Listen for Cmd+D and Ctrl+D to open docs
  useGlobalKeyboardShortcut("d", () => {
    shell.openExternal("https://february-labs.gitbook.io/february-labs/");
  });

  // Listens for Cmd+N and Ctrl+N to create a new task
  useGlobalKeyboardShortcut("n", () => {
    setNewTaskCreated(true);
    router.push(`/platform/transactions/new`);
  });

  // Listens for Cmd+T and Ctrl+T to select target repo
  useGlobalKeyboardShortcut("t", () => {
    openRepoSettings();
  });

  // Listens for Cmd+B and Ctrl+B to report bugs
  useGlobalKeyboardShortcut("b", () => {
    shell.openExternal("https://discord.gg/6GFtwzuvtw");
    shell.openExternal(
      "https://github.com/february-labs/devgpt-releases/issues"
    );
  });

  return (
    <>
      <Box p={5} pt={0} pb={0} onClick={newTaskHandler} cursor={"pointer"}>
        <Logo />
      </Box>
      <UpgradeModal
        isUpgradeOpen={isUpgradeOpen}
        onUpgradeClose={onUpgradeClose}
      />
      {LinkItems.map((link) => {
        if (!link.name) return null;
        return (
          <NavItem
            upgradeButton={link.upgradeButton}
            key={link.name}
            icon={link.icon}
            onClick={() => {
              {
                link?.onClick && link?.onClick();
              }
            }}
          >
            {link.name}
            <Kbd ml={2}>{link?.command}</Kbd>
          </NavItem>
        );
      })}
      <Divider />
      <Collapse in={newTaskCreated}>
        <NavItem
          iconColor="white"
          onClick={() => {
            router.push(`/platform/transactions/new`);
          }}
          icon={FiMessageSquare}
        >
          New Task
        </NavItem>
      </Collapse>
      <SettingsModal
        viewingTargetRepo={viewingTargetRepo}
        isSettingsOpen={isSettingsOpen}
        onSettingsClose={onSettingsClose}
      />
    </>
  );
};

export default MenuTabs;
