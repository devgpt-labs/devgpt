import React, { useState } from "react";
import { Button, Flex, Input, Spinner, Text, Code } from "@chakra-ui/react";
import authStore from "@/store/Auth";

interface PromptAreaAndButtonProps {
  prompt: string;
  selectedFile: any;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  handleUseTabSuggestion: (file: any) => void;
  setPrompt: (prompt: string) => void;
  submitChecks: (isReset: boolean) => Promise<boolean>;
  setHasBeenReset: (hasBeenReset: boolean) => void;
  handleSubmit: (prompt: any) => void;
}

const PromptAreaAndButton = ({
  prompt,
  selectedFile,
  loading,
  setLoading,
  handleUseTabSuggestion,
  setPrompt,
  submitChecks,
  setHasBeenReset,
  handleSubmit,
}: PromptAreaAndButtonProps) => {
  const { isPro }: any = authStore();
  const [show, setShow] = useState(false);
  const [hoveringButton, setHoveringButton] = useState(false);

  if (!isPro) return null;

  return (
    <Flex flexDirection='column'>
      <Flex flexDirection="row" my={2}>
        <Input
          // On focus, add a glow
          _focus={{
            boxShadow: "0 0 0 0.5rem rgba(0, 123, 255, .22)",
            borderColor: "blue.500",
          }}
          // On hover, add a glow 
          _hover={{
            boxShadow: "0 0 0 1.0rem rgba(0, 123, 255, .12)",
            borderColor: "blue.500",
          }}
          autoFocus
          className="fixed w-full max-w-md bottom-0 rounded shadow-xl p-2 dark:text-black"
          value={prompt}
          placeholder="Enter your task, e.g. Create a login page, or use @ to reference a file from your repo."
          onChange={(e: any) => {
            setPrompt(e.target.value);
          }}
          onKeyDown={async (e: any) => {
            if (prompt.length < 3) {
              return;
            }

            if (loading) return;

            // If key equals tab, autocomplete
            if (e.key === "Tab") {
              e.preventDefault();
              handleUseTabSuggestion(selectedFile[0]);
              return;
            }

            // If key equals enter, submit
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              const checks = await submitChecks(false);
              if (!checks) return null;
              setHasBeenReset(false);
              handleSubmit(prompt);
            }
          }}
        />

        <Button
          // On hover, change the text to 'Ready?'
          bg="blue.500"
          // On hover, animate the width to 0
          // bgGradient="linear(to-r, blue.500, teal.500)"
          isDisabled={loading}
          onMouseOver={() => setHoveringButton(true)}
          onMouseLeave={() => setHoveringButton(false)}
          color="white"
          ml={4}
          width="10rem"
          onClick={async (e: any) => {
            setLoading(true);
            const checks = await submitChecks(false);
            if (!checks) {
              return null;
            }
            setHasBeenReset(false);
            handleSubmit(prompt);
          }}
        >
          {loading ? <Spinner size="sm" /> : hoveringButton ? 'Ready?' : "Generate Code"}
        </Button>
      </Flex>
      {/* <Text
        color="gray.400"
        cursor="pointer"
        textDecoration={"underline"}
        onClick={() => {
          setShow(!show);
        }}
      >
        View how to improve prompts
      </Text>
      {show && (
        <>
          <Text>
            Use the <Code>@</Code> command to target files
          </Text>
          <Text>Provide specific detail about your task only</Text>
          <Text>You can disable this feature in the settings</Text>
        </>
      )} */}
    </Flex>


  );
};

export default PromptAreaAndButton;
