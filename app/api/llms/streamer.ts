const recoverContent = (str: string) => {
  // Regular expression to match the JSON-like substring
  const regex = /{"content":"([\\"]|[^"])*?"}/;

  // Use the match method to find the first occurrence
  const match = str.match(regex);

  // If a match is found, manually escape known control characters and then parse it
  if (match) {
    const escapedMatch = match[0]
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/\t/g, "\\t");
    try {
      let content = JSON.parse(escapedMatch);
      return content.content;
    } catch {
      console.error("Error parsing JSON-like string: ", escapedMatch);
      return "";
    }
  } else {
    console.error("No match found for JSON-like string: ", str);
    return "";
  }
};

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
      try {
        const content = recoverContent(data);
        this.onData(content);
        return content;
      } catch (e) {
        this.onError(e);
        return "";
      }
    }
  }

  public parseStream(input: string) {
    let runningLength = input;
    let position = 0;
    let data = "";
    while (position < runningLength.length) {
      const lineEnd = runningLength.indexOf("\n", position);
      if (lineEnd === -1) {
        break; // no more lines
      }

      const line = runningLength.slice(position, lineEnd);
      position = lineEnd + 1;

      if (line.startsWith("data:")) {
        const eventData = line.slice(5);

        if (eventData === "[DONE]") {
          this.onComplete();
          break;
        } else {
          data += eventData;
        }
      } else {
        if (data) {
          this.processEvent(data);
          data = "";
        } else {
          this.processEvent(line);
          data = "";
        }
      }
    }
  }
}
