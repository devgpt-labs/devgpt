import React from "react";
import { Badge, Text } from "@chakra-ui/react";
import authStore from "@/store/Auth";

const TrainingStatus = (initialMessages: any) => {
  const { status, credits }: any = authStore();
  if (status?.isOverdue || credits < 0) return null;

  return initialMessages?.length < 2 ? (
    <Text mb={1}>
      Your AI model is <Badge>Training</Badge>, until this is done the AI
      won't be able to access your repos context.
    </Text>
  ) : (
    <Text mb={1}>
      Your trained model is{" "}
      <Badge colorScheme="teal">READY FOR PROMPTING</Badge>
    </Text >
  );
};

export default TrainingStatus;