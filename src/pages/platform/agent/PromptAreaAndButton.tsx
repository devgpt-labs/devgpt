import React, { useState } from "react";
import {
  Button,
  Flex,
  Textarea,
  Spinner,
  useToast,
  Text,
  Link,
} from "@chakra-ui/react";
import repoStore from "@/store/Repos";
import authStore from "@/store/Auth";
import { supabase } from "@/utils/supabase";

const PromptAreaAndButton = () => {
  const { repo }: any = repoStore();
  const { user }: any = authStore();
  const [prompt, setPrompt] = useState("");
  const toast = useToast();

  const handleTaskFailed = async (id: any) => {
    if (!supabase) {
      console.warn("No supabase");
      return;
    }

    const { data, error } = await supabase
      .from("prompts")
      .update({ tag: "FAILED" })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      console.log(data);
    }
  };

  const handleSubmit = async (prompt: string) => {
    if (prompt.length < 3) {
      toast({
        title: "Task too short",
        description: "Please enter a longer task.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!supabase) {
      console.warn("No supabase");
      return;
    }

    const { data, error } = await supabase
      .from("prompts")
      .insert([
        {
          email_address: user.email,
          tag: "In-Progress",
          prompt: prompt,
          repo: repo.repo,
          owner: repo.owner,
          source: "DevGPT Web",
        },
      ])
      .select("*");

    setPrompt("");

    if (error) {
      toast({
        title: "Error",
        description: "There was an error submitting your task.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      return;
    }

    toast({
      title: "Task submitted",
      description: "Your task has been submitted to the queue.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });

    //fetch("https://devgpt-taskqueue-production.up.railway.app/task-queue", {
    fetch("http://localhost:4000/task-queue", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: data[0].id,
      }),
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        // Set the tasks tag to 'failed' in prompts
        handleTaskFailed(data[0].id);
      });
  };

  const [hoveringButton, setHoveringButton] = useState(false);

  return (
    <Flex flexDirection="column" mb={4}>
      <Flex flexDirection="column" alignItems={"flex-start"}>
        <Text>
          {repo.owner} / {repo.repo}
        </Text>
        <Textarea
          mt={3}
          mb={3}
          maxH="75vh"
          // On focus, add a glow
          _focus={{
            boxShadow: "0 0 0 0.4rem rgba(0, 255, 0, .22)",
            borderColor: "green.500",
          }}
          // On hover, add a glow
          _hover={{
            boxShadow: "0 0 0 0.8rem rgba(0, 255, 0, .12)",
            borderColor: "green.500",
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

            // If key equals enter, submit
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(prompt);
            }
          }}
        />

        <Flex w="full" justifyContent="space-between" mt="2">
          <Link href="https://docs.devgpt.com/february-labs/product-guides/prompting">
            <Text textDecoration={"underline"} color="gray" fontSize={"sm"}>
              Best practices for prompting
            </Text>
          </Link>

          <Button
            bg="#2da042"
            onMouseOver={() => setHoveringButton(true)}
            onMouseLeave={() => setHoveringButton(false)}
            color="white"
            width="10rem"
            onClick={async (e: any) => {
              handleSubmit(prompt);
            }}
          >
            {hoveringButton ? "Submit task" : "Start new task"}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default PromptAreaAndButton;
