import React, { useEffect } from "react";
import { Flex, Text, Grid, Heading, Input, Button, Tag } from "@chakra-ui/react";
import SuggestionTag from "./SuggestionTag";
import { LuSend } from "react-icons/lu";

const MainEducation = ({ setPrompt, theme }: any) => {

  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      w={"full"}
    >
      <Heading mb={6} size="lg">
        Popular prompts
      </Heading>
      <Grid templateColumns="repeat(2,1fr)">
        <SuggestionTag
          label="Write Unit Tests"
          suggestion="for my sign up page"
          onClick={() => setPrompt("Write Unit Tests for my sign up page")}
          theme={theme}
          Icon={LuSend}

        />
        <SuggestionTag
          label="Fix a Bug"
          suggestion="in my main app file"
          onClick={() => setPrompt("Fix a Bug in my main app file")}
          theme={theme}
          Icon={LuSend}

        />
        <SuggestionTag
          label="Create a List Component"
          suggestion="in the src folder"
          onClick={() => setPrompt("Create a List Component in the src folder")}
          theme={theme}
          Icon={LuSend}

        />
        <SuggestionTag
          label="Refactor the Code"
          suggestion="in my forgot password function"
          onClick={() =>
            setPrompt("Refactor the Code in my forgot password function")
          }
          theme={theme}
          Icon={LuSend}

        />
      </Grid>
    </Flex>
  );
};

export default MainEducation;
