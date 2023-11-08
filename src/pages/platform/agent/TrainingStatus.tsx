import React from "react";
import { Badge, Text } from "@chakra-ui/react";
import authStore from "@/store/Auth";

const TrainingStatus = () => {
  const { isPro }: any = authStore();
  if (!isPro) return null;


  <Text mb={1}>
    This repo is
    <Badge colorScheme="teal">READY FOR PROMPTING</Badge>
  </Text>
};

export default TrainingStatus;
