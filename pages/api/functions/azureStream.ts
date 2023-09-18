const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

const endpoint = process.env["AZURE_ENDPOINT"];
const azureApiKey = process.env["AZURE_API_KEY"];

const messages = [
  {
    role: "system",
    content: "You are a helpful assistant. You will talk like a pirate.",
  },
  { role: "user", content: "Can you help me?" },
  {
    role: "assistant",
    content: "Arrrr! Of course, me hearty! What can I do for ye?",
  },
  { role: "user", content: "What's the best way to train a parrot?" },
];

const streamChatCompletions = (
  client: any,
  modelId: any,
  messages: any,
  options: any
) => {
  const events = client.listChatCompletions(modelId, messages, options);
  const stream = new ReadableStream({
    async start(controller) {
      for await (const event of events) {
        controller.enqueue(event);
      }
      controller.close();
    },
  });

  return stream;
};

const main = async () => {
  // Client
  const client = new OpenAIClient(
    endpoint,
    new AzureKeyCredential(azureApiKey)
  );

  // Model
  const modelId = "devgpt-4-32k";

  // Max Tokens
  const stream = streamChatCompletions(client, modelId, messages, {
    maxTokens: 128,
  });

  // Reader
  const reader = stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      console.log("generation complete");
      break;
    }
    for (const choice of value.choices) {
      if (choice.delta?.content !== undefined) {
        return choice.delta?.content;
      }
    }
  }
};

export default main;
