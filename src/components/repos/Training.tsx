"use client";
import {
  Flex,
  Text,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from "@chakra-ui/react";

const stages = [
  'generating training data',
  'training data generated',
  'training model with data',
  'model trained',
]

const Training = () => {
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
        Repos being trained:
      </Text>
      <Text fontSize={14}>february-labs / api / main (training)</Text>
      <Slider my={2} aria-label='slider-ex-2' colorScheme='blue' defaultValue={30}>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
      </Slider>
      <Flex justifyContent='space-between'>
        <Text fontSize={14}>Elapsed: 2 minutes</Text>
        <Text fontSize={14}>Estimated: 5 minutes</Text>
      </Flex>
      {/* <Accordion defaultIndex={[0]} allowMultiple>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex='1' textAlign='left'>
                Section 1 title
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat.
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex='1' textAlign='left'>
                Section 2 title
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat.
          </AccordionPanel>
        </AccordionItem>
      </Accordion> */}
    </Flex>
  );
};

export default Training;
