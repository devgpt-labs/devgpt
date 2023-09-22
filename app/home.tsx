import React from "react";
import { useSessionContext } from "@/context/useSessionContext";
import Auth from "./auth";
import Chat from "./chat/Chat";
import RepoDrawer from "./repos/RepoDrawer";
import { Tag, Text, Flex } from "@chakra-ui/react";

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
        <Text>
          We are now a web based AI dev-agent. 🎉 GitLab and BitBucket
          connectors coming soon.
        </Text>
      </Tag>
      <Flex
        height="95vh"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        {user ? <Chat /> : <Auth />}
        <RepoDrawer />
      </Flex>
    </>
  );
};

export default Home;
