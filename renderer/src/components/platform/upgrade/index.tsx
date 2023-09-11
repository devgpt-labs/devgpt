import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Text,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  Flex,
  Button,
  useToast,
  Heading,
} from "@chakra-ui/react";
import { supabase } from "@/src/utils/supabaseClient";
import router from "next/router";
import { shell } from "electron";

const Plans = () => {
  return (
    <Flex
      p={6}
      w="100vw"
      h="100vh"
      alignItems="center"
      justifyContent={"center"}
      textAlign={"center"}
      flexDirection={"column"}
    >
      <Heading size="xl" mb={3}>
        A new update is available! Please update to the latest version.
      </Heading>
      <Text size="md" mb={3}>
        If you're a Mac user your update will complete automatically, please
        wait. A button will appear soon to allow you to restart the app. You do
        not have to do anything in the meantime.
      </Text>
      <Text size="md" mb={3}>
        Windows and Linux versions are not yet code signed so you will have to
        download the latest version manually, below.
      </Text>
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
          Download the latest version
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
    </Flex>
  );
};
export default Plans;
