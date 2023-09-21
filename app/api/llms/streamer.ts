export type StreamEvents = {
  onError: (error: unknown) => void;
  onComplete: () => void;
  onData: (data: string) => void;
};

export class Streamer {
  private onError: (error: unknown) => void;
  private onComplete: () => void;
  private onData: (data: string) => void;

  constructor(streamEvent: StreamEvents) {
    this.onError = streamEvent.onError;
    this.onComplete = streamEvent.onComplete;
    this.onData = streamEvent.onData;
  }

  private processEvent(data: string): string {
    try {
      const json = JSON.parse(data);
      const content = json.choices[0]?.delta?.content || "";
      this.onData(content);
      return content;
    } catch (e) {
      this.onError(e);
      return "";
    }
  }

  public parseSSE(input: string) {
    let runningLength = input;
    let position = 0;
    let data = "";
    while (position < runningLength.length) {
      const lineEnd = runningLength.indexOf("\n", position);
      if (lineEnd === -1) {
        break;
      }

      const line = runningLength.slice(position, lineEnd).trim();
      position = lineEnd + 1;

      if (line.startsWith("data:")) {
        const eventData = line.slice(5).trim();

        if (eventData === "[DONE]") {
          this.onComplete();
          break;
        } else {
          data += eventData;
        }
      } else if (line === "") {
        if (data) {
          this.processEvent(data);
          data = "";
        }
      }
    }
  }
}
