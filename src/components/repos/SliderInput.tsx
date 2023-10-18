import React, { } from "react";
import {
  Text,
  Flex,
  Tooltip,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Badge,
} from "@chakra-ui/react";

//stores
import { IoMdInformationCircle } from "react-icons/io";

const SliderInput = ({
  label,
  value,
  tooltip,
  Icon,
  onChange,
  increment,
  max,
  min,
  isDisabled
}: any) => {
  return (
    <Flex gap={2} flexDirection="column">
      <Tooltip placement="left" label={tooltip}>
        <Flex flexDirection="row" alignItems="center" gap={2}>
          <Text fontSize={14}>
            {label}
          </Text>
          <Badge>{value}</Badge>
          <IoMdInformationCircle />
        </Flex>
      </Tooltip>
      <Slider
        isDisabled={isDisabled}
        aria-label={label}
        defaultValue={value}
        onChange={onChange}
        min={min}
        max={max}
        step={increment}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb bgGradient="linear(to-r, blue.500,teal.500)" zIndex={1} />
      </Slider>
    </Flex>
  );
};
export default SliderInput;
