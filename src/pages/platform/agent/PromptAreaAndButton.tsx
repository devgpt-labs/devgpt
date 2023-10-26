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
  handleInputChange: (e: any) => void;
  submitChecks: (isReset: boolean) => Promise<boolean>;
  setHasBeenReset: (hasBeenReset: boolean) => void;
  handleSubmit: (e: any) => void;
}

const PromptAreaAndButton = ({
  prompt,
  selectedFile,
  loading,
  setLoading,
  handleUseTabSuggestion,
  setPrompt,
  handleInputChange,
  submitChecks,
  setHasBeenReset,
  handleSubmit,
}: PromptAreaAndButtonProps) => {
  const { isPro }: any = authStore();
  const [show, setShow] = useState(false);

  if (!isPro) return null;

  return (
    <Flex flexDirection='column'>
      <Flex flexDirection="row" my={2}>
        <Input
          // border="solid 1px #3e68ff"
          // borderColor='#3e68ff'
          // shadow="0px 0px 5px 5px #3e68ff"
          autoFocus
          className="fixed w-full max-w-md bottom-0 rounded shadow-xl p-2 dark:text-black"
          value={prompt}
          placeholder="Enter your task, e.g. Create a login page, or use @ to reference a file from your repo."
          onChange={(e: any) => {
            setPrompt(e.target.value);
            handleInputChange(e);
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
              handleSubmit(e);
            }
          }}
        />

        <Button
          bg="blue.500"
          // bgGradient="linear(to-r, blue.500, teal.500)"
          isDisabled={loading}
          color="white"
          ml={4}
          width="10rem"
          onClick={async (e: any) => {
            setLoading(true);
            const checks = await submitChecks(false);
            if (!checks) {
              console.log("checks failed, stopping");
              return null;
            }
            setHasBeenReset(false);
            handleSubmit(e);
          }}
        >
          {loading ? <Spinner size="sm" /> : "Generate Code"}
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
