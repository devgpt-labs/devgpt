import React from "react";
import { Tag, Text, Flex, useColorMode, Box } from "@chakra-ui/react";
import Profile from "@/components/repos/Profile";
import AppHeader from "@/components/AppHeader";

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
        bgColor={colorMode === "dark" ? "#24292f" : "whitesmoke"}
        width="100vw"
        minH="100vh"
      >
        <AppHeader />
        <Flex
          minH="78vh"
          flexDirection="column"
          alignItems="center"
          justifyContent="flex-start"
        >
          {children}
        </Flex>
        <Profile />
      </Flex>
    </Flex>
  );
};

export default Home;
