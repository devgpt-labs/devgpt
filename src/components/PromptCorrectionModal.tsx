import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Button,
  Text,
  Flex,
  Tag,
  InputGroup,
  InputLeftAddon,
  Input,
  Code,
} from "@chakra-ui/react";

const PromptCorrectionModal = ({
  isOpen,
  onClose,
  correctedPrompt,
  setCorrectedPrompt,
  prompt,
  setPrompt,
  onReject,
  onSubmit,
  setLoading,
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
      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={() => {
          setLoading(false);
          onClose()
        }}
        isCentered={true}
        size="5xl"
      >
        <ModalOverlay />
        <ModalContent>
          <Flex p={4} flexDirection="column" width="100%">
            <ModalCloseButton />
            <Flex alignItems="center">
              <Text fontSize={18}>Improve your prompt</Text>
              <Tag colorScheme="purple" ml={3}>
                Experimental
              </Tag>
            </Flex>
            <Text fontSize={14} color="gray.400" mb={2}>
              This is an experimental feature that will help you improve your
              prompts. It will suggest words that you can add to your prompt.
            </Text>
            <Flex flexDirection="column" width="100%" my={2}>
              <InputGroup mb={2}>
                <InputLeftAddon children="old" />
                <Input
                  isReadOnly={true}
                  value={prompt}
                  type="text"
                  placeholder="old prompt"
                />
              </InputGroup>
              <InputGroup width="100%">
                <InputLeftAddon children="new" />
                <Input
                  onChange={(e) => setCorrectedPrompt(e.target.value)}
                  value={correctedPrompt}
                  type="text"
                  placeholder="new prompt"
                />
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
              <>
                <Text>
                  Use the <Code>@</Code> command to target files
                </Text>
                <Text>Provide specific detail about your task only</Text>
                <Text>You can disable this feature in the settings</Text>
              </>
            )}
          </Flex>

          <Flex
            gap={2}
            mb={2}
            px={2}
            alignSelf="flex-end"
            flexDirection="row"
            w="full"
            justifyContent="flex-end"
          >
            <Button
              variant="ghost"
              onClick={(e) => {
                onClose();
                onReject(e);
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
                setLoading(true);
                onClose();
                onSubmit(e);
              }}
            >
              Accept and Run Suggestion
            </Button>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PromptCorrectionModal;
