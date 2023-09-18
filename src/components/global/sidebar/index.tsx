import React, { useEffect, useState } from "react";
import { supabase } from "@/src/utils/supabase/supabase";

import themes from "@/src/config/themes";
import {
  Box,
  Flex,
  useColorModeValue,
  Text,
  Menu,
  MenuButton,
  Tag,
  Image,
  IconButton,
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
  MenuDivider,
  MenuItem,
  useDisclosure,
  MenuList,
  Button,
  Center,
  Tooltip,
  Heading,
  Grid,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { FaDiscord, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import getUserRepositories from "@/src/utils/github/getUserRepositories";
import { MdCheckCircle, MdSettings, MdClose, MdPassword } from "react-icons/md";
import { BsTrophy, BsEasel } from "react-icons/bs";
import { GoSignOut } from "react-icons/go";
import { AiOutlineLogout, AiOutlineProfile } from "react-icons/ai";
import { BsMoonStars } from "react-icons/bs";
import store from "@/redux/store";
import getTheme from "@/src/utils/getTheme";

//components
import { useAuthContext } from "@/src/context";
import packageJson from "@/package.json";
import checkIfPremium from "@/src/utils/checkIfPremium";

//configs
import UserAvatar from "../UserAvatar";
import planIntegers from "@/src/config/planIntegers";

//utils
import MenuTabs from "./elements/MenuTabs";
import TaskTabs from "./elements/TaskTabs";
import checkUsersCodeUsage from "@/src/utils/checkUsersCodeUsage";

import ResetMyPasswordButton from "../../auth/signin/ResetMyPasswordButton";
import getTasks from "@/src/utils/getTasks";
import getUserSubscription from "@/src/utils/getUserSubscription";
import getProfile from "@/src/utils/getProfile";
import getLocalRepoDir from "@/src/utils/getLocalRepoDir";
import getTechnologiesUsed from "@/src/utils/getTechnologiesUsed";

const Profile = () => {
  // Get the user's profile from supabase
  const { user, session } = useAuthContext();
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (userProfile === null) {
      getProfile(user).then((profile) => {
        setUserProfile(profile);
      });
    }
  }, []);

  //todo remove conditional renderes from sidebar so that it doesn't pop in after load

  if (!user) return;

  return (
    <Box>
      <Text mb={4}>Profile</Text>
      <Text>
        <strong>Email:</strong> {user.email}
      </Text>
      <ResetMyPasswordButton />
      {/* {isUserPremium} */}
      {/* {user.email_confirmed_at} */}
    </Box>
  );
};

const Theme = ({ user }) => {
  const toast = useToast();
  const [theme, setTheme] = useState(null);

  // Update 'theme' in profiles in the database to the selected theme
  const updateTheme = async (newTheme: any) => {
    if (supabase) {
      const { data, error } = await supabase
        .from("profiles")
        .update({ theme: newTheme })
        .eq("id", user?.id);

      if (!error) {
        toast.closeAll();
        toast({
          title: "Theme updated.",
          description: "Your theme has been updated.",
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top-right",
        });
      }
    }
  };

  useEffect(() => {
    if (user) {
      getTheme(user).then((theme: any) => {
        setTheme(theme);
      });
    }
  }, []);

  const ThemeOption = ({ selectedTheme, image }: any) => {
    return (
      <Flex
        boxShadow="lg"
        borderRadius="md"
        p={4}
        height={100}
        onClick={() => {
          setTheme(selectedTheme);
          updateTheme(selectedTheme);
        }}
        bgImage={`url(${image})`}
        bgSize="cover"
        cursor="pointer"
        alignItems="flex-start"
      >
        <Flex color="white" flexDirection="row" alignItems="center">
          <Text pr={2}>{selectedTheme}</Text>
          {theme === selectedTheme && <MdCheckCircle />}
        </Flex>
      </Flex>
    );
  };

  return (
    <Box mr={6}>
      <Text mb={4}>Theme</Text>
      <Text mb={4}>
        Pick a theme. Your current theme is: <strong>{theme}</strong>
      </Text>
      <Grid templateColumns="repeat(3, 1fr)" gap={4}>
        {themes.map((theme) => (
          <ThemeOption selectedTheme={theme.name} image={theme.image} />
        ))}
      </Grid>
    </Box>
  );
};

