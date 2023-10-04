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

//stores
import repoStore from "@/store/Repos";
import authStore from "@/store/Auth";
import messageStore from "@/store/Messages";
import { IoMdInformationCircle } from "react-icons/io";
import calculateTotalCost from "@/utils/calculateTotalCost";
import Setup from "./Setup";

const SliderInput = ({
  label,
  value,
  tooltip,
  Icon,
  onChange,
  increment,
  max,
}: any) => {
  return (
    <Flex gap={2} flexDirection="column">
      <Tooltip placement="right" label={tooltip}>
        <Flex flexDirection="row" alignItems="center" gap={2}>
          <Text>
            {label} ({value})
          </Text>
          <IoMdInformationCircle />
        </Flex>
      </Tooltip>
      <Slider
        aria-label={label}
        defaultValue={value}
        onChange={onChange}
        min={increment}
        max={max}
        step={increment}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb zIndex={1} />
      </Slider>
    </Flex>
  );
};

const RepoSetupModal = ({ isOpen, onClose, onOpen, repo, onSubmit }: any) => {
  const [cycles, setCycles] = useState(5);
  const [frequency, setFrequency] = useState(10);
  const [epochs, setEpochs] = useState(1);
  const [trainingMethod, setTrainingMethod] = useState("Embedding");
  const btnRef: any = useRef();

  const [repoToEdit, setRepoToEdit] = useState<any>(null);

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
        <DrawerHeader>Configure Repo: {repo.name}</DrawerHeader>
        <DrawerBody>
          <Setup
            repo={repo}
            trainingMethod={trainingMethod}
            cycles={cycles}
            frequency={frequency}
            epochs={epochs}
            setCycles={setCycles}
            setFrequency={setFrequency}
            setEpochs={setEpochs}
            setTrainingMethod={setTrainingMethod}
          />
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            bgGradient={"linear(to-r, blue.500,teal.500)"}
            color={"white"}
            onClick={() => {
              onSubmit(repo);
              onClose();
            }}
          >
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default RepoSetupModal;
