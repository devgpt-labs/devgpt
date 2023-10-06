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
  setDeletingAModel,
  handleModelInTrainingChange,
}: {
  header: string;
  body: string;
  confirmButtonText: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  setDeletingAModel: (value: boolean) => void;
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
              setDeletingAModel(false);
            }}
          >
            Close
          </Button>
          <Button
            onClick={() => {
              onSubmit();
              setDeletingAModel(false);
              handleModelInTrainingChange({
                target: {
                  name: "deleted",
                  value: true,
                },
              });
              onClose();
            }}
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
