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

const ModelInTraining = ({ model }: any) => {
  const { colorMode } = useColorMode();
  const [sliderValue, setSliderValue] = useState(0);

  useInterval(() => {
    // update the slider over a course of 150 seconds

    const time = 150000; // 150 seconds
    const interval = 1000; // 1 second
    const total = time / interval;
    const percent = 100 / total;

    setSliderValue((prev) => prev + percent);
  }, 500); // 500 milliseconds

  if (!model) return null;

  return (
    <Box
      p={4}
      mb={2}
      borderRadius={10}
      bg={colorMode === "light" ? "white" : "black"}
    >
      <Flex flexDirection="row" justifyContent="space-between">
        <Flex flexDirection="column" alignItems="center" gap={2}>
          <Flex flexDirection="row" alignItems="center" gap={2}>
            <Badge fontSize={14}>
              {sliderValue > 100 ? "Completing Soon" : "Training"}
            </Badge>
            <Spinner size="sm" />
          </Flex>
        </Flex>
        <Flex flexDirection="column" alignItems="flex-end">
          <Text fontSize={14}>{model.owner}</Text>
          <Text fontSize={14}>{model.repo}</Text>
          <Text fontSize={14}>{model.branch}</Text>
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
