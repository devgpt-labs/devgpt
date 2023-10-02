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
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Improve your prompt
            <Tag colorScheme="purple" ml={3}>
              Experimental
            </Tag>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pt={3}>
            <Text size="md" mb={3}>
              Original prompt:
            </Text>
            <Card>
              <CardBody>
                <Heading size={"lg"}>{prompt}</Heading>
              </CardBody>
            </Card>
            <Text size="md" mb={3} mt={5}>
              Corrected prompt:
            </Text>
            <Card mt={3}>
              <CardBody>
                <Textarea size={"lg"}>{correctedPrompt}</Textarea>
              </CardBody>
            </Card>
          </ModalBody>
          <ModalFooter>
            <Flex flexDirection={"column"} w="full" alignItems={"center"}>
              <Text textAlign={"center"} w="sm">
                Tip: We use ~ to represent your project root directory, this can
                be disabled in settings.
              </Text>
              <Flex mt={5} alignSelf={"flex-end"}>
                <Button
                  variant="ghost"
                  onClick={(e) => {
                    onClose();
                    submitHandlerReject(e);
                  }}
                >
                  No thanks
                </Button>
                <Button
                  colorScheme="blue"
                  color="white"
                  mr={3}
                  onClick={(e) => {
                    onClose();
                    submitHandler(e);
                  }}
                >
                  Accept Suggestion
                </Button>
              </Flex>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PromptCorrectionModal;
