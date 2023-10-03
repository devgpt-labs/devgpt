import React, { useState, useRef } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Text,
  Divider,
  Flex,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  InputGroup,
  InputLeftElement,
  Tooltip,
} from "@chakra-ui/react";
import { PhoneIcon } from "@chakra-ui/icons";

//stores
import repoStore from "@/store/Repos";
import authStore from "@/store/Auth";
import messageStore from "@/store/Messages";

const ReadOnlyInput = ({
  label,
  value,
  tooltip,
  Icon,
  onChange,
  type,
}: any) => {
  return (
    <Tooltip placement="right" label={tooltip}>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Icon cursor="pointer" color="gray.300" />
        </InputLeftElement>
        <Input
          type={type}
          placeholder={label}
          isReadOnly={onChange ? false : true}
          value={value}
          onChange={onChange}
        />
      </InputGroup>
    </Tooltip>
  );
};

const RepoSetupModal = ({ isOpen, onClose, onOpen, repo }: any) => {
  const [cycles, setCycles] = useState(10);
  const [frequency, setFrequency] = useState(1);
  const [epochs, setEpochs] = useState(2);

  if (!repo) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Configure Repo: {repo.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex gap={2} flexDirection="column">
            <ReadOnlyInput
              Icon={PhoneIcon}
              tooltip="hehehe"
              placeholder="Owner"
              value={repo.owner.login}
              type="text"
            />
            <ReadOnlyInput
              Icon={PhoneIcon}
              tooltip="hehehe"
              placeholder="Repo"
              value={repo.name}
              type="text"
            />
            <ReadOnlyInput
              Icon={PhoneIcon}
              tooltip="hehehe"
              placeholder="Branch"
              value="main"
              type="text"
            />
            <Divider />
            <ReadOnlyInput
              Icon={PhoneIcon}
              tooltip="hehehe"
              placeholder="Cycles"
              value={cycles}
              onChange={(e: any) => setCycles(e.target.value)}
              type="number"
            />
            <ReadOnlyInput
              Icon={PhoneIcon}
              tooltip="hehehe"
              placeholder="Frequency"
              value={frequency}
              onChange={(e: any) => setFrequency(e.target.value)}
              type="number"
            />
            <ReadOnlyInput
              Icon={PhoneIcon}
              tooltip="hehehe"
              placeholder="Epochs"
              value={epochs}
              onChange={(e: any) => setEpochs(e.target.value)}
              type="number"
            />
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button colorScheme="blue" width="100%">
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RepoSetupModal;
