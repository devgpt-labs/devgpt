import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import { ChakraProvider } from "@chakra-ui/provider";

//configs
import styles from "@/styles/Home.module.css";
import theme from "@/configs/theme";

//components
import Home from "@/pages/home";

const inter = Inter({ subsets: ["latin"] });

export default function Index() {
  return (
    <>
      <Head>
        <title>DevGPT</title>
        <meta name="description" content="DevGPT Web" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${inter.className}`}>
        <ChakraProvider theme={theme}>
          <Home />
        </ChakraProvider>
      </main>
    </>
  );
}
