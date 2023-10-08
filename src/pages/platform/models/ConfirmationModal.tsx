"use client";
import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";

const ConfirmationModal = ({
  header,
  body,
  confirmButtonText,
  isOpen,
  onClose,
  onSubmit,
  setLoadingState,
  handleModelInTrainingChange,
}: {
  header: string;
  body: string;
  confirmButtonText: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  setLoadingState: (value: boolean) => void;
  handleModelInTrainingChange: (e: any) => void;
}) => {
  return (
    <Modal isCentered={true} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{header}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            {body}
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="ghost"
            mr={3}
            onClick={() => {
              onClose();
              setLoadingState(false);
            }}
          >
            Close
          </Button>
          <Button
            onClick={() => {
              onSubmit();
              setLoadingState(false);
              handleModelInTrainingChange({
                target: {
                  name: "deleted",
                  value: true,
                },
              });
              onClose();
            }}
            color='white'
            bgGradient={"linear(to-r, blue.500,teal.500)"}
            width="100%"
          >
            {confirmButtonText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;
