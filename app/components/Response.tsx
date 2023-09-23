import React, { useEffect, useState } from "react";
import { Flex, Tag, Box, useColorMode } from "@chakra-ui/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import ReactMarkdown from "react-markdown";
import { vscDarkPlus, oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism";

import copyToClipboard from "@/utils/copyToClipboard";

interface ResponseProps {
  content: string;
}

const Response = ({ content }: ResponseProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = (text: string) => {
    copyToClipboard(text);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const tagCursorStyle = copied ? "not-allowed" : "pointer";

  const { colorMode } = useColorMode();

  useEffect(() => {
    setCopied(false)
  }, [content])

  const theme = colorMode === 'light' ? oneLight : vscDarkPlus

  return (
    <Flex flex={1} my={1} flexDirection={"column"} whiteSpace='pre-wrap'>
      <ReactMarkdown

        components={{
          code({ node, inline, className, children, ...props }) {
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
                    cursor={tagCursorStyle}
                    colorScheme="whatsapp"
                    onClick={() => {
                      if (!copied) {
                        handleCopyClick(String(children));
                      }
                    }}
                  >
                    {copied ? "Copied to Clipboard" : "Copy"}
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
