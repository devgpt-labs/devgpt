import {
  Box,
  chakra,
  Container,
  Link,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
  Button,
  Flex,
} from "@chakra-ui/react";

import { ReactNode } from "react";
import router from "next/router";
import { shell } from "electron";
import packageJson from "../../../../package.json"

export default function Footer() {
  const textColor = useColorModeValue("gray.700", "gray.200");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  if (router.pathname.includes("/platform/transactions")) {
    return null;
  }

  if (window.innerWidth < 768) {
    return;
  }

  return (
    <Box color={textColor} w={"100vw"}>
      <Box
        w="100%"
        pos="fixed"
        bottom={0}
        bg="black"
        borderColor={borderColor}
        borderTopWidth={1}
        borderStyle={"solid"}
        maxH={100}
      >
        <Container
          as={Stack}
          maxW={"6xl"}
          py={4}
          direction={{ base: "column", md: "row" }}
          spacing={4}
          justifyContent={{ base: "center", md: "space-between" }}
          alignItems={{ base: "center", md: "center" }}
        >

          <Stack direction={"row"} spacing={6}>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                shell.openExternal("https://feb.co.uk");
              }}
              fontSize="sm"
            >
              © February
            </Link>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                shell.openExternal(
                  "https://february-labs.gitbook.io/february-labs/"
                );
              }}
              fontSize="sm"
            >
              Docs
            </Link>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                shell.openExternal("https://discord.gg/6GFtwzuvtw");
              }}
              fontSize="sm"
            >
              Support
            </Link>
          </Stack>
          <Text>
            Version: {packageJson.version}
          </Text>
        </Container>
      </Box>
    </Box>
  );
}
