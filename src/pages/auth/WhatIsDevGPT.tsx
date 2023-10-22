"use client";
import {
  Text,
  Button,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Flex,
  UnorderedList,
  ListItem,
  useColorMode,
} from "@chakra-ui/react";

import { FaUserAstronaut } from "react-icons/fa";

const GitConnectorButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();

  return (
    <>
      <Button
        onClick={onOpen}
        width="100%"
        justifyContent="space-between"
        bg={colorMode === "light" ? "white" : "gray.800"}
      >
        <Text fontWeight={"normal"} mr={2}>
          What is DevGPT?
        </Text>
        <FaUserAstronaut />
      </Button>
      <Modal size="sm" isOpen={isOpen} onClose={onClose} isCentered={true}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>What is DevGPT?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDirection="column">
              <Text mb={4} fontSize={14}>
                DevGPT is a performant AI dev agent that helps you develop. Our
                core focuses for this agent are:
              </Text>
              <UnorderedList mb={4} fontSize={14}>
                <ListItem>Component Creation</ListItem>
                <ListItem>Editing Functions</ListItem>
                <ListItem>Debugging Issues</ListItem>
                <ListItem>Refactoring Code</ListItem>
                <ListItem>Writing Unit Tests</ListItem>
              </UnorderedList>
              <Link
                href="https://discord.com/invite/6GFtwzuvtw"
                cursor="pointer"
                target="_blank"
              >
                <Text mb={4} fontSize={14}>
                  DevGPT is updated weekly, with our sole purpose of creating a
                  useful tool for developers and product owners. We have an
                  active discord community for all.
                </Text>
              </Link>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GitConnectorButton;
