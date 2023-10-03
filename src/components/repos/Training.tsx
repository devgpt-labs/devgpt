"use client";
import {
  Flex,
  Text,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Tag,
  SlideFade,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import authStore from "@/store/Auth";
import { supabase } from "@/utils/supabase";
import repoStore from "@/store/Repos";
import { IoMdArrowDown, IoMdArrowDropdown, IoMdArrowUp } from "react-icons/io";

const stages = [
  "generating training data",
  "training data generated",
  "training model with data",
  "model trained",
];

const Training = () => {
  const { user }: any = authStore();
  const { repos }: any = repoStore();

  const [reposInTraining, setReposInTraining] = useState<any[]>([]);

  const getRepos = async () => {
    if (!supabase) return;

    // Get repos from models table in supabase
    const { data, error } = await supabase
      .from("models")
      .select("*")
      .eq("user_id", user.id);

    if (!error) {
      setReposInTraining(data);
    }
  };

  useEffect(() => {
    getRepos();
  }, [repos]);

  const Repo = ({ repo }: any) => {
    const [open, setOpen] = useState(false);
    if (!repo) return null;

    return (
      <Box
        boxShadow="md"
        width='25%'
        height={160}
        rounded="lg"
        p={4}
        overflowY="scroll"
      >
        {!open ? (
          <>
            <Text fontSize={14}>{repo.owner}</Text>
            <Text fontSize={14}>{repo.repo}</Text>
            <Text fontSize={14}>{repo.branch}</Text>
            <Text fontSize={14}>Trained</Text>
          </>
        ) : (
          <>
            <Text fontSize={14}>Trained on:{repo.branch}</Text>
            <Text fontSize={14}>Latency:{repo.branch}</Text>
            <Text fontSize={14}>Last Trained:{repo.branch}</Text>
            <Text fontSize={14}>Frequency:{repo.branch}</Text>
            <Text fontSize={14}>EPOCHS:{repo.branch}</Text>
          </>
        )}

      </Box>
    );
  };

  return (
    <Flex
      mt={3}
      flexDirection="column"
      w="6xl"
      maxW="full"
      rounded="lg"
      boxShadow="0px 0px 900px 0px blue"
      border="1px solid #1a202c"
      p={5}
      overflow="hidden"
      shadow="2xl"
    >
      <Accordion defaultIndex={[0]} allowMultiple>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Models
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            {reposInTraining.length > 0 ? (
              <Flex gap={2}>
                {reposInTraining.map((repo: any) => {
                  return <Repo repo={repo} />;
                })}
              </Flex>
            ) : (
              <Text>No repos being trained yet.</Text>
            )}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Flex>
  );
};

export default Training;
