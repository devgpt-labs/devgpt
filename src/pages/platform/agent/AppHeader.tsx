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
      <Logo />
      <Flex
        flexDirection={"row"}
        width="100%"
        justifyContent="space-between"
      >
        <Tag ml={3} colorScheme="teal" >
          Open Beta {version}
        </Tag>
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
            <Tag colorScheme="blue"
              color='white'

            >
              {repo.repo}
            </Tag>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ChatHeader;
