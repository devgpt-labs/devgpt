import React, { useEffect, useState } from "react";
import { Flex, Tag, Box } from "@chakra-ui/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import ReactMarkdown from "react-markdown";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

//utils
import copyToClipboard from "@/utils/copyToClipboard";

//props types for response
interface ResponseProps {
  content: string;
}

const Response = ({ content }: ResponseProps) => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setCopied(false)
  }, [content])

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
                    style={vscDarkPlus}
                    language={match[1]}
                    className="syntaxhighlighter"
                    PreTag="div"
                  />
                  <Tag
                    size='lg'
                    cursor={"pointer"}
                    colorScheme="whatsapp"
                    onClick={() => {
                      copyToClipboard(String(children));
                      setCopied(true)
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
