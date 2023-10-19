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
  useTimeout,
  useInterval,
} from "@chakra-ui/react";
import createModelID from "@/utils/createModelID";

const ModelInTraining = ({ model, trainingLogs }: any) => {
  const { colorMode } = useColorMode();
  const [sliderValue, setSliderValue] = useState(0);

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

  // If the training log doesn't include true, then we don't need to render this component

  useInterval(() => {
    // count down from 2m30s updating the slider value every second

    const time = 150000;
    const interval = 1000;
    const total = time / interval;
    const percent = 100 / total;

    setSliderValue((prev) => prev + percent);
  }, 200);

  if (!trainingLog.includes(true)) return null;
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
          <Text fontSize={14}>
            {sliderValue > 100 ? "Completing Soon" : "Training"}
          </Text>
          <Spinner size="sm" />
        </Flex>
        <Flex flexDirection="column" alignItems="flex-end">
          <Text fontSize={14}>
            {owner} / {repo} / {branch}
          </Text>
        </Flex>
      </Flex>
      <Slider
        aria-label="slider-ex-2"
        value={sliderValue}
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
