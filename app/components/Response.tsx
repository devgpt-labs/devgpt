import React, { useEffect, useState } from "react";
import { Flex, Tag, Box, useColorMode } from "@chakra-ui/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import ReactMarkdown from "react-markdown";
import {
  vscDarkPlus,
  oneLight,
} from "react-syntax-highlighter/dist/cjs/styles/prism";

//utils
import copyToClipboard from "@/utils/copyToClipboard";

//props types for response
interface ResponseProps {
  content: string;
}

const Response = ({ content }: ResponseProps) => {
  const [copied, setCopied] = useState(false);
  const { colorMode } = useColorMode();

  useEffect(() => {
    setCopied(false);
  }, [content]);

  const theme = colorMode === "light" ? oneLight : vscDarkPlus;

  return (
    <Flex flex={1} my={1} flexDirection={"column"} whiteSpace="pre-wrap">
      <ReactMarkdown
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <>
                <Box maxW="full" pb={2}>
                  <SyntaxHighlighter
                    {...props}
                    lineProps={{ style: { paddingBottom: 8, fontSize: 14 } }}
                    fontSize={14}
                    wrapLines={true}
                    showLineNumbers={true}
                    // eslint-disable-next-line react/no-children-prop
                    children={String(children).replace(/\n$/, "")}
                    style={theme}
                    language={match[1]}
                    className="syntaxhighlighter"
                    PreTag="div"
                  />
                  <Tag
                    size="lg"
                    cursor={"pointer"}
                    colorScheme="blue"
                    onClick={() => {
                      copyToClipboard(String(children));
                      setCopied(true);
                    }}
                  >
                    {copied ? "Copied!" : "Copy"}
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