const Achievements = (localRepoDir) => {
  const Achievement = ({ image, title, description, unlocked }: any) => {
    const blurStyle = unlocked ? {} : { filter: "blur(5px)", opacity: 0.5 };
    return (
      <Box pos="relative">
        <Flex
          flexDirection="row"
          width="100%"
          bg={unlocked ? "gray.600" : "gray.800"}
          mb={6}
          alignItems="center"
          borderRadius={5}
          p={4}
        >
          <Image style={blurStyle} src={image} width={10} height={10} mr={4} />
          <Flex flexDirection="column">
            <Text>{title}</Text>

            <Text style={blurStyle}>{description}</Text>
          </Flex>
        </Flex>
      </Box>
    );
  };

  const { user } = useAuthContext();
  const toast = useToast();

  const [localRepo, setLocalRepo] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [premium, setPremium] = useState(null);

  if (user) {
    getLocalRepoDir(user).then((localRepoDir) => {
      setLocalRepo(localRepoDir);
    });

    getTasks(user?.id, toast).then((tasks: any) => {
      setTasks(tasks);
    });

    checkIfPremium(user).then((premium: any) => {
      setPremium(premium);
    });
  }

  return (
    <Box mr={6}>
      <Text mb={6}>Achievements</Text>
      <Achievement
        image="https://em-content.zobj.net/source/apple/354/bird_1f426.png"
        title="Early Bird"
        description="Joined during version 1."
        unlocked={true}
      />
      <Achievement
        image="https://em-content.zobj.net/source/apple/354/glowing-star_1f31f.png"
        title="Pro Member"
        description="You're a pro member! You're helping us build a better product."
        unlocked={premium}
      />
      <Achievement
        image="https://em-content.zobj.net/source/apple/354/rocket_1f680.png"
        title="First Prompt"
        description="You ran your first prompt! Keep it up!"
        unlocked={tasks?.length > 0}
      />
      <Achievement
        image="https://em-content.zobj.net/source/apple/354/laptop_1f4bb.png"
        title="Technician"
        description="Changed your file exclusions and tech stack"
        unlocked={localRepoDir}
      />
      <Achievement
        image="https://em-content.zobj.net/source/apple/354/cheese-wedge_1f9c0.png"
        title="The Big Cheese"
        description="If you somehow have managed to read this, message our team on discord with codeword 'cheese'"
        unlocked={false}
      />
    </Box>
  );
};

