import {
  Text,
  Input,
  SlideFade,
  InputGroup,
  InputRightElement,
  IconButton,
  Flex,
} from "@chakra-ui/react";

//components
import Message from "../../Message";

//types
import MessageType from "@/src/types/message";
import { LuSend, LuX } from "react-icons/lu";

//Error props interface
interface InputMessageProps {
  message: MessageType;
  history: any;
  setHistory: any;
  index: number;
  type: string;
}

const InputMessage = ({
  message,
  history,
  setHistory,
  index,
  type,
}: InputMessageProps) => {
  const isNew = type === "new" ? true : false;
  const transitions: number = isNew ? 0.5 : 0;

  return (
    <SlideFade
      in={true}
      offsetY={0}
      offsetX={isNew ? 80 : 0}
      transition={{
        enter: {
          duration: transitions,
          delay: transitions,
        },
      }}
    >
      <Message isUser={true}>
        <InputGroup>
          <Input
            autoFocus
            variant="flushed"
            borderBottomRadius={0}
            borderTopRadius={5}
            value={message.content}
            w={"85%"}
            onChange={(e) => {
              if (e.target.value.length <= 150) {
                const updatedHistory = [...history];
                updatedHistory[index].content = e.target.value;
                setHistory(updatedHistory);
              }
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                if (message.content.length === 0) return;
                const updatedHistory = [...history];
                updatedHistory[index].submitted = true;
                updatedHistory[index].type = "output";
                setHistory(updatedHistory);
              }
              if (e.key === "Escape") {
                const updatedHistory = [...history];
                updatedHistory[index].content = "I don't know.";
                updatedHistory[index].submitted = true;
                updatedHistory[index].type = "output";
                setHistory(updatedHistory);
              }
            }}
            p={2}
            placeholder={"Answer here..."}
            _placeholder={{ color: "gray.400" }}
            fontSize="md"
            flexWrap="wrap"
          />
          <InputRightElement>
            <Text fontSize={12}>
              {message.content.length}/{150}
            </Text>
            <IconButton
              mr={2}
              ml={4}
              aria-label="Send"
              icon={<LuSend />}
              size="sm"
              onClick={() => {
                if (
                  message.content.length <= 150 &&
                  message.content.length > 0
                ) {
                  const updatedHistory = [...history];
                  updatedHistory[index].submitted = true;
                  updatedHistory[index].type = "output";
                  setHistory(updatedHistory);
                }
              }}
            />
            <IconButton
              mr={20}
              aria-label="Skip"
              icon={<LuX />}
              size="sm"
              onClick={() => {
                const updatedHistory = [...history];
                updatedHistory[index].content = "I don't know.";
                updatedHistory[index].submitted = true;
                updatedHistory[index].type = "output";
                setHistory(updatedHistory);
              }}
            />
          </InputRightElement>
        </InputGroup>
      </Message>
    </SlideFade>
  );
};

export default InputMessage;
