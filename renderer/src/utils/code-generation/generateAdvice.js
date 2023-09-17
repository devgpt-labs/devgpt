//config
import getAPIURL from "@/src/utils/getAPIURL";

//utils
import getTokenLength from "@/src/utils/getTokenLength";

const generateAdvice = async (history, technologiesUsed, context, UID) => {
  //filter out empty csv values
  technologiesUsed = technologiesUsed
    .split(",")
    .filter((tech) => tech)
    .join(",");

  const lastMessage = history[history.length - 1];

  const messageContent = lastMessage?.contentToLLM || lastMessage?.content;

  if (lastMessage?.content?.length < 1) {
    return {
      error: `Your last message is too short. Please add more content to your last message.`,
    };
  }

  //turn history into messages array
  let messages = history.map((message) => {
    return {
      role: message.isUser ? "user" : "assistant",
      content: messageContent,
    };
  });

  //filter out messages with no content
  messages = messages.filter((message) => message.content);

  //check token length of last message
  const tokenLength = getTokenLength(messageContent);

  //todo this should be the correct amount of tokens based on 32k vs 8k (should be based on plan)
  if (tokenLength?.tokens > 3500) {
    return {
      error: `Your last message contains ${tokenLength?.tokens} tokens, which GPT-4 cannot handle. Please reduce the length of your last message, reduce the files tagged or upgrade to GPT-4-32k.`,
    };
  }

  //todo test what happens if API fails to respond, make sure it doesn't crash the app

  try {
    const response = await fetch(`${getAPIURL}/generate-advice-azure`, {
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
