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
}: {
  header: string;
  body: string;
  confirmButtonText: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  setLoadingState: (value: boolean) => void;
}) => {
  return (
    <Modal
      isCentered={true}
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setLoadingState(false);
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{header}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>{body}</Text>
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
              onClose();
            }}
            color="white"
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
