"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Input,
  Tag,
  SlideFade,
  Text,
  Flex,
  useToast,
  Tooltip,
  Kbd,
  Spinner,
} from "@chakra-ui/react";
import { FC, FormEvent } from "react";
import { LuSend } from "react-icons/lu";
import { BsHourglassSplit } from "react-icons/bs";

//stores
import repoStore from "@/store/Repos";
import authStore from "@/store/Auth";
import messageStore from "@/store/Messages";

interface Props {
  promptCount: number;
  prompt: string;
  setPrompt: (_prompt: string) => void;
  onSubmit: (_prompt: string) => void;
  isLoading: boolean;
}

export const PromptInput: FC<Props> = (props) => {

  const { repo, repoWindowOpen, lofaf, setRepoWindowOpen }: any = repoStore();
  const { messages }: any = messageStore();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (props.prompt?.length === 0 || props.isLoading) return null;
    setHasSentAMessage(true);
    props.onSubmit(props.prompt, e);
  };






  if (messages?.length === 0 && repo.repo) {
    return (
      <Flex flexDirection="row" alignItems="center" mt={5}>
        <Spinner />
        <Text ml={4}>
          Training your model with context from your codebase...
        </Text>
      </Flex>
    );
  }

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="column" alignItems="flex-start">

        <form
          className="-mx-5 px-5 mt-5 flex gap-2 items-center"
          onSubmit={onSubmit}
        >
          <Tooltip
            placement="top"
            isOpen
            label={!hasSentAMessage && "Write your task for DevGPT here!"}
          >
            <Input

              onChange={(e) => {
                props.setPrompt(e.target.value);
              }}
              value={props.prompt}
              type="text"
              id="message"
              autoComplete="off"
              name="message"
              required
              className=" bg-transparent rounded-md p-4 flex-1 max-h-56 focus:ring-0 focus:outline-none"
              placeholder="Enter your task, e.g. Create a login page, or use @ to select a file from your repo."
            />
          </Tooltip>
          <Button
            bgGradient="linear(to-tr, teal.500, blue.500)"
            disabled={props.isLoading}
            type="submit"
            px={6}
            _hover={{ bg: "slate.600" }}
            cursor="pointer"
          >
            {props.isLoading ? (
              <BsHourglassSplit color="white" />
            ) : (
              <LuSend color="white" />
            )}
          </Button>
        </form>
        <SlideFade in={hasSentAMessage} offsetY="20px">
          <Text mt={5}>{previousPrompt}</Text>
        </SlideFade>

      </Flex>
      );
};
