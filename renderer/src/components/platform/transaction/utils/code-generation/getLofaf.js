// Utils
import sendToLLM from "@/src/components/platform/transaction/utils/LLMs/sendToLLM";
import getFilteredLofaf from "@/src/utils/getFilteredLofaf";
import makeCodeParseable from "@/src/components/platform/transaction/utils/makeCodeParseable";

import chunkAndMapToLLMPromise from "./chunkAndMapToLLMPromise";

const MAX_LOFAF_CHUNK_SIZE = 1250;
const MAX_CHUNKS = 2;

const getLofaf = async (prompt, directory, context) => {
  return new Promise(async (resolve, reject) => {
    console.log("🚀 Generation Started");

    if (!prompt) {
      console.log("❌ No prompt provided");
      return { result: "fail - no prompt provided" };
    }

    let lofaf = await getFilteredLofaf(directory);

    const asyncRelevantLofaf = async (lofafChunk) => {
      const relevant = await sendToLLM({
        stream: false,
        model: "gpt-3.5-turbo-16k",
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

      const parsedResponse = JSON.parse(relevant.response);

      return parsedResponse.csvOfFiles.split(",");
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
    processedLofaf = [...new Set(processedLofaf)];

    //remove empty strings
    processedLofaf = processedLofaf.filter((item) => item !== "");

    //remove all single quotes from string
    processedLofaf = processedLofaf.map((item) => item.replace(/'/g, ""));

    //trim whitespace
    processedLofaf = processedLofaf.map((item) => item.trim());

    //join array
    processedLofaf = processedLofaf.join(",");

    resolve(processedLofaf);
  });
};

export default getLofaf;
