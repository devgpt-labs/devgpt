"use client";
import { useEffect, useState } from "react";
import {
  Flex,
  Text,
  useColorMode,
  IconButton,
  Button,
  Tag,
  TagLabel,
  Tooltip,
} from "@chakra-ui/react";

import { supabase } from "@/utils/supabase";
import {
  BiGitBranch,
  BiGitPullRequest,
  BiRefresh,
  BiCopy,
} from "react-icons/bi";
import { FiExternalLink } from "react-icons/fi";
import createBranch from "@/utils/github/createBranch";
import { PlusSquareIcon } from "@chakra-ui/icons";

// Icons
import {
  FaRegThumbsDown,
  FaRegThumbsUp,
  FaThumbsDown,
  FaThumbsUp,
} from "react-icons/fa";

// Stores
import repoStore from "@/store/Repos";
import authStore from "@/store/Auth";

interface FeedbackProps {
  models: any;
  response: string;
  messages: any;
  handleRegenerate: () => void;
  handleNew: () => void;
}

const Feedback = ({
  models,
  response,
  messages,
  handleRegenerate,
  handleNew,
}: FeedbackProps) => {
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [branchName, setBranchName] = useState<string>("");
  const [pullRequest, setPullRequest] = useState<string>("");
  const { repo }: any = repoStore();
  const { user, session }: any = authStore();
  const { colorMode } = useColorMode();

  // Find the model in models that matches repo
  const model = models?.find(
    (model: any) => model.repo === repo.repo && model.owner === repo.owner
  );

  useEffect(() => {
    setFeedbackGiven(false);
  }, [response, messages]);

  if (!model) return null;

  // Slice the last two messages and remove the id and created_at. We can then add this to supabase.
  const newestMessages = messages
    .slice(messages.length - 2, messages.length)
    .map((message: any) => {
      const { id, createdAt, ...rest } = message;
      return rest;
    });

  if (!model.output) return null;

  const handleGoodAnswerClick = async () => {
    // TODO: Readd this
    // updateModel();
    setFeedbackGiven(true);
  };

  const handleBadAnswerClick = async () => {
    setFeedbackGiven(true);
  };

  if (feedbackGiven) {
    return (
      <Flex
        mt={3}
        alignItems="center"
        justifyContent="center"
        flexDirection="row"
        rounded="lg"
        border={
          colorMode === "light" ? "1px solid #CBD5E0" : "1px solid #1a202c"
        }
        p={2}
      >
        <Text>Thank you for your feedback</Text>
      </Flex>
    );
  }

  if (response === "") {
    return null;
  }

  return (
    <Flex
      mt={3}
      flexDirection="row"
      rounded="lg"
      border={colorMode === "light" ? "1px solid #CBD5E0" : "1px solid #1a202c"}
      p={5}
      justifyContent="space-between"
    >
      <Flex flexDirection="column" maxW="75%" mr={2}>
        <Text>
          What would you like to do next on repo{" "}
          <strong>
            {repo.repo} / {repo.owner}
          </strong>
          ?
        </Text>
        <Text fontSize={14} color="gray.500">
          tip goes here
        </Text>
      </Flex>
      <Flex flexDirection="row" justifyContent="center" alignItems="center">
        <Flex width="100%" flexDirection="row" gap={2} bg="red">
          <Tooltip label="Thumbs Down" placement="top">
            <IconButton
              aria-label="Thumbs Down"
              icon={<FaRegThumbsDown />}
              onClick={handleBadAnswerClick}
            />
          </Tooltip>
          <Tooltip label="Thumbs Up" placement="top">
            <IconButton
              aria-label="Thumbs Up"
              icon={<FaRegThumbsUp />}
              onClick={handleGoodAnswerClick}
            />
          </Tooltip>

          <Tooltip
            label={pullRequest ? "Copy Git Command" : "Raise Branch"}
            placement="top"
          >
            <IconButton
              onClick={() => {
                pullRequest
                  ? window.open(pullRequest)
                  : createBranch(
                    session.provider_token,
                    false,
                    setBranchName,
                    setPullRequest
                  );
              }}
              _hover={{
                transform: "translateY(-4px)",
                transition: "all 0.2s ease-in-out",
              }}
              aria-label="Join Discord"
              icon={
                <Flex flexDirection="row" px={3}>
                  {pullRequest ? <BiCopy /> : <BiGitBranch />}
                  {branchName &&
                    `git checkout ${branchName.substring(0, 10)}...`}
                </Flex>
              }
            />
          </Tooltip>
          <Tooltip label={pullRequest ? "Open PR" : "Raise PR"} placement="top">
            <IconButton
              _hover={{
                transform: "translateY(-4px)",
                transition: "all 0.2s ease-in-out",
              }}
              aria-label="Join Discord"
              onClick={() => {
                pullRequest
                  ? window.open(pullRequest)
                  : createBranch(
                    session.provider_token,
                    false,
                    setBranchName,
                    setPullRequest
                  );
              }}
              icon={
                <Flex flexDirection="row" px={3}>
                  {pullRequest ? <FiExternalLink /> : <BiGitPullRequest />}
                  {pullRequest && (
                    <Text ml={2}>{pullRequest.substring(0, 10)}...</Text>
                  )}
                </Flex>
              }
            />
          </Tooltip>
          <Tooltip label="New Prompt" placement="top">
            <IconButton
              _hover={{
                transform: "translateY(-4px)",
                transition: "all 0.2s ease-in-out",
              }}
              aria-label="Join Discord"
              onClick={handleNew}
              icon={
                <Flex flexDirection="row" px={3}>
                  <PlusSquareIcon />
                </Flex>
              }
            />
          </Tooltip>
          <Tooltip label="Regenerate" placement="top">
            <IconButton
              _hover={{
                transform: "translateY(-4px)",
                transition: "all 0.2s ease-in-out",
              }}
              onClick={handleRegenerate}
              aria-label="Join Discord"
              icon={
                <Flex flexDirection="row" px={3}>
                  <BiRefresh />
                </Flex>
              }
            />
          </Tooltip>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Feedback;
