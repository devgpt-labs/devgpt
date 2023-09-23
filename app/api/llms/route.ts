import { AzureOpenAI } from "./prepareChatCompletion";
import { AzureConfig } from "../../types/azure";

import { Message } from "@/app/types/chat";

export interface Payload {
  messages: Message[];
}

export async function POST(request: Request) {
  // This is the main API entry point.
  const payload = (await request.json()) as Payload;

  if (process.env.NODE_ENV === 'development') {
    // Return mock response
    const lastMessage = payload.messages[payload.messages.length - 1].content;
    const mockResponse = {
      messages: [
        ...payload.messages, // returning the sent messages
        {
          role: "bot",
          content: `Mock response for: ${lastMessage}`
        }
      ],
      // Add any other necessary mock fields
    };
    return new Response(JSON.stringify(mockResponse));
  }

  interface AzureConfig {
    basePath: string;
    apiKey: string;
    chatVersion: string;
  }

  const config: AzureConfig = {
    basePath: process.env.NEXT_PUBLIC_AZURE_OPEN_AI_BASE || "",
    apiKey: process.env.NEXT_PUBLIC_AZURE_OPEN_AI_KEY || "",
    chatVersion: process.env.NEXT_PUBLIC_AZURE_OPEN_AI_CHAT_VERSION || "",
  };

  const azure = new AzureOpenAI(config);

  const requestPayload: any = {
    messages: payload.messages,
    stream: true, // stream the response
  };

  const stream = await azure.createChat(requestPayload);
  return new Response(stream);
}
