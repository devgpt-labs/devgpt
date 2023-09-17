import { Heading, Tag, Text, Box, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

const SuggestionTag = ({
  label,
  suggestion,
  onClick,
  theme,
  Icon,
  complete,
  tutorial,
}: {
  label?: string;
  suggestion?: string;
  onClick?: any;
  theme?: any;
  Icon?: any;
  complete?: any;
  tutorial?: any;
}) => {
  return (
    <Tag
      w={340}
      onClick={onClick}
      cursor={!complete ? "pointer" : 'default'}
      color="white"
      borderRadius="0.5rem"
      backdropFilter="blur(10px)"
      bg="transparent"
      zIndex="50"
      m={2}
      p={4}
      flexDirection="row"
      alignItems="flex-start"
      justifyContent="space-between"
      _hover={
        !theme && !complete
          ? {
            bg: "white",
            color: "white",
            bgClip: "text",
            border: "1px solid",
            borderColor: tutorial ? complete ? 'green.500' : "orange.500" : !theme ? "blue.500" : "none"
          }
          : {}
      }
      bgGradient={tutorial ? complete ? 'linear(to-r, green.400, green.500)' : "linear(to-r, orange.400, orange.400)" : !theme ? "linear(to-r, blue.500, teal.500)" : "none"}
      border={tutorial ? complete ? 'linear(to-r, green.400, green.500)' : "linear(to-r, orange.400, orange.400)" : !theme ? "1px solid black" : "1px solid rgba(255, 255, 255, 0.08)"}
      boxShadow={!theme ? "inset 0 0 50px rgba(255, 255, 255, 0.15)" : "none"}
    >
      <Flex alignItems="flex-start" flexDirection="column">
        <Heading size="md" mb={2}>
          {label}
        </Heading>
        <Text fontSize={"18"}>{suggestion}</Text>
      </Flex>
      <Flex>
        {Icon ? (
          Icon
        ) : complete ? (
          <AiOutlineCheckCircle size={20} color="green.400" />
        ) : (
          <AiOutlineCloseCircle size={20} color="red.400" />
        )}
      </Flex>
    </Tag>
  );
};

export default SuggestionTag;