import { Text, Flex, useColorMode, Tag, Box } from "@chakra-ui/react";

import packageJson from "../../../../package.json";

//stores
import repoStore from "@/store/Repos";
import authStore from "@/store/Auth";

//components
import Logo from "@/components/Logo";

const ChatHeader = () => {
  const { repo }: any = repoStore();
  const { isPro, user }: any = authStore();
  const { colorMode } = useColorMode();
  const version = packageJson?.version;

  return (
    <Flex
      justifyContent="space-between"
      borderBottom={
        colorMode === "light" ? "1px solid #CBD5E0" : "1px solid #1a202c"
      }
      p={5}
      w="full"
      alignItems="center"
      maxH="sm"
    >
      <Logo />
      <Flex flexDirection={"row"} width="100%" justifyContent="space-between">
        <Box>
          <Tag ml={3} colorScheme="teal">
            Open Beta {version}
          </Tag>
          {user &&
            (isPro ? (
              <Tag ml={3} colorScheme="teal">
                {user?.email} / Paid Plan
              </Tag>
            ) : (
              <Tag ml={3} colorScheme="teal">
                {user?.email} / No Plan Active
              </Tag>
            ))}
        </Box>

        <Flex gap={2}>
          {/* <Tag
            color='white'
            colorScheme="blue"
            alignItems="center"
            justifyContent="center"
            flexDirection="row"
            ml={2}
            gap={2}
          >
            <Text>Desktop app returning soon</Text>
            <Text>🎉</Text>
          </Tag> */}
          {repo.repo && (
            <Tag colorScheme="blue" color="white">
              {repo.repo}
            </Tag>
          )}
          {/* {isPro && (
            <Tag colorScheme="blue"
              color='white'

            >
              {repo.repo}
            </Tag>
          )} */}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ChatHeader;
