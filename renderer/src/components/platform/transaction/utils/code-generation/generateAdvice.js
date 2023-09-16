import getAPIURL from "@/src/utils/getAPIURL";

const generateAdvice = async (history, UID) => {
  //turn history into messages array

  let messages = history.map((message) => {
    return {
      role: message.isUser ? "user" : "assistant",
      content: message?.contentToLLM || message?.content,
    };
  });

  console.log("1", { messages });

  //filter out messages with no content
  messages = messages.filter((message) => message.content);

  console.log("2", { messages });

  try {
    const response = await fetch(`${getAPIURL}/generate-advice`, {
      method: "POST",
      body: JSON.stringify({ messages, UID }),
    });
    return response;
  } catch (error) {
    console.warn({ error });
    return error;
  }
};

export default generateAdvice;
