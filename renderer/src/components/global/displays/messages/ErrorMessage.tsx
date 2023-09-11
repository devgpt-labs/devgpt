import { Flex } from "@chakra-ui/react";
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
        <ReactMarkdown className="markdown">
          {props.message.content}
        </ReactMarkdown>
      </Flex>
    </Message>
  );
};

export default ErrorMessage;
