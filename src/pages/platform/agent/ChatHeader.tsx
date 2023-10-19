import { Text, Flex, useColorMode, Tag } from "@chakra-ui/react";

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
        <Tag ml={2} colorScheme="purple">
          Beta version {version}
        </Tag>
      </Flex>
      <Text>{repo.repo && <Tag>{repo.repo}</Tag>}</Text>
    </Flex>
  );
};

export default ChatHeader;
