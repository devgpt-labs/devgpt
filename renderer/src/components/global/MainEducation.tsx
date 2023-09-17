import React, { useEffect } from "react";
import {
  Flex,
  Text,
  Grid,
  Heading,
  Input,
  Button,
  Tag,
} from "@chakra-ui/react";
import SuggestionTag from "./SuggestionTag";
import { LuSend } from "react-icons/lu";

const MainEducation = ({ setPrompt, theme }: any) => {
  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      flexWrap='wrap'
      w={"full"}
    >
      <Heading mb={6} size="lg">
        Popular prompts
      </Heading>
      <Grid templateColumns="repeat(2,1fr)">
        <SuggestionTag
          label="Write Unit Tests"
          suggestion="for my sign up page"
          theme={theme}
          Icon={LuSend}
        />
        <SuggestionTag
          label="Fix A Bug"
          suggestion="in my main app file"
          theme={theme}
          Icon={LuSend}
        />
        <SuggestionTag
          label="Create a Table Component"
          suggestion="in the src folder"
          theme={theme}
          Icon={LuSend}
        />
        <SuggestionTag
          label="Refactor The Code"
          suggestion="in my forgot password function"
          theme={theme}
          Icon={LuSend}
        />
        <SuggestionTag
          label="Write A Utility Function"
          suggestion="to sum up all the numbers in an array"
          theme={theme}
          Icon={LuSend}
        />
        <SuggestionTag
          label="Edit The Text"
          suggestion="in my login file"
          theme={theme}
          Icon={LuSend}
        />

      </Grid>
    </Flex>
  );
};

export default MainEducation;
