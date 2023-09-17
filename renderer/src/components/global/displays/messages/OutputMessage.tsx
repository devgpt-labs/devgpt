import React, { useState } from "react";
import Typewriter from "typewriter-effect";
import { Flex, Text, SlideFade, Tag, Box } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

//components
import Message from "../../Message";
import CodeDisplay from "../CodeDisplay";

//types
import MessageType from "@/src/types/message";

//Error props interface
interface OutPutMessageProps {
  message: MessageType;
  type: string;
}

const OutPutMessage = ({ message, type }: OutPutMessageProps) => {
  let content = message?.content?.trim();

  const isNew = type === "new" ? true : false; //todo how is this used?
  const transitions: number = isNew ? 0.3 : 0;

  //todo get sync and copy working

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
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <>
                    <SyntaxHighlighter
                      className="syntaxhighlighter"
                      {...props}
                      lineProps={{ style: { paddingBottom: 8 } }}
                      wrapLines={true}
                      showLineNumbers={true}
                      children={String(children).replace(/\n$/, "")}
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                    />
                    <Flex
                      w="full"
                      backgroundColor={"gray.900"}
                      rounded={"md"}
                      justifyContent={"flex-end"}
                      alignItems="center"
                      py={1}
                      mb={3}
                    >
                      <CodeTag colorScheme="blue">Copy</CodeTag>
                      <CodeTag colorScheme="green">Sync</CodeTag>
                    </Flex>
                  </>
                ) : (
                  <code {...props} className={className}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </Flex>
      </Message>
    </SlideFade>
  );
};

export default OutPutMessage;

const CodeTag = ({ children, onClick, colorScheme }: any) => {
  return (
    <Tag colorScheme={colorScheme} mr={1} onClick={onClick} cursor="pointer">
      {children}
    </Tag>
  );
};
