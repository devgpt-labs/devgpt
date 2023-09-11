import { Flex, Heading, Text } from "@chakra-ui/react";
import Head from "next/head";
import Image from "next/image";

export default function NotFound() {
  return (
    <>
      <Flex
        w="100%"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Text padding={5} mb={12}>
          Oops! It looks like you took a wrong turn.
        </Text>
      </Flex>
    </>
  );
}
