import React, { } from "react";
import {
  Text,
  Flex,
  Tooltip,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
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
export default SliderInput;
