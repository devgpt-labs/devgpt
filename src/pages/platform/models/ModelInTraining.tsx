import { useEffect, useState } from "react";
import {
  Flex,
  Text,
  Box,
  Badge,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  Spinner,
  useColorMode,
} from "@chakra-ui/react";
import createModelID from "@/utils/createModelID";

const ModelInTraining = ({ model, trainingLogs }: any) => {
  const [waitingTime, setWaitingTime] = useState<any>(0); // 0
  const [status, setStatus] = useState<any>(null); // null
  const { colorMode } = useColorMode();

  const { output, frequency, owner, repo, branch }: any = model;

  // Check training logs to see if one with this model_id exists, with fulfilled false
  const trainingLog = trainingLogs.map((log: any) => {
    if (
      log.fulfilled === false &&
      log.model_id === createModelID(model.repo, model.owner, model.branch)
    ) {
      return true;
    }
    return false;
  });
  console.log(trainingLog);

  // If the training log doesn't include true, then we don't need to render this component
  if (!trainingLog.includes(true)) return null;

  // If the training
  if (!model) return null;

  return (
    <Box
      p={4}
      mb={2}
      borderRadius={10}
      bg={colorMode === "light" ? "white" : "black"}
    >
      <Flex flexDirection="row" justifyContent="space-between">
        <Flex flexDirection="row" alignItems="center" gap={2}>
          <Badge>Training</Badge>
          <Text fontSize={14}>Collecting training data...`</Text>
          <Spinner size="sm" />
        </Flex>
        <Flex flexDirection="column" alignItems="flex-end">
          <Text fontSize={14}>
            {owner} / {repo} / {branch}
          </Text>
          {/* <Text fontSize={14}>
            frequency: {frequency} /
            sample size:{sample_size} /
            method: {training_method} /
            epochs: {epochs}
          </Text> */}
        </Flex>
      </Flex>

      <Slider
        aria-label="slider-ex-2"
        defaultValue={40}
        colorScheme="blue"
        isReadOnly={true}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
      </Slider>
    </Box>
  );
};

export default ModelInTraining;
