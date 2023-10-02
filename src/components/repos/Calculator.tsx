"use client";
import { useState, useEffect } from "react";
import { Tag } from "@chakra-ui/react";
import {
  Box,
  Flex,
  IconButton,
  Image,
  Text,
  useColorMode,
  SlideFade,
  Tooltip,
  Link,
  useDisclosure,
} from "@chakra-ui/react";

// Utils
import { supabase } from "@/utils/supabase";
import getPromptCount from "@/utils/getPromptCount";

// Components
import Repos from "./Settings";
import UpgradeModal from "./UpgradeModal";

// Icons
import { IoMdSettings } from "react-icons/io";
import { PiSignOutBold } from "react-icons/pi";
import { AiFillFolderOpen } from "react-icons/ai";
import { BsDiscord } from "react-icons/bs";
import { AiFillStar } from "react-icons/ai";
import { BiKey, BiSolidBookBookmark } from "react-icons/bi";
import {
  GiBattery100,
  GiBattery75,
  GiBattery50,
  GiBattery0,
} from "react-icons/gi";
import { MoonIcon, SunIcon, StarIcon } from "@chakra-ui/icons";
import { FaBug } from "react-icons/fa";

// Stores
import repoStore from "@/store/Repos";
import authStore from "@/store/Auth";
import KeyModal from "./KeyModal";

const Calculator = () => {
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
      <Text>
        Hello world
      </Text>
    </Flex>
  );
};

export default Calculator;
