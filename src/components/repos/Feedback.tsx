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
  Spinner,
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
  const [pullRequestLoading, setPullRequestLoading] = useState<boolean>(false);
  const [branchLoading, setBranchLoading] = useState<boolean>(false);
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

  // if (!model) return null;

  // // Slice the last two messages and remove the id and created_at. We can then add this to supabase.
  // const newestMessages = messages
  //   .slice(messages.length - 2, messages.length)
  //   .map((message: any) => {
  //     const { id, createdAt, ...rest } = message;
  //     return rest;
  //   });

  // if (!model.output) return null;

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
        gap={2}
      >
        <Tooltip
          label={branchName ? "Copy Git Command" : "Raise Branch"}
          placement="top"
        >
          <IconButton
            onClick={() => {
              branchName
                ? window.open(pullRequest)
                : createBranch(
                  session.provider_token,
                  false,
                  setBranchName,
                  setPullRequest,
                  setBranchLoading
                );
            }}
            _hover={{
              transform: "translateY(-4px)",
              transition: "all 0.2s ease-in-out",
            }}
            aria-label="Join Discord"
            icon={
              <>
                {branchLoading ? (
                  <Spinner size='sm' />
                ) : (
                  <Flex flexDirection="row" px={3}>
                    {branchName ? <BiCopy /> : <BiGitBranch />}

                    {branchName ? (
                      <Text ml={2}>git checkout {branchName}</Text>
                    ) : (
                      <Text ml={2}>Create Branch</Text>
                    )}
                  </Flex>
                )}
              </>
            }
          />
        </Tooltip>
        <Tooltip
          label={pullRequest ? "Open Pull Request" : "Raise Pull Request"}
          placement="top"
        >
          <IconButton
            _hover={{
              transform: "translateY(-4px)",
              transition: "all 0.2s ease-in-out",
            }}
            aria-label="Join Discord"
            onClick={() => {
              // If pull request, window.open, if not, set loading to true and create a branch
              pullRequest
                ? window.open(pullRequest)
                : createBranch(
                  session.provider_token,
                  true,
                  setBranchName,
                  setPullRequest,
                  setPullRequestLoading
                );
            }}
            icon={
              <>
                {pullRequestLoading ? (
                  <Spinner size='sm' />
                ) : (
                  <Flex flexDirection="row" px={3}>
                    {pullRequest ? <FiExternalLink /> : <BiGitPullRequest />}
                    {pullRequest ? (
                      <Text ml={2}>{pullRequest.substring(0, 50)}...</Text>
                    ) : (
                      <Text ml={2}>Raise Pull Request</Text>
                    )}
                  </Flex>
                )}
              </>
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
                <Text ml={2}>New</Text>
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
                <Text ml={2}>Regenerate</Text>
              </Flex>
            }
          />
        </Tooltip>
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
      <Flex flex={0.7} flexDirection="column" maxW="75%" mr={2}>
        <Text>
          What would you like to do next on repo{" "}
          <strong>
            {repo.repo} / {repo.owner}
          </strong>
          ?
        </Text>
        <Text fontSize={14} color="gray.500">
          After you've rated the generation, more options will appear here.
        </Text>
      </Flex>
      <Flex
        flex={0.3}
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        gap={2}
      >
        <Tooltip label="Thumbs Up" placement="top">
          <IconButton
            aria-label="Thumbs Up"
            icon={<FaRegThumbsUp />}
            onClick={handleGoodAnswerClick}
          />
        </Tooltip>
        <Tooltip label="Thumbs Down" placement="top">
          <IconButton
            aria-label="Thumbs Down"
            icon={<FaRegThumbsDown />}
            onClick={handleBadAnswerClick}
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
};

export default Feedback;
