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
} from "@chakra-ui/react";

const PromptCorrectionModal = ({
  isOpen,
  onClose,
  correctedPrompt,
  prompt,
  submitHandler,
  submitHandlerReject,
}: any) => {
  const promptArray = prompt.split(" ");
  const correctedPromptArray = correctedPrompt.split(" ");

  const common = correctedPromptArray.filter(
    (word: any) => !promptArray.includes(word)
  );

  //add spaces to the common words for better highlighting
  const commonWithSpaces = common.map((word: any) => word + " ");

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered={true} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex>
              <Text>Improve your prompt</Text>
              <Tag colorScheme="purple" ml={3}>
                Experimental
              </Tag>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pt={3}>
            <Flex flexDirection="row" gap={10}>
              <Flex flexDirection="column">
                <Text size="md" mb={3}>
                  Original prompt:
                </Text>
                <Card>
                  <CardBody>
                    <Heading size={"md"}>{prompt}</Heading>
                  </CardBody>
                </Card>
                <Text size="md" mb={3} mt={5}>
                  New prompt:
                </Text>
                <Textarea size={"md"}>{correctedPrompt}</Textarea>
              </Flex>
              <UnorderedList>
                <ListItem>Wrap content in ""</ListItem>
                <ListItem>Use the @ command to target files</ListItem>
                <ListItem>Give specific instructions or questions</ListItem>
                <ListItem>You can disable this in the settings</ListItem>
              </UnorderedList>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Flex
              gap={2}
              mt={2}
              alignSelf="flex-end"
              flexDirection="row"
              w="full"
              justifyContent="flex-end"
            >
              <Button
                variant="ghost"
                onClick={(e) => {
                  onClose();
                  submitHandlerReject(e);
                }}
              >
                Reject
              </Button>
              <Button
                width="100%"
                colorScheme="blue"
                color="white"
                onClick={(e) => {
                  onClose();
                  submitHandler(e);
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
