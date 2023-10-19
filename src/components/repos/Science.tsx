"use client";
import { useEffect, useState } from "react";
import { Flex, Text, useColorMode, Skeleton, Button } from "@chakra-ui/react";
import { supabase } from "@/utils/supabase";

// Icons
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";

// Stores
import repoStore from "@/store/Repos";

const Science = ({ models, response, messages }: any) => {
  const { repo }: any = repoStore();
  const [feedbackGiven, setFeedbackGiven] = useState(false);
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

  const existingMessages = JSON?.parse(model?.output);
  const newMessages = [...existingMessages, ...newestMessages];

  // Update the model in supabase with the new messages
  const updateModel = async () => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("models")
      .update({
        improvements: JSON.stringify(newestMessages),
        output: JSON.stringify(newMessages),
      })
      .match({
        id: model.id,
      });

    if (error) console.log(error);
  };

  const handleGoodAnswerClick = async () => {
    updateModel();
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
      justifyContent='space-between'
    >
      <Flex flexDirection="column" >
        <Text>
          How did your model do on your last prompt for{" "}
          <strong>
            {repo.repo} / {repo.owner}
          </strong>
          ?
        </Text>
        <Text fontSize={14} color="gray.500">
          Passive Improvement is used to directly improve your model and it's
          training. This allows your model to be constantly learning as it's
          being used.
        </Text>
      </Flex>
      <Flex
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        <Button onClick={handleBadAnswerClick}>
          <FaThumbsDown />
          <Text ml={2}>Poor</Text>
        </Button>
        <Button

          ml={2}
          color="white"
          bgGradient="linear(to-r, blue.500, teal.500)"
          onClick={handleGoodAnswerClick}
        >
          <FaThumbsUp />
          <Text ml={2}>Good</Text>
        </Button>
      </Flex>
    </Flex>
  );
};

export default Science;

{
  /* <Flex
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Flex flexDirection="row" justifyContent="space-between" width="100%">
            <Stack>
              <Text>my latest prompt!</Text>
              <Badge alignSelf="flex-start">{model.training_method}</Badge>
              <Badge alignSelf="flex-start">
                Last Trained: {new Date(model.created_at).toDateString()} at{" "}
                {new Date(model.created_at).toTimeString().slice(0, 5)}
              </Badge>
            </Stack>
            <Stack>
              <HStack>
                <FaCrown />
                <Text>{model.owner}</Text>
              </HStack>
              <HStack>
                <MdLabel />
                <Text>{model.repo}</Text>
              </HStack>
              <HStack>
                <BiGitBranch />
                <Text>{model.branch}</Text>
              </HStack>
            </Stack>
            <Stack>
              <Text>Frequency: {model.frequency}</Text>
              <Text>Training: {model.sample_size}</Text>
              <Text>Epochs: {model.epochs}</Text>
            </Stack>
          </Flex>
          <Divider orientation="vertical" mx={10} /> */
}
{
  /* </Flex> */
}
