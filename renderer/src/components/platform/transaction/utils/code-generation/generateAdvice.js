import getAPIURL from "@/src/utils/getAPIURL";

const generateAdvice = async (history, technologiesUsed, context, UID) => {
  //turn history into messages array

  //filter out empty csv values
  technologiesUsed = technologiesUsed
    .split(",")
    .filter((tech) => tech)
    .join(",");

  let messages = history.map((message) => {
    return {
      role: message.isUser ? "user" : "assistant",
      content: message?.contentToLLM || message?.content,
    };
  });

  //filter out messages with no content
  messages = messages.filter((message) => message.content);

  try {
    const response = await fetch(`${getAPIURL}/generate-advice`, {
      method: "POST",
      body: JSON.stringify({ messages, technologiesUsed, context, UID }),
    });
    return response;
  } catch (error) {
    console.warn({ error });
    return error;
  }
};

export default generateAdvice;