const SideBar = () => {
  const [tasks, setTasks] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [localRepoDir, setLocalRepoDir] = useState(null);
  const [technologiesUsed, setTechnologiesUsed] = useState(null);
  const { user, signOut, session } = useAuthContext();
  const borderRightColor = useColorModeValue("gray.200", "gray.700");
  const {
    isOpen: isUserSettingsOpen,
    onOpen: onUserSettingsOpen,
    onClose: onUserSettingsClose,
  } = useDisclosure();

  const {
    isOpen: isWelcomeOpen,
    onOpen: onWelcomeOpen,
    onClose: onWelcomeClose,
  } = useDisclosure({
    defaultIsOpen: true,
  });

  const [selectedTab, setSelectedTab] = useState("profile");
  const [isUserPremium, setIsUserPremium] = useState(false);

  // On click of escape, close the modal
  useEffect(() => {
    const handleEsc = (event: any) => {
      if (event.keyCode === 27) {
        onUserSettingsClose();
      }
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const setPlan = async () => {
    if (!user) return;
    const premium = await getUserSubscription(user.id);
    if (premium?.activeSubscription) {
      setIsUserPremium(true);
    } else {
      setIsUserPremium(false);
    }
  };

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setLocalRepoDir(store.getState().localRepoDirectory);
      setTechnologiesUsed(store.getState().technologiesUsed);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user) {
      setPlan();

      getLocalRepoDir(user).then((localRepoDir) => {
        setLocalRepoDir(localRepoDir);
      });

      getTechnologiesUsed(user).then((technologiesUsed) => {
        setTechnologiesUsed(technologiesUsed);
      });
    }
  }, [user]);

  // Check if the user has any transactions after they have made a new transaction
  // Leave this function open
  supabase
    .channel("table-filter-changes")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "new_transactions",
        filter: "user_id=eq." + user?.id,
      },
      (payload) => {
        setRefresh(!refresh);
      }
    )
    .subscribe();

  const [codeUsage, setCodeUsage] = useState(0);

  useEffect(() => {
    if (!user?.id) return;
    checkUsersCodeUsage(user?.id).then((codeReturn: any) => {
      setCodeUsage(codeReturn?.lines);
    });
  }, [tasks]);

  const UserSettingsMenuItem = ({ label, icon }: any) => {
    return (
      <ListItem
        p={1}
        pl={3}
        mr={4}
        borderRadius={10}
        _hover={{ bg: "gray.500" }}
        cursor="pointer"
        onClick={() => {
          setSelectedTab(label.toLowerCase());
        }}
      >
        <ListIcon as={icon} mr={3} />
        {label}
      </ListItem>
    );
  };

  console.log(session);

  // getUserRepositories(session?.provider_token)
  //   .then((user_repositories) => {
  //     if (user_repositories) {
  //       user_repositories.forEach((repo) => {
  //         console.log(repo.name);
  //       });
  //     }
  //   })
  //   .catch((error) => {
  //     console.error(`Error: ${error.message}`);
  //   });

  // console.log(user);

  return (
    <Flex
      pt={6}
      overflowY="scroll"
      bg={"gray.900"}
      borderRight="1px"
      borderRightColor={borderRightColor}
      h="100vh"
      minW={80}
      flexDirection="column"
      justifyContent="space-between"
    >
      <Modal
        onClose={onUserSettingsClose}
        size={"full"}
        isOpen={isUserSettingsOpen}
      >
        <ModalOverlay />
        <ModalContent pt={10}>
          <ModalHeader>
            <Flex
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text>User Settings</Text>
              <Flex
                flexDirection="column"
                alignItems="center"
                mr={4}
                onClick={onUserSettingsClose}
                _hover={{ cursor: "pointer" }}
              >
                <IconButton
                  size="sm"
                  aria-label="Search database"
                  icon={<MdClose />}
                  borderRadius="full"
                />
                <Text fontSize={12} mt={1}>
                  ESC
                </Text>
              </Flex>
            </Flex>
          </ModalHeader>
          <Flex flexDirection="row" ml={4}>
            <Box flex={0.2} height="100%">
              <List spacing={2}>
                {/* <UserSettingsMenuItem label="Theme" icon={BsEasel} /> */}
                <UserSettingsMenuItem label="Profile" icon={AiOutlineProfile} />
                <UserSettingsMenuItem label="Achievements" icon={BsTrophy} />
              </List>
            </Box>
            <Box flex={0.8} borderLeft="1px solid gray" paddingLeft={5}>
              {selectedTab === "profile" && <Profile />}
              {selectedTab === "theme" && <Theme user={user} />}
              {selectedTab === "achievements" && (
                <Achievements localRepoDir={localRepoDir} />
              )}
            </Box>
          </Flex>
        </ModalContent>
      </Modal>

      <Box>
        <MenuTabs />
        <TaskTabs
          tasks={tasks}
          setTasks={setTasks}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      </Box>
      <Box>
        <Flex
          bg="gray.900"
          pos="fixed"
          bottom={0}
          left={0}
          w="80"
          flexDirection="row"
          justifyContent="space-between"
          borderTop="1px"
          borderRight="1px"
          borderColor="gray.700"
          p={4}
        >
          <Flex flexDirection="row">
            <Menu>
              {user && (
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  {user?.identities?.[0]?.identity_data?.avatar_url ? (
                    <Image
                      src={user?.identities[0].identity_data.avatar_url}
                      borderRadius={100}
                      mr={2}
                      height="40px"
                      width="40px"
                    />
                  ) : (
                    <UserAvatar />
                  )}
                </MenuButton>
              )}
              <MenuList alignItems={"center"}>
                <br />
                <Center>
                  <UserAvatar />
                </Center>
                <br />
                <Center>
                  <p>{user?.email}</p>
                </Center>
                <br />
                <MenuDivider />
                <MenuItem
                  icon={<EditIcon />}
                  command=""
                  onClick={() => {
                    onUserSettingsOpen();
                    setSelectedTab("profile");
                  }}
                >
                  Edit Profile
                </MenuItem>
                <MenuItem
                  icon={<MdPassword />}
                  command=""
                  onClick={() => {
                    onUserSettingsOpen();
                    setSelectedTab("profile");
                  }}
                >
                  Reset my password
                </MenuItem>
                {/* <MenuItem
                  icon={<BsEasel />}
                  command=""
                  onClick={() => {
                    onUserSettingsOpen();
                    setSelectedTab("theme");
                  }}
                >
                  Change Theme
                </MenuItem> */}
                <MenuItem
                  icon={<BsTrophy />}
                  command=""
                  onClick={() => {
                    onUserSettingsOpen();
                    setSelectedTab("achievements");
                  }}
                >
                  My achievements
                </MenuItem>
                <MenuItem
                  icon={<BsMoonStars />}
                  command=""
                  onClick={() => {
                    signOut();
                  }}
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>

            <Flex flexDirection="column">
              <Flex flexDirection="row" alignItems="center">
                <Heading size="md" mr={2}>
                  {user && user?.app_metadata?.provider === "github"
                    ? user?.identities?.[0]?.identity_data?.full_name
                    : user?.email
                      ?.split("@")?.[0]
                      ?.substring(0, 1)
                      ?.toUpperCase() +
                    user?.email?.split("@")?.[0]?.substring(1, 8)}
                </Heading>
                {!isUserPremium && (
                  <Tooltip label="Limit resets daily. Upgrade for unlimited code gen.">
                    <Tag color={"yellow.100"} size="md" mt={1} mb={1}>
                      {`${codeUsage} / ${planIntegers?.free_lines_of_code_count} lines`}
                    </Tag>
                  </Tooltip>
                )}
              </Flex>
              <Text fontSize={13}>Version {packageJson?.version}</Text>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

export default SideBar;
