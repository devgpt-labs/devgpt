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
                    <Flex
                      maxW="full"
                      rounded={"md"}
                      justifyContent='space-between'
                      bg='#282c35'
                      flexDirection='row'
                      alignItems="center"
                      p={2}
                      mb={1}
                      mt={2}
                    >
                      <Text fontSize={14}>file_name_goes_here.test</Text>
                      <Flex flexDirection='row'>
                        <CodeTag colorScheme="blue">Copy</CodeTag>
                        <CodeTag colorScheme="green">Sync</CodeTag>
                      </Flex>

                    </Flex>
                    <Box maxW="full">
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
                    </Box>

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
    <Tag colorScheme={colorScheme} ml={2} onClick={onClick} cursor="pointer">
      {children}
    </Tag>
  );
};
