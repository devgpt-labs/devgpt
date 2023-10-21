import React from "react";
import { ChakraProvider } from "@chakra-ui/provider";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import Head from "next/head";

//configs
import theme from "@/configs/theme";

//components
import PageWrapper from "@/components/PageWrapper";

const Home = ({ children }: any) => {


  return (
    <main className={`${inter.className}`}>
      <Head>
        <title>DevGPT</title>
        <meta name="description" content="DevGPT Web" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ChakraProvider theme={theme}>
        <PageWrapper>{children}</PageWrapper>
      </ChakraProvider>
    </main>
  );
};

export default Home;
