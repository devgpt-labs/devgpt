import { Flex, Avatar, SlideFade, Text, Input, Image } from "@chakra-ui/react";
import UserAvatar from "./UserAvatar";
import AIAvatar from "./AIAvatar";

const Message = (props) => {
  return (
    <SlideFade
      in={true}
      offsetY={0}
      offsetX={props.isUser ? 0 : -80}
      transition={{ enter: { duration: `${props.isUser ? 0 : 0.4}` } }}
    >
      <Flex
        borderRadius={6}
        alignItems="center"
        mt={4}
        p={4}
        // Set a bg gradient for the background
        bgGradient={
          props.isUser
            ? "linear(to-r, #171923, gray.800)"
            : "linear(to-l, #171923, gray.800)"
        }
        // bg={props.isUser ? "gray.800" : "gray.800"}
        ml={props.isUser ? 3 : 0}
        mr={props.isUser ? 0 : 3}
      >
        {props.isUser ? <UserAvatar /> : <AIAvatar />}

        <Flex flexDirection="row" flex={1} maxW={"70vw"}>
          {props.children}
        </Flex>
      </Flex>
    </SlideFade>
  );
};

export default Message;
