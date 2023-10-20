import { Text, Flex, useColorMode, Tag, Box } from "@chakra-ui/react";

import packageJson from "../../../../package.json";

//stores
import repoStore from "@/store/Repos";

//components
import Logo from "@/components/Logo";

const ChatHeader = () => {
  const { repo }: any = repoStore();
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
      <Flex flexDirection={"row"}>
        <Logo />
        <Tag ml={3} colorScheme="purple" color='white'>
          Open Beta {version}
        </Tag>
      </Flex>
      <Flex flexDirection="row" gap={2}>
        <Tag
          colorScheme="purple"
          alignItems="center"
          justifyContent="center"
          flexDirection="row"
          ml={2}
          gap={2}
          color="white"
        >
          <Text>Desktop app returning soon</Text>
          <Text>🎉</Text>
        </Tag>
        {repo.repo && (
          <Tag color="white" colorScheme="purple">
            {repo.repo}
          </Tag>
        )}
      </Flex>
    </Flex>
  );
};

export default ChatHeader;
