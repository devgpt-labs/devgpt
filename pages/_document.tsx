import React, { useEffect } from "react";
import { Html, Head, Main, NextScript } from "next/document";
import {
  Box,
  Flex,
  Tag,
  Alert,
  AlertIcon,
  Text,
  AlertTitle,
  AlertDescription,
  Fade,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import { CloseIcon, AddIcon, WarningIcon } from "@chakra-ui/icons";

import store from "@/redux/store";
import getIsUserOnLatestRelease from "@/src/utils/getIsUserOnLatestRelease";
import packageJson from "@/package.json";

const Document = () => {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="February Labs" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
