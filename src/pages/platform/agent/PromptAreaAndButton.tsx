import React, { useState } from "react";
import { Button, Flex, Textarea, Spinner } from "@chakra-ui/react";
import repoStore from "@/store/Repos";

const PromptAreaAndButton = () => {
  const { repo }: any = repoStore();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (prompt: string) => {
    const response = await fetch(
      "https://devgpt-taskqueue-production.up.railway.app/task-queue",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: prompt,
          repo: repo.repo,
          owner: repo.owner,
        }),
      }
    )
      .then((res) => res.json())
      .catch((err) => console.log(err));

    console.log(response);

  };

  const [hoveringButton, setHoveringButton] = useState(false);

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="column" alignItems={"flex-end"}>
        <Textarea
          maxH='75vh'
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
          // bgColor="#0d1116"
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

            // If key equals enter, submit
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              setLoading(true);
              handleSubmit(prompt);
            }
          }}
        />

        <Button
          mt={2}
          bg="#2da042"
          isDisabled={loading}
          onMouseOver={() => setHoveringButton(true)}
          onMouseLeave={() => setHoveringButton(false)}
          color="white"
          width="10rem"
          onClick={async (e: any) => {
            setLoading(true);
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
