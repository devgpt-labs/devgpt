import React, { useState } from "react";
import { Button, Flex, Textarea, Spinner } from "@chakra-ui/react";
import authStore from "@/store/Auth";

interface PromptAreaAndButtonProps {
  prompt: string;
  selectedFile: any;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  handleUseTabSuggestion: (file: any) => void;
  setPrompt: (prompt: string) => void;
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
  setHasBeenReset,
  handleSubmit,
}: PromptAreaAndButtonProps) => {
  const { isPro }: any = authStore();
  const [show, setShow] = useState(false);
  const [hoveringButton, setHoveringButton] = useState(false);

  if (!isPro) return null;

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="column" alignItems={"flex-end"}>
        <Textarea
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
          bgColor="#0d1116"
          autoFocus
          className="fixed w-full max-w-md bottom-0 rounded shadow-xl p-2 dark:text-black"
          value={prompt}
          placeholder="Copy and paste your software task here."
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

              setHasBeenReset(false);
              handleSubmit(prompt);
            }
          }}
        />

        <Button
          mt={2}
          bg="#2da042"
          // On hover, animate the width to 0
          // bgGradient="linear(to-r, blue.500, teal.500)"
          isDisabled={loading}
          onMouseOver={() => setHoveringButton(true)}
          onMouseLeave={() => setHoveringButton(false)}
          color="white"
          width="10rem"
          onClick={async (e: any) => {
            // setLoading(true);
            // setHasBeenReset(false);
            handleSubmit(prompt);
          }}
        >
          {loading ? (
            <Spinner size="sm" />
          ) : hoveringButton ? (
            "Submit task"
          ) : (
            "Start new task"
          )}
        </Button>
      </Flex>
    </Flex>
  );
};

export default PromptAreaAndButton;
