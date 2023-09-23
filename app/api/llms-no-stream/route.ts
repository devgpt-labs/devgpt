// utils
import stringifyJsonClean from "@/utils/stringifyJsonClean";
// types
import { Message } from "@/app/types/chat";

export interface Payload {
  prompt: string;
  functions: any;
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Payload;

  const messages: Message[] = [
    {
      role: "user",
      content: String(payload.prompt),
    },
  ];

  if (process.env.NODE_ENV === 'development') {
    // Return mock response
    const mockResponse = {
      messages: [
        {
          role: "bot",
          content: `Mock response for: ${payload.prompt}`
        }
      ],
      // Add any other necessary mock fields
    };
    return new Response(JSON.stringify(mockResponse));
  }

  const APIURL: any = process.env.NEXT_PUBLIC_CHAT_COMPLETION_URL;
  const APIKEY: any = process.env.NEXT_PUBLIC_AZURE_OPEN_AI_KEY;

  const body = stringifyJsonClean({
    messages,
    functions: payload.functions || null,
    stream: false,
  });

  const response: any = await fetch(APIURL, {
    headers: {
      "Content-Type": "application/json",
      "api-key": APIKEY,
    },
    method: "POST",
    body: body,
  });

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();

  let completeResponse: any = "";

  while (true) {
    const { value, done: doneReading } = await reader.read();
    const chunkValue = decoder.decode(value);
    completeResponse += chunkValue;
    if (doneReading && completeResponse) {
      completeResponse = JSON.parse(completeResponse);
      return new Response(JSON.stringify(completeResponse));
    }
  }
}
