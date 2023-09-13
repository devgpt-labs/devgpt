import React, { } from "react";
import {
  Flex,
  Button,
  Heading,
} from "@chakra-ui/react";
import { shell } from "electron";

const Plans = () => {
  return (
    <Flex pos='absolute' top={0} right={0} width={500} height={500} bg='red' >
      <Heading size="xl" mb={3}>
        A new update is available! Please update to the latest version.
      </Heading>
      <Flex flexDirection="row">
        <Button
          mt={10}
          mr={4}
          bgGradient={"linear(to-r, blue.500, teal.500)"}
          onClick={() => {
            shell.openExternal(
              "https://github.com/february-labs/devgpt-releases/releases"
            );
          }}
        >
          View The Latest Version
        </Button>
        <Button
          mt={10}
          bgGradient={"linear(to-r, blue.500, teal.500)"}
          onClick={() => {
            shell.openExternal("https://discord.gg/6GFtwzuvtw");
          }}
        >
          Join the Discord
        </Button>
      </Flex>
    </Flex >
  );
};
export default Plans;
