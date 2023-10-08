import React, { useState, useEffect } from "react";
import { Tag, Text, Flex, useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/router";

//auth store
import useStore from "@/store/Auth";

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
        height="100vh"
        overflowY="scroll"
      >
        <Tag
          p={2}
          py={3}
          colorScheme="blue"
          alignItems="center"
          justifyContent="center"
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
          // mx={20}
          height="95vh"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          {children}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Home;
