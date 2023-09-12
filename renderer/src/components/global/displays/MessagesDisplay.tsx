import React, { useState, useRef, useEffect } from "react";

//components
import ErrorMessage from "./messages/ErrorMessage";
import InputMessage from "./messages/InputMessage";
import OutputMessage from "./messages/OutputMessage";
import CodeDisplay from "./CodeDisplay";

//types
import Loading from "../Loading";

const ScrollIntoView = () => {
  const elementRef = useRef<null | HTMLDivElement>();
  useEffect(() => elementRef.current.scrollIntoView());
  return <div ref={elementRef} />;
};

interface MessagesDisplayProps {
  messages: any;
  transaction_id: string;
  setHistory: any;
  viewingHistory?: boolean;
}

const MessagesDisplay = ({
  messages,
  transaction_id,
  setHistory,
  viewingHistory,
}: MessagesDisplayProps) => {
  let cancelRender = false;

  //render a message, based on the type
  const messagesRender = messages.map((message, index) => {
    if (cancelRender) {
      return <></>;
    }

    if (message?.submitted === false) {
      cancelRender = true;
    }

    switch (message.type) {
      case "input":
        return (
          <InputMessage
            message={message}
            key={`input${index}`}
            history={messages}
            setHistory={setHistory}
            index={index}
            type={transaction_id}
          />
        );
      case "output":
        return (
          <OutputMessage
            message={message}
            key={`output${index}`}
            type={transaction_id}
          />
        );
      case "code":
        return (
          <CodeDisplay
            codeChanges={message.content}
            transaction_id={transaction_id}
            key={`code${index}`}
          />
        );
      case "error":
        return <ErrorMessage message={message} key={`error${index}`} />;
      default:
        return <></>;
    }
  });

  const loading =
    messages[messages.length - 1]?.submitted === true ||
    messages[messages.length - 1]?.source === "prompt" ||
    messages[messages.length - 1]?.source === "advice";

  if (loading && !viewingHistory) {
    return (
      <>
        {messagesRender}
        <Loading />
      </>
    );
  }

  return messagesRender;
};
export default MessagesDisplay;
