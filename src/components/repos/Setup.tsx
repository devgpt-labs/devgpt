import React from "react";
import {
  Text,
  Divider,
  Flex,
  Box,
  Badge,
  Input,
  Tooltip,
} from "@chakra-ui/react";
import { PhoneIcon } from "@chakra-ui/icons";
import { FaCrown } from "react-icons/fa";
import { MdLabel } from "react-icons/md";
import { BiGitBranch } from "react-icons/bi";
import SliderInput from "./SliderInput";
import { IoMdInformationCircle } from "react-icons/io";

//stores
import calculateTotalCost from "@/utils/calculateTotalCost";
import planIntegers from "@/configs/planIntegers";

const Setup = ({
  repo,
  trainingMethod,
  sampleSize,
  frequency,
  epochs,
  setSampleSize,
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
        border="solid 1px #3d4757"
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
        <Text>Train using {sampleSize} sample files</Text>
        <Text>Train {frequency} time(s) every month</Text>
        <Text>Run {epochs} epochs each cycle</Text>
      </Box>
      <Flex gap={2} flexDirection="column">
        <SliderInput
          label="Sample Size:"
          increment={3}
          max={planIntegers.individual.sample_size}
          min={5}
          Icon={PhoneIcon}
          tooltip="Sample Size is the number of files to train on. If this is set to 10, 10 important files will be selected from the repo to train on."
          value={sampleSize}
          onChange={(e: any) => setSampleSize(e)}
        />
        <SliderInput
          label="Cycles Frequency:"
          increment={1}
          max={planIntegers.individual.frequency}
          min={1}
          Icon={PhoneIcon}
          tooltip="Frequency is the number of commits between running a new training cycle. If this is set to 3, a new training cycle will run every 3 commits."
          value={frequency}
          onChange={(e: any) => setFrequency(e)}
        />
        <SliderInput
          isDisabled={true}
          label="Run Epochs:"
          increment={1}
          max={5}
          min={2}
          Icon={PhoneIcon}
          tooltip="Coming Soon: Epochs only show on fine-tuning. This is the number of times the model will train on the same data, allowing it to understand more about the same data."
          value={1}
          onChange={(e: any) => setEpochs(e)}
        />
        <>
          <Tooltip
            placement="left"
            label="Coming Soon: Branches will allow you to train on different branches of your repo. This is useful if you have a development branch that you want to train on, that is not your main branch."
          >
            <Flex flexDirection="row" alignItems="center" gap={2}>
              <Text fontSize={14}>Branch name</Text>
              <Badge>main</Badge>
              <IoMdInformationCircle />
            </Flex>
          </Tooltip>
          <Input placeholder="main" size="sm" isDisabled={true} />
        </>
      </Flex>
    </>
  );
};

export default Setup;
