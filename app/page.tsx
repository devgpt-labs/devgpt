"use client";

import React from "react";
import { Flex } from "@chakra-ui/react";
import { Inter } from "next/font/google";
import { SessionProvider } from "@/context/useSessionContext";
import { ChakraProvider } from "@chakra-ui/provider";
import theme from "@/app/configs/theme";
import Home from "./home";
const inter = Inter({ subsets: ["latin"] });

const App = async () => {
  return (
    <SessionProvider>
      <ChakraProvider theme={theme}>
        <Flex
          flex={{ md: "initial", base: 1 }}
          direction="column"
          alignItems={"center"}
          justifyContent={{ md: "center", base: "flex-start" }}
          className={`min-h-screen flex bg-slate-950 overflow-hidden ${inter.className}`}
        >
          <Home />
        </Flex>
      </ChakraProvider>
    </SessionProvider>
  );
};

export default App;
