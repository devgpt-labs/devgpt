interface MessageType {
  content: string;
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
