"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  IconButton,
  Image,
  Text,
  useColorMode,
  SlideFade,
  Tooltip,
  Stack,
  Link,
  useDisclosure,
  Skeleton,
  Button,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Badge,
  Divider,
  VStack,
  HStack,
} from "@chakra-ui/react";

// Utils
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabase";
import getPromptCount from "@/utils/getPromptCount";
import { MdMoney, MdScience } from "react-icons/md";

// Components
import Repos from "./Settings";
import UpgradeModal from "./UpgradeModal";

// Icons
import { PiSignOutBold } from "react-icons/pi";
import { BiSolidBookBookmark } from "react-icons/bi";
import {
  GiBattery100,
  GiBattery75,
  GiBattery50,
  GiBattery0,
} from "react-icons/gi";
import { MoonIcon, SunIcon, StarIcon } from "@chakra-ui/icons";
import { FaBug, FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { RiDashboardLine } from "react-icons/ri";
import { MdLabel } from "react-icons/md";
import { FaCrown } from "react-icons/fa";
import { BiGitBranch } from "react-icons/bi";

// Stores
import repoStore from "@/store/Repos";
import authStore from "@/store/Auth";
import KeyModal from "./KeyModal";
import CreditsModal from "./CreditsModal";
import Models from "@/pages/platform/models";

const Science = ({ models }: any) => {
  const { repo }: any = repoStore();
  const [sliderValue, setSliderValue] = useState(5);
  const [showTooltip, setShowTooltip] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  // Find the model in models that matches repo
  const model = models.find(
    (model: any) => model.repo === repo.repo && model.owner === repo.owner
  );

  const handleGoodAnswerClick = async () => {
    console.log("hi");
    setFeedbackGiven(true);
  };

  const handleBadAnswerClick = async () => {
    console.log("hi");
    setFeedbackGiven(true);
  };

  if (!model) return <Skeleton height="20px" />;

  if (feedbackGiven) return (
    <Flex
      mt={3}
      alignItems='center'
      justifyContent='center'
      flexDirection="row"
      rounded="lg"
      border="1px solid #1a202c"
      p={5}
    >
      <Text>Thank you for your feedback</Text>
    </Flex>
  )


  return (
    <Flex
      mt={3}
      flexDirection="row"
      rounded="lg"
      border="1px solid #1a202c"
      p={5}
    >
      <Flex flexDirection="column">
        <Text>Passive Improvement</Text>
        <Text fontSize={14} color="gray.400">
          How did your model do on your last prompt? This is used to directly
          improve your model and it's training.
        </Text>
      </Flex>
      <Flex
        flexDirection="row"
        width="100%"
        justifyContent="center"
        alignItems="center"
      >
        <Button variant="ghost" onClick={handleBadAnswerClick}>
          <FaThumbsDown />
          <Text ml={2}>Bad</Text>
        </Button>
        <Button
          ml={2}
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
