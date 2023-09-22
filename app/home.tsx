import React from "react";
import { useSessionContext } from "@/context/useSessionContext";
import Auth from "./auth/Auth";
import Chat from "./chat/Chat";
import RepoDrawer from "./repos/RepoDrawer";
import { Tag, Text, Flex, useColorMode } from "@chakra-ui/react";

const Home = () => {
  const { user, session } = useSessionContext();
  const { colorMode } = useColorMode();

  return (
    <Flex
      flexDirection="column"
      bg={colorMode === 'dark' ? "black" : "whitesmoke"}
      width="100vw"
      height="100vh"
    >
      <Tag
        p={2}
        colorScheme="blue"
        justifyContent="center"
        width="100vw"
        flexDirection="row"
      >
        <Text mr={3}>DevGPT is now accessible via the web!</Text>
        <Text mr={3}>🎉 </Text>
        <Text>Improved desktop app dropping soon</Text>
        {/* <Text>Read more about why we thought this was important</Text> */}
      </Tag>
      <Flex
        height="95vh"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        {user && session ? <Chat /> : <Auth />}
        <RepoDrawer />
      </Flex>
    </Flex>
  );
};

export default Home;
