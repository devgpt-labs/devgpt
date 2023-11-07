import { Text, Flex, useColorMode, Tag, Box } from "@chakra-ui/react";

import packageJson from "../../package.json";

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
          <Tag
            ml={3}
            bgGradient="linear(to-r, blue.500, teal.500)"
            color="white"
          >
            Open Alpha {version}
          </Tag>
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
          <Tag
            ml={3}
            bgGradient="linear(to-r, blue.500, teal.500)"
            color="white"
          >
            We're currently investigating issues with training, join our discord
            to stay updated.
          </Tag>
          {repo.repo && (
            <Tag bgGradient={"linear(to-r, blue.500, teal.500)"} color="white">
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