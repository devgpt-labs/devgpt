"use client";
import {
  Flex,
  Text,
  Slider,
  SliderTrack,
  SliderFilledTrack,
} from "@chakra-ui/react";

const Calculator = () => {
  return (
    <Flex
      mt={3}
      flexDirection="column"
      w="6xl"
      maxW="full"
      rounded="lg"
      boxShadow="0px 0px 900px 0px blue"
      border="1px solid #1a202c"
      p={5}
      overflow="hidden"
      shadow="2xl"
    >
      <Text mb={2}>
        Credit Calculator
      </Text>
      <Slider colorScheme="blue" defaultValue={100} isReadOnly={true} mb={1}>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
      </Slider>
    </Flex>
  );
};

export default Calculator;
