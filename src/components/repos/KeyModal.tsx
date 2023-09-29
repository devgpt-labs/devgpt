import { useEffect, useState } from "react";

import {
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
  Input,
  ModalCloseButton,
  ModalBody,
  InputGroup,
  ModalHeader,
  ModalFooter,
  Button,
  Flex,
  InputRightElement,
} from "@chakra-ui/react";

// stores
import authStore from "@/store/Auth";
import Cookies from "js-cookie";

const KeyModal = ({ isKeyOpen, onKeyOpen, onKeyClose }: any) => {
  const { user }: any = authStore();
  const [key, setKey] = useState("");
  const [show, setShow] = useState(false);
  const cookieName = "openai-key";

  const handleChange = (e: any) => {
    setKey(e.target.value);
  };

  const handleClick = () => {
    setShow(!show);
  };

  useEffect(() => {
    retrieveKey();
  }, []);

  const retrieveKey = async () => {
    const cookieKey = await Cookies.get(cookieName);

    if (cookieKey !== undefined) {
      setKey(JSON.parse(cookieKey));
    }
  };

  const saveKeyInCookies = async () => {
    Cookies.set(cookieName, JSON.stringify(key), { expires: 14 });
  };

  return (
    <Modal isCentered={true} isOpen={isKeyOpen} onClose={onKeyClose} size="2xl">
      <ModalOverlay />
      <ModalContent p={4}>
        <ModalCloseButton />
        <Text mb={2}>Your Open AI Key:</Text>
        <InputGroup size="md">
          <Input
            placeholder="sk-1234"
            pr="4.5rem"
            type={show ? "text" : "password"}
            value={key}
            onChange={handleChange}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        <Text fontSize={14} my={2} color="gray.400">
          Your key is stored locally on your machine. We do not store your key
          or save it to our database.
        </Text>
        <Flex mt={2} flexDirection="row" justifyContent="space-between">
          {/* <Text fontSize={14} color="gray.400" mr={10}>
            If you don't have or don't want to use your Open-AI key, you can
            upgrade to use our key.
          </Text>
          <Button mr={2}>Upgrade</Button> */}
          <Button onClick={saveKeyInCookies}>Save</Button>
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default KeyModal;
