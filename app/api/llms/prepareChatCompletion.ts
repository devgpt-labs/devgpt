//types
import { AzureConfig } from "../../types/azure";
import { Message } from "@/app/types/chat";
//utils
import { Streamer } from "./streamer";
import stringifyJsonClean from "@/utils/stringifyJsonClean";

export class AzureOpenAI {
  private configuration: AzureConfig;

  constructor(configuration: AzureConfig) {
    this.configuration = configuration;
  }

  public async createChat(messages: Message[]) {
    const APIURL: any = process.env.NEXT_PUBLIC_CHAT_COMPLETION_URL;
    const body = stringifyJsonClean(messages);

    const response = await fetch(APIURL, {
      headers: {
        "Content-Type": "application/json",
        "api-key": this.configuration.apiKey,
      },
      method: "POST",
      body: body,
    });

    const stream = this.createStreamFromResponse(response);
    return stream;
  }

  private async sendResponse(
    reader: ReadableStreamDefaultReader<Uint8Array>,
    controller: ReadableStreamDefaultController<Uint8Array>
  ) {
    const StreamEvents = {
      onError: (error: any) => {
        controller.error(error);
      },
      onData: (data: string) => {
        const queue = new TextEncoder().encode(data);
        controller.enqueue(queue);
      },
      onComplete: () => {
        controller.close();
      },
    };

    const decoder = new TextDecoder();
    const streamer = new Streamer(StreamEvents);

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunkedValue = decoder.decode(value);

      streamer.parseStream(chunkedValue);
    }
  }

  private createStreamFromResponse(response: Response) {
    const source: UnderlyingDefaultSource<Uint8Array> = {
      start: async (controller) => {
        if (response && response.body && response.ok) {
          const reader = response.body.getReader();
          try {
            await this.sendResponse(reader, controller);
          } catch (e) {
            controller.error(e);
          } finally {
            controller.close();
            reader.releaseLock();
          }
        } else {
          if (!response.ok) {
            controller.error(response.statusText);
          } else {
            controller.error("No response body");
          }
        }
      },
    };

    return new ReadableStream(source);
  }
}
