import { Flex, Text } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";

//components
import Message from "../../Message";

//types
import MessageType from "@/src/types/message";

//Error props interface
interface ErrorMessageProps {
  message: MessageType;
}
const ErrorMessage = (props: ErrorMessageProps) => {
  return (
    <Message>
      <Flex flexDirection="column" flex={1} maxW={"70vw"}>
        I'm sorry... something went wrong. Please try again later or let us know
        in Discord. Here is the error message:
        <Text fontWeight="bold">
          {props.message.content
            ? `${props?.message?.content}`
            : "props.message.content returned falsey."}
        </Text>
      </Flex>
    </Message>
  );
};

export default ErrorMessage;
