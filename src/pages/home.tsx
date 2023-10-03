import React, { useState } from "react";
import Auth from "@/pages/platform/auth/Auth";
import { Tag, Text, Flex, useColorMode } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

const Home = () => {
  const { colorMode } = useColorMode();

  return (
    <Flex
      flex={{ md: "initial", base: 1 }}
      direction="column"
      alignItems="center"
      justifyContent={{ md: "center", base: "flex-start" }}
      className={`min-h-screen flex bg-slate-950 overflow-hidden`}
    >
      <Flex
        flexDirection="column"
        bg={colorMode === "dark" ? "black" : "whitesmoke"}
        width="100vw"
        height="100vh"
        overflowY="scroll"
      >
        <Tag
          p={2}
          py={3}
          colorScheme="blue"
          alignItems="center"
          justifyContent="center"
          width="100vw"
          flexDirection="row"
          gap={3}
          color="white"
        >
          <Text>
            DevGPT is now accessible via the web! 🎉 Improved desktop app coming
            soon.
          </Text>
        </Tag>

        <Flex
          height="95vh"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Auth />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Home;
