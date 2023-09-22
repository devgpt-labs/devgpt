import React, { useState, useEffect } from "react";
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
      bg={colorMode === "dark" ? "black" : "whitesmoke"}
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
        <Text>
          DevGPT is now accessible via the web! 🎉 Improved desktop app dropping
          soon.
        </Text>
      </Tag>
      <Flex
        height="95vh"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        {user && session ? (
          <>
            <Chat />
            <RepoDrawer />
          </>
        ) : (
          <>
            <Auth />
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default Home;
