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
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Box,
} from "@chakra-ui/react";
import { PhoneIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { FaCrown } from "react-icons/fa";
import { MdLabel } from "react-icons/md";
import { BiGitBranch } from "react-icons/bi";
import trainModels from "@/utils/trainModels";

//stores
import repoStore from "@/store/Repos";
import authStore from "@/store/Auth";
import useStore from "@/store/Auth";
import messageStore from "@/store/Messages";
import { IoMdInformationCircle } from "react-icons/io";
import calculateTotalCost from "@/utils/calculateTotalCost";
import Setup from "./Setup";

const RepoSetupModal = ({ isOpen, onClose, onOpen, repo, onSubmit }: any) => {
  const { fetch, user, session, stripe_customer_id }: any = useStore();

  const [sampleSize, setSampleSize] = useState(5);
  const [frequency, setFrequency] = useState(1);
  const [epochs, setEpochs] = useState(1);
  const [trainingMethod, setTrainingMethod] = useState("Embedding");
  const btnRef: any = useRef();

  if (!repo) return null;

  return (
    <Drawer
      size={"sm"}
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      finalFocusRef={btnRef}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader maxW="90%">
          Configure Model for repo: {repo.name}
        </DrawerHeader>
        <DrawerBody>
          <Setup
            repo={repo}
            trainingMethod={trainingMethod}
            sampleSize={sampleSize}
            frequency={frequency}
            epochs={epochs}
            setSampleSize={(e: any) => {
              setSampleSize(e);
            }}
            setFrequency={(e: any) => {
              setFrequency(e);
            }}
          />
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            width="100%"
            bgGradient={"linear(to-r, blue.500,teal.500)"}
            color="white"
            onClick={() => {
              // Add new model to database
              onSubmit({
                ...repo,
                sampleSize,
                frequency,
                epochs,
                trainingMethod,
              });

              // Begin model training
              trainModels(session, user, stripe_customer_id);

              // Close the modal
              onClose();
            }}
          >
            Train
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default RepoSetupModal;
