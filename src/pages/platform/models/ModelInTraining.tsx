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

const ModelInTraining = ({ model }: any) => {
  const {
    owner,
    repo,
    branch,
    output,
    retrain,
    frequency,
    sample_size,
    training_method,
    epochs,
  }: any = model;

  const { colorMode } = useColorMode();

  // If the output is null, set value to 0, if the length of it is 1, set the value to 40, if the length is more than 1, return nothing
  let status;

  if (output === null) {
    status = "training";
  } else if (retrain) {
    status = "training";
  } else if (JSON.parse(output).length === 1) {
    status = "failed";
  } else {
    return null;
  }

  // If the frequency is less than 5, waiting time is about 1:30 minutes, if the frequency is less than 10, the waiting time is about 2:30 minutes.

  const waitingTime = () => {
    // return the time in minutes / seconds format mm:ss
    if (frequency < 5) {
      return "1:30 minutes";
    } else if (frequency < 10) {
      return "2:30 minutes";
    } else {
      return "3:30 minutes";
    }
  }


  return (
    <Box
      p={4}
      mb={2}
      borderRadius={10}
      bg={colorMode === "light" ? "white" : "black"}
    >
      <Flex flexDirection="row" justifyContent="space-between">
        <Flex flexDirection="row" alignItems="center" gap={2}>
          <Badge>
            {status === "training" ? `Training` : `Failed Training`}
          </Badge>
          <Text fontSize={14}>
            {status === "training"
              ? `Collecting training data...`
              : `Retrying now... Estimated time: ${waitingTime}.`}
          </Text>
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
        defaultValue={status === "training" ? 60 : 10}
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
