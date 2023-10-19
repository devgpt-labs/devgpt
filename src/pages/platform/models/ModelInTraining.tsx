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
  const trainingLog = trainingLogs.filter((log: any) => {
    if (log.model_id === createModelID(model.repo, model.owner, model.branch)) {
      return log;
    }
  });

  // If the training log doesn't include true, then we don't need to render this component

  useInterval(() => {
    // update the slider over a course of 150 seconds

    const time = 150000; // 150 seconds
    const interval = 1000; // 1 second
    const total = time / interval;
    const percent = 100 / total;

    setSliderValue((prev) => prev + percent);
  }, 500); // 500 milliseconds

  if (!model) return null;
  if (trainingLog.length === 0) return null;

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
