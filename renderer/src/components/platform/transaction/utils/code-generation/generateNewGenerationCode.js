import getAPIURL from "@/src/utils/getAPIURL";

const generateNewGenerationCode = async (
  prompt,
  answers,
  context,
  language,
  existingCodeString,
  followUpPrompt,
  directory
) => {
  try {
    const response = await fetch(`${getAPIURL}/generate-new-generation-code`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        answers,
        context,
        language,
        existingCodeString,
        followUpPrompt,
        directory,
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
