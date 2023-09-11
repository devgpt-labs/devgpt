// Utils
import sendToLLM from "@/src/components/platform/transaction/utils/LLMs/sendToLLM";
import getFilteredLofaf from "@/src/utils/getFilteredLofaf";
import makeCodeParseable from "@/src/components/platform/transaction/utils/makeCodeParseable";

import chunkAndMapToLLMPromise from "./chunkAndMapToLLMPromise";

const MAX_LOFAF_CHUNK_SIZE = 400;
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
        model: "gpt-4",
        role: `You are a top tier developer. You should return a list of files, from the list of files provided
				return all the files you NEED to EDIT or READ or CREATE to complete the task.
				also select one similar file that you can use as a reference. E.g. a similar file in the same directory.
				If you have to create a new file, give it a relevant path.
			  `,
        content: `
				Here are the files in the codebase so far: "${lofafChunk}" /n/n
				Here is the task I am trying to complete: "${prompt}" /n/n
				
				IMPORTANT, return ONLY an array of file names
				Example:
				['${directory}/src/fileOne.js', '${directory}/src/components/fileOne.test.js' , '${directory}/fileTwo.py']
				`,
      });

      let codeToParse = await makeCodeParseable(
        String(relevant.response).replace(/(\r\n|\n|\r)/gm, "")
      );

      codeToParse = JSON.parse(`{"arr": "${codeToParse}"}`);

      return codeToParse.arr;
    };

    let processedLofaf = await chunkAndMapToLLMPromise(
      lofaf,
      MAX_LOFAF_CHUNK_SIZE,
      asyncRelevantLofaf
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

    //remove quotes
    processedLofaf = processedLofaf.slice(1, -1);

    resolve(processedLofaf);
  });
};

export default getLofaf;
