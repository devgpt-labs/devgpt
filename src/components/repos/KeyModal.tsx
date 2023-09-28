import { useState } from "react";

import {
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
  Input
} from "@chakra-ui/react";

// stores
import authStore from "@/store/Auth";

const KeyModal = ({ isUpgradeOpen, onUpgradeClose }: any) => {
  const { user }: any = authStore();
  const [key, setKey] = useState('')

  const handleChange = (e: any) => {
    setKey(e.target.value)
  }

  return (
    <Modal isOpen={isUpgradeOpen} onClose={onUpgradeClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <Text>Please enter your key</Text>
        <Input value={key} onChange={handleChange} />
      </ModalContent>
    </Modal>
  );
};

export default KeyModal;
