//todo clean up this file and the place that uses this type

interface MessageType {
  content: string;
  contentToLLM?: string; // If this isn't set, it will be the same as content
  type: "input" | "output" | "code" | "error";
  source:
    | "question"
    | "answer"
    | "advice"
    | "code"
    | "error"
    | "message"
    | "prompt";
  generation_round: number; // This is the round in which this message was generated
  isUser: boolean;
  streamResponse?: boolean;
  submitted?: boolean;
  signOffMessageInGeneration?: boolean;
}

export default MessageType;
