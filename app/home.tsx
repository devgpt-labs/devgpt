import React from "react";
import { useSessionContext } from "@/context/useSessionContext";
import Auth from "./auth/auth";
import Chat from "./chat/chat";
import RepoDrawer from "./repos/RepoDrawer";
import { useDisclosure, Tag, Text, Flex } from "@chakra-ui/react";

const Home = () => {
  const { user } = useSessionContext();

  return (
    <>
      <Tag
        p={2}
        colorScheme="blue"
        justifyContent="center"
        width="100vw"
        flexDirection="row"
      >
        <Text mr={3}>We are now a web based AI dev-agent. </Text>
        <Text mr={3}>🎉 </Text>
        <Text>GitLab and BitBucket connectors coming soon.</Text>
        {/* <Text>Read more about why we thought this was important</Text> */}
      </Tag>
      <Flex
        height="95vh"
        flexDirection="column"
        alignItems='center'
        justifyContent='center'
      >
        {user ? <Chat /> : <Auth />}

        <RepoDrawer />
      </Flex>
    </>
  );
};

export default Home;
