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
  Badge,
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

const Setup = ({
  repo,
  trainingMethod,
  cycles,
  frequency,
  epochs,
  setCycles,
  setFrequency,
  setEpochs,
  setTrainingMethod,
}: any) => {
  const owner = repo?.owner?.login || repo?.owner;
  const name = repo?.name || repo?.repo;

  return (
    <>
      <Box
        width="100%"
        border="1px solid lightgray"
        rounded="lg"
        p={4}
        mb={2}
        gap={2}
      >
        <Flex flexDirection="row" alignItems="center" gap={2}>
          <FaCrown />
          <Text>{owner}</Text>
        </Flex>
        <Flex flexDirection="row" alignItems="center" gap={2}>
          <MdLabel />
          <Text>{name}</Text>
        </Flex>
        <Flex flexDirection="row" alignItems="center" gap={2}>
          <BiGitBranch />
          <Text>main</Text>
        </Flex>
        <Divider my={2} />
        <Badge mb={1}>Trained using {trainingMethod}</Badge>
        <Text>Train using {cycles} sample files</Text>
        <Text>Train {frequency} time(s) every month</Text>
        <Text>Run {epochs} epochs each cycle</Text>
        <Divider my={2} />
        <Text>
          Estimated Price Per Month: $
          {/* A 0 is added to this calculation as we have nothing else to add */}
          {calculateTotalCost(
            [
              {
                frequency: frequency,
                epochs: epochs,
                sample_size: cycles,
              },
            ],
            0
          )}
        </Text>
      </Box>
      <Flex gap={2} flexDirection="column">
        <SliderInput
          label="Train on"
          increment={5}
          max={100}
          Icon={PhoneIcon}
          tooltip="Sample Size is the number of files to train on. If this is set to 10, 10 important files will be selected from the repo to train on."
          value={cycles}
          onChange={(e: any) => setCycles(e)}
        />
        <SliderInput
          label="Frequency"
          increment={10}
          max={300}
          Icon={PhoneIcon}
          tooltip="Frequency is the number of commits between running a new training cycle. If this is set to 3, a new training cycle will run every 3 commits."
          value={frequency}
          onChange={(e: any) => setFrequency(e)}
        />
        {trainingMethod === "Fine-tuning" && (
          <SliderInput
            label="Run Epochs"
            increment={1}
            max={5}
            Icon={PhoneIcon}
            tooltip="Epochs only show on fine-tuning. This is the number of times the model will train on the same data, allowing it to understand more about the same data."
            value={epochs}
            onChange={(e: any) => setEpochs(e)}
          />
        )}
      </Flex>
    </>
  );
};

export default Setup;
