import sendToLLM from "./functions/sendToLLM";
import chunkAndMapToLLMPromise from "./functions/chunkAndMapToLLMPromise";

const MAX_LOFAF_CHUNK_SIZE = 100;
const MAX_CHUNKS = 25;

export default async function handler(req: any, res: any) {
  const parsedBody = JSON.parse(req.body);
  const { prompt, directory, lofaf } = parsedBody;

  console.log("Running prompt... ", prompt);

  if (!prompt || !directory || !lofaf) {
    res.status(400).send("Missing required parameters");
    return;
  }

  console.log("🚀 Generation Started");

  if (!prompt) {
    console.log("❌ No prompt provided");
    return { result: "fail - no prompt provided" };
  }

  const asyncRelevantLofaf = async (lofafChunk: any) => {
    const relevant = await sendToLLM({
      stream: false,
      model: "gpt-3.5-turbo",
      role: `You are a top tier developer.
                  You are going to be given a task and a list of files in the codebase.
                  You need to respond with a csv of files that will be required complete the task.
                  If you have to create a new file, give it a relevant path.
                `,
      content: `
                  task: "${prompt}" /n/n
                  list of files: "${lofafChunk}" /n/n
                  
                  IMPORTANT, respond with ONLY the csv of files /n/n
                  Example response: /n/n
                  ${directory}/src/fileOne.js, ${directory}/src/components/fileOne.test.js, ${directory}/fileTwo.py
                  `,
      functions: [
        {
          name: "send_list_of_files_to_llm",
          description:
            "Send a list of files that are relevant to a task to an LLM",
          parameters: {
            type: "object",
            properties: {
              comments: {
                type: "string",
                description: "Any comments you want to display to the user",
              },
              csvOfFiles: {
                type: "string",
                description: "A comma separated list of files directories",
              },
            },
          },
        },
      ],
    });

    try {
      const parsedResponse = JSON.parse(relevant.response);
      return parsedResponse.csvOfFiles.split(",");
    } catch (error) {
      return [];
    }
  };

  let processedLofaf = await chunkAndMapToLLMPromise(
    lofaf,
    MAX_LOFAF_CHUNK_SIZE,
    asyncRelevantLofaf,
    MAX_CHUNKS
  );

  //flatten array
  processedLofaf = processedLofaf.flat();

  //remove duplicates
  //@ts-ignore
  processedLofaf = [...new Set(processedLofaf)];

  //remove empty strings
  processedLofaf = processedLofaf.filter((item) => item !== "");

  //remove all single quotes from string
  processedLofaf = processedLofaf.map((item) => item.replace(/'/g, ""));

  //trim whitespace
  processedLofaf = processedLofaf.map((item) => item.trim());

  //join array
  //@ts-ignore
  processedLofaf = processedLofaf.join(",");

  res.status(200).send({ data: processedLofaf });
}
