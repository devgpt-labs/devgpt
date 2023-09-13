import {
  Flex,
  Heading,
  Text,
  Progress,
  Grid,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button

} from "@chakra-ui/react";
import SuggestionTag from "@/src/components/global/SuggestionTag";
import Settings from "./sidebar/elements/Settings";

interface TutorialProps {
  onSettingsOpen: any;
  progress: any;
  localRepoDir: any;
  technologiesUsed: any;
}

const Tutorial = ({
  onSettingsOpen,
  progress,
  localRepoDir,
  technologiesUsed,
}: TutorialProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast();
  return (
    <Flex flexDirection="column" alignItems="center">
      <Heading mb={2} size="lg">
        Welcome, let's get started.
      </Heading>
      <Text mb={6}>Setup takes a minute</Text>
      <Progress
        width="100%"
        height={2}
        mb={4}
        value={progress}
        borderRadius={10}
        border="0.5px solid gray.600"
        color="bluse"
      />
      <Grid
        flexDirection="row"
        templateColumns="repeat(1, 1fr)"
        gap={4}
        alignItems="center"
      >
        <SuggestionTag
          label="Create an account (10s)"
          suggestion="Sign up for free using your email & password"
          onClick={() => {
            toast.closeAll();
            toast({
              title: "Account Creation.",
              description: "You have already completed this step!",
              status: "success",
              duration: 5000,
              position: "top-right",
              isClosable: true,
            });
          }}
          Icon={null}
          complete={true}
          theme={false}
          tutorial={true}
        />
        <SuggestionTag
          label="Add Your First Repo (40s)"
          suggestion={`Select the folder that contains your code repository.`}
          onClick={() => {
            onOpen();
          }}
          Icon={null}
          complete={localRepoDir}
          theme={false}
          tutorial={true}
        />
        {/* <SuggestionTag
          label="Select Tech Stack (20s)"
          suggestion={`Choose your project's languages and frameworks.`}
          onClick={() => {
            onSettingsOpen();
          }}
          Icon={null}
          complete={technologiesUsed}
          theme={false}
          tutorial={true}
        /> */}
        <Modal size='xl' isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <Settings />
          </ModalContent>
        </Modal>

      </Grid>
    </Flex>
  );
};

export default Tutorial;
