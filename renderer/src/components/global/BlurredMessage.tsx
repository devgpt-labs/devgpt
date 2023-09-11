import { Flex, Avatar, SlideFade, Text, Input } from "@chakra-ui/react";
import UserAvatar from "./UserAvatar";
import AIAvatar from "./AIAvatar";

const BlurredMessage = (props) => {
  return (
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
        width={"100%"}
    >
    {props.isUser ? <UserAvatar /> : <AIAvatar />}

    <Flex flexDirection="row" flex={1} maxW={"70vw"}>
        {props.children}
    </Flex>
    </Flex>
    
  );
};

export default BlurredMessage;
