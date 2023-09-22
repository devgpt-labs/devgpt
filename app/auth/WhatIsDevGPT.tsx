"use client";
import {
  Text,
  Button,
  Link,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Box,
  Flex,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";

import { FaUserAstronaut } from "react-icons/fa";

const GitConnectorButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen} width="100%" justifyContent="space-between">
        <Text fontWeight={"normal"} mr={2}>
          What is DevGPT?
        </Text>
        <FaUserAstronaut color="white" />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>What is DevGPT?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDirection="column">
              <Text mb={4} fontSize={14}>
                DevGPT is a performant AI dev agent that helps you develop. Our
                core focuses for this agent are to improve:
              </Text>
              <UnorderedList mb={4} fontSize={14}>
                <ListItem>Component Creation</ListItem>
                <ListItem>Editing Functions</ListItem>
                <ListItem>Debugging Issues</ListItem>
                <ListItem>Refactoring Code</ListItem>
                <ListItem>Writing Unit Tests</ListItem>
              </UnorderedList>
              <Text mb={4} fontSize={14}>
                DevGPT is updated weekly, with our sole purpose of creating a
                useful tool for developers and product owners.
              </Text>
            </Flex>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </>
  );
};

export default GitConnectorButton;
