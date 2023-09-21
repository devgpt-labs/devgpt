import React from "react";
import { Flex, Tag, Box } from "@chakra-ui/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import ReactMarkdown from "react-markdown";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

//utils
import copyToClipboard from "@/utils/copyToClipboard";

//props types for response
interface ResponseProps {
  content: string;
}

const Response = ({ content }: ResponseProps) => {
  return (
    <Flex flex={1} my={4} flexDirection={"column"}>
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <>
                <Box maxW="full" pb={10}>
                  <SyntaxHighlighter
                    fontSize={14}
                    className="syntaxhighlighter"
                    {...props}
                    lineProps={{ style: { paddingBottom: 8, fontSize: 14 } }}
                    wrapLines={true}
                    showLineNumbers={true}
                    // eslint-disable-next-line react/no-children-prop
                    children={String(children).replace(/\n$/, "")}
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                  />
                  <Tag
                    cursor={"pointer"}
                    colorScheme="whatsapp"
                    onClick={() => {
                      copyToClipboard(String(children));
                    }}
                  >
                    Copy
                  </Tag>
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
  );
};

export default Response;
