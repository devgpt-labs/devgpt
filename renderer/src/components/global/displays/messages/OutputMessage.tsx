import React, { useState } from "react";
import Typewriter from "typewriter-effect";
import { Flex, Text, SlideFade } from "@chakra-ui/react";

//components
import Message from "../../Message";

//types
import MessageType from "@/src/types/message";

//Error props interface
interface OutPutMessageProps {
  message: MessageType;
  type: string;
}

const OutPutMessage = ({ message, type }: OutPutMessageProps) => {
  const trimmedContent = message.content.trim();
  const isNew = type === "new" ? true : false;
  const transitions: number = isNew ? 0.3 : 0;

  return (
    <SlideFade
      in={true}
      offsetY={0}
      offsetX={isNew ? -80 : 0}
      transition={{
        enter: {
          duration: transitions,
        },
      }}
    >
      <Message isUser={message.isUser}>
        <Flex flexDirection="column">
          <Text fontSize={16} whiteSpace={"pre-wrap"}>
            {trimmedContent ||
              "An error occurred, please try again later or let us know in Discord."}
          </Text>
        </Flex>
      </Message>
    </SlideFade>
  );
};

export default OutPutMessage;
