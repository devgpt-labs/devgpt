import React from "react";
import { Badge, Text } from "@chakra-ui/react";
import authStore from "@/store/Auth";

const TrainingStatus = ({ initialMessages }: any) => {
  const { isPro }: any = authStore();
  if (!isPro) return null;

  return initialMessages?.length < 2 ? (
    <Text mb={1}>
      Your model has <Badge colorScheme="orange">INCOMPLETE TRAINING</Badge>,
      please re-train your model using the models page.
    </Text>
  ) : (
    <Text mb={1}>
      Your trained model is{" "}
      <Badge colorScheme="teal">READY FOR PROMPTING</Badge>
    </Text>
  );
};

export default TrainingStatus;
