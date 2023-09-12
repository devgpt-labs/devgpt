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
    const response = await fetch(`${getAPIURL}`, {
      method: "POST",
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
    return json;
  } catch (error) {
    console.warn({ error });
    return error;
  }
};

export default generateNewGenerationCode;
