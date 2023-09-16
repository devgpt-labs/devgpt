import getAPIURL from "@/src/utils/getAPIURL";

const generateNewGenerationCode = async (
  prompt,
  answers,
  context,
  language,
  existingCodeString,
  followUpPrompt,
  directory,
  UID
) => {
  try {
    const response = await fetch(`${getAPIURL}/generate-new-generation-code`, {
      method: "POST",
      body: JSON.stringify({
        prompt,
        answers,
        context,
        language,
        existingCodeString,
        followUpPrompt,
        directory,
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
