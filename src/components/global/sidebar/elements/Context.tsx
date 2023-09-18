import React, { useState } from "react";
import {
  InputGroup,
  Input,
  Button,
  InputRightElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  useDisclosure,
  Text,
  Flex,
  Grid,
  useToast,
} from "@chakra-ui/react";
import technologies from "./technologies";
import saveContext from "../functions/saveContext";
import { useAuthContext } from "@/src/context";

const Context = ({ context, setContext }: any) => {
  return (
    <>
      <Flex mt={4} mb={2} flexDirection="column" alignItems="flex-start">
        <Text fontSize={18} color="white" mr={2}>
          What are you working on?
        </Text>
        {/* <IoInformationCircleOutline /> */}
        <Text fontSize={14} mr={2} mt={2} color="gray.400">
          The more context we have, the more accurately and effectively we can
          assist you as your AI co-developer.
        </Text>
      </Flex>
      <InputGroup flexDirection="column">
        <Input
          pr="4rem"
          placeholder="E.g. Developing the front-end UI for a booking app."
          value={context}
          onChange={(e) => {
            // 100 character limit
            if (e.target.value.length > 100) {
              return;
            }

            setContext(e.target.value);
          }}
        />
      </InputGroup>
    </>
  );
};

export default Context;
