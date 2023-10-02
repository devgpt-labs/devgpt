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
} from "@chakra-ui/react";

const PromptCorrectionModal = ({
  isOpen,
  onClose,
  correctedPrompt,
  prompt,
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
          <ModalHeader>Let's improve your prompt</ModalHeader>
          <ModalCloseButton />
          <ModalBody pt={3}>
            <Card>
              <CardBody>
                <Text size="md" mb={3}>
                  Original prompt:
                </Text>
                <Heading size={"lg"}>{prompt}</Heading>
              </CardBody>
            </Card>
            <Card mt={3}>
              <CardBody>
                <Text size="md" mb={3}>
                  Corrected prompt:
                </Text>
                <Heading size={"lg"}>
                  <Highlight
                    query={commonWithSpaces}
                    styles={{
                      px: "2",
                      py: "1",
                      rounded: "full",
                      bg: "yellow.100",
                      lineHeight: "1.7",
                    }}
                  >
                    {correctedPrompt}
                  </Highlight>
                </Heading>
              </CardBody>
            </Card>
          </ModalBody>
          <ModalFooter>
            <Flex flexDirection={"column"} w="full">
              <Text textAlign={"center"}>
                Tip: We use ~ to represent your project root directory
              </Text>
              <Flex mt={5} justifyContent={"flex-end"}>
                <Button variant="ghost" onClick={onClose}>
                  No thanks
                </Button>
                <Button
                  colorScheme="blue"
                  color="white"
                  mr={3}
                  onClick={onClose}
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
