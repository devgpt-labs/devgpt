import escapeJSONStrings from "@/utils/escapeJSONStrings";

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
        //force the data out of the failed JSON with a regex
        const regex = /"content":"(.*?)"/;
        const match = data.match(regex);

        if (match) {
          let content = match[1];
          content = escapeJSONStrings(content);
          // add additional handling for edge cases (like lone backslashes)
          if (content.endsWith("\\")) {
            content += "\\"; // escape the lone backslash
          }
          try {
            content = JSON.parse(
              `"${content.replace(/\\u([a-fA-F0-9]{4})/g, "\\\\u$1")}"`
            ); //decode unicode
            this.onData(content);
            return content;
          } catch (e) {
            console.log({ content });
            console.log({ e });
            return "";
          }
        }
        return "";
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
