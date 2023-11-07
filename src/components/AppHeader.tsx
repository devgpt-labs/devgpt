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
      backgroundColor={colorMode === "light" ? "#F7FAFC" : "black"}
    >
      <Logo />
      <Flex flexDirection={"row"} width="100%" justifyContent="space-between">
        <Box>
          <Tag ml={3} colorScheme="cyan" size="sm">
            Beta {version}
          </Tag>
        </Box>
        <Flex gap={2}>{repo.repo && <Text>{repo.repo}</Text>}</Flex>
      </Flex>
    </Flex>
  );
};

export default ChatHeader;
