import getAPIURL from "@/src/utils/getAPIURL";

const generateNewGenerationCode = async (
  originalPrompt,
  answers,
  context,
  language,
  existingCodeString,
  prompt,
  localRepoDir,
  UID
) => {
  try {
    const response = await fetch(`${getAPIURL}/generate-new-generation-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        originalPrompt,
        answers,
        context,
        language,
        existingCodeString,
        prompt,
        localRepoDir,
        UID,
      }),
    });
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.warn({ error });
    return error;
  }
};

export default generateNewGenerationCode;
