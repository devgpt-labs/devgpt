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
    <Tooltip placement="right" label={tooltip}>
      <Flex gap={2} flexDirection="column">
        <Flex gap={2}>
          <Slider
            aria-label={label}
            defaultValue={value}
            onChange={onChange}
            min={0}
            max={max}
            step={increment}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb zIndex={1} />
          </Slider>
        </Flex>
      </Flex>
    </Tooltip>
  );
};

const RepoSetupModal = ({ isOpen, onClose, onOpen, repo, onSubmit }: any) => {
  const [cycles, setCycles] = useState(10);
  const [frequency, setFrequency] = useState(1);
  const [epochs, setEpochs] = useState(2);
  const [trainingMethod, setTrainingMethod] = useState("Embedding");
  const btnRef: any = useRef();

  if (!repo) return null;

  return (
    <Drawer
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
          <Flex gap={2} flexDirection="column">
            <Input placeholder="model name" />
            <ReadOnlyInput
              Icon={FaCrown}
              tooltip="Owner is..."
              placeholder="Owner"
              value={repo.owner.login}
              type="text"
            />
            <ReadOnlyInput
              Icon={MdLabel}
              tooltip="Repo is..."
              placeholder="Repo"
              value={repo.name}
              type="text"
            />
            <ReadOnlyInput
              Icon={BiGitBranch}
              tooltip="Branch is..."
              placeholder="Branch"
              value="main"
              type="text"
            />
            <Divider />
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                Model Training Method
              </MenuButton>
              <MenuList defaultValue={trainingMethod} zIndex={1000}>
                <MenuItem>Embedding</MenuItem>
                <MenuItem>Fine-tuning</MenuItem>
              </MenuList>
            </Menu>
            <Text>Train on {cycles} files</Text>
            <SliderInput
              increment={5}
              max={100}
              Icon={PhoneIcon}
              tooltip="Sample Size is the number of files to train on. If this is set to 10, 10 important files will be selected from the repo to train on."
              label="Training Sample Size"
              value={cycles}
              onChange={(e: any) => setCycles(e)}
            />
            <Text>Train every {frequency} commits</Text>
            <SliderInput
              increment={10}
              max={300}
              Icon={PhoneIcon}
              tooltip="Frequency is the number of commits between running a new training cycle. If this is set to 3, a new training cycle will run every 3 commits."
              label="Frequency"
              value={frequency}
              onChange={(e: any) => setFrequency(e)}
            />
            <Text>Run {epochs} epochs per training session</Text>
            <SliderInput
              increment={1}
              max={5}
              Icon={PhoneIcon}
              tooltip="Epochs only show on fine-tuning. This is the number of times the model will train on the same data, allowing it to understand more about the same data."
              label="Epochs"
              value={epochs}
              onChange={(e: any) => setEpochs(e)}
            />
          </Flex>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            bgGradient={"linear(to-r, teal.500,blue.500)"}
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
