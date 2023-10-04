import { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Heading,
  Text,
  Highlight,
  Card,
  CardBody,
  Flex,
  Textarea,
  Tag,
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
  InputGroup,
  InputLeftAddon,
  Input,
} from "@chakra-ui/react";

const PromptCorrectionModal = ({
  isOpen,
  onClose,
  correctedPrompt,
  prompt,
  setPrompt,
  submitHandler,
  submitHandlerReject,
}: any) => {
  const promptArray = prompt.split(" ");
  const correctedPromptArray = correctedPrompt.split(" ");
  const [show, setShow] = useState(false);

  const common = correctedPromptArray.filter(
    (word: any) => !promptArray.includes(word)
  );

  //add spaces to the common words for better highlighting
  const commonWithSpaces = common.map((word: any) => word + " ");

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered={true} size="xl">
        <ModalOverlay />
        <ModalContent>
          <Flex p={4} flexDirection="column" width="100%">
            <Flex>
              <ModalCloseButton />
              <Text fontSize={18}>Improve your prompt</Text>
              <Tag colorScheme="purple" ml={3}>
                Experimental
              </Tag>
            </Flex>
            <Text fontSize={14} color="gray.400">
              This is an experimental feature that will help you improve your
              prompts. It will suggest words that you can add to your prompt.
            </Text>
            <Flex flexDirection="column" width="100%" my={2}>
              <InputGroup mb={2}>
                <InputLeftAddon children="old" />
                <Input isReadOnly={true} value={prompt} type="text" placeholder="old prompt" />
              </InputGroup>
              <InputGroup width='100%'>
                <InputLeftAddon children="new" />
                <Input value={correctedPrompt} type="text" placeholder="old prompt" />
              </InputGroup>
            </Flex>
            <Text
              color="gray.400"
              cursor="pointer"
              textDecoration={"underline"}
              onClick={() => {
                setShow(!show);
              }}
            >
              View how to improve prompts
            </Text>
            {show && (
              <UnorderedList>
                <ListItem>Wrap content in ""</ListItem>
                <ListItem>Use the @ command to target files</ListItem>
                <ListItem>Give specific instructions or questions</ListItem>
                <ListItem>You can disable this in the settings</ListItem>
              </UnorderedList>
            )}
          </Flex>

          <ModalFooter>
            <Flex
              gap={2}
              alignSelf="flex-end"
              flexDirection="row"
              w="full"
              justifyContent="flex-end"
            >
              <Button
                variant="ghost"
                onClick={(e) => {
                  submitHandlerReject(e);
                  onClose();
                }}
              >
                Reject
              </Button>
              <Button
                width="100%"
                colorScheme="blue"
                color="white"
                onClick={(e) => {
                  setPrompt(correctedPrompt);
                  submitHandler(e);
                  onClose();
                }}
              >
                Accept Suggestion
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PromptCorrectionModal;
