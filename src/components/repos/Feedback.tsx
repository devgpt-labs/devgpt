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
import { PlusSquareIcon } from "@chakra-ui/icons";
const { createBranch } = require("git-connectors")

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
  handleRegenerate: () => void;
  handleNew: () => void;
}

const Feedback = ({
  models,
  response,
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
  }, [response]);

  // if (!model) return null;

  // // Slice the last two messages and remove the id and created_at. We can then add this to supabase.
  // const newestMessages = messages
  //   .slice(messages.length - 2, messages.length)
  //   .map((message: any) => {
  //     const { id, createdAt, ...rest } = message;
  //     return rest;
  //   });

  // if (!model.output) return null;

  const blobs = [
    {
      filePath: "app2.js",
      content: "const a = b",
      comments: "i did this",
      examples: ["app.js"],
    },
  ];

  const auth = {
    owner: "tom-lewis-code",
    repo: "toms-public-sand-pit",
    editor: "tom",
  };

  const branch = {
    branch_name: "test-branch",
    pr_title: "my title",
    pr_body: "my body",
    randomly_generated_4_digit_number: Math.floor(1000 + Math.random() * 9000),
  };

  const handleRaiseBranch = async (pr: boolean) => {
    if (!session?.provider_token) return;

    // Pr decides if a PR should be raised or not, if false, it will only raise a branch. If true, it will raise a PR.

    if (pr) {
      setPullRequestLoading(true);
    } else {
      setBranchLoading(true);
      setPullRequestLoading(true);
    }

    const data = await createBranch(
      blobs,
      auth,
      branch,
      session.provider_token,
      pr
    );

    if (data?.branch_name) {
      setBranchName(data.branch_name);
    }

    if (data?.pull_request) {
      setPullRequest(data.pull_request);
    }

    setBranchLoading(false);
    setPullRequestLoading(false);
  };

  const handleGoodAnswerClick = async () => {
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
          label={branchName ? "Copy Git Command" : "Create Branch"}
          placement="top"
        >
          <IconButton
            overflow="hidden"
            onClick={() => {
              branchName
                ? navigator.clipboard.writeText(branchName)
                : handleRaiseBranch(false);
            }}
            _hover={{
              transform: "translateY(-4px)",
              transition: "all 0.2s ease-in-out",
            }}
            aria-label="Join Discord"
            icon={
              <>
                {branchLoading ? (
                  <Spinner size="sm" />
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
            overflow="hidden"
            _hover={{
              transform: "translateY(-4px)",
              transition: "all 0.2s ease-in-out",
            }}
            aria-label="Join Discord"
            onClick={() => {
              pullRequest ? window.open(pullRequest) : handleRaiseBranch(true);
            }}
            icon={
              <>
                {pullRequestLoading ? (
                  <Spinner size="sm" />
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
            overflow="hidden"
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
            overflow="hidden"
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

  // if (response === "") {
  //   return null;
  // }

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
            bg='blue.500'
            aria-label="Thumbs Up"
            px={4}
            icon={
              <>
                <FaRegThumbsUp color='white' />
                <Text color='white' ml={2}>Good</Text>
              </>
            }
            onClick={handleGoodAnswerClick}
          />
        </Tooltip>
        <Tooltip label="Thumbs Down" placement="top">
          <IconButton
            px={4}
            aria-label="Thumbs Down"
            icon={
              <>
                <FaRegThumbsDown />
                <Text ml={2}>Bad</Text>
              </>
            }
            onClick={handleBadAnswerClick}
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
};

export default Feedback;
