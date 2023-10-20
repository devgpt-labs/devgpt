import React from "react";
import { Tag, Text, Flex, useColorMode, Box } from "@chakra-ui/react";
import Profile from "@/components/repos/Profile";
import ChatHeader from "@/pages/platform/agent/ChatHeader";

const Home = ({ children }: any) => {
  const { colorMode } = useColorMode();

  return (
    <Flex
      flex={{ md: "initial", base: 1 }}
      direction="column"
      alignItems="flex-start"
      justifyContent={{ md: "center", base: "flex-start" }}
      className={`min-h-screen flex bg-slate-950 overflow-hidden`}
    >
      <Flex
        flexDirection="column"
        bgColor={colorMode === "dark" ? "black" : "whitesmoke"}
        width="100vw"
        minH="100vh"
      >
        <ChatHeader />
        <Flex
          minH='80vh'
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          {children}
        </Flex>
        <Profile />
      </Flex>
    </Flex>
  );
};

export default Home;
