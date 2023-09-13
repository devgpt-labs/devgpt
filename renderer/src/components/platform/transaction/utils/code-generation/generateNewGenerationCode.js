import getAPIURL from "@/src/utils/getAPIURL";

const generateNewGenerationCode = async (
  followUpPrompt,
  answers,
  context,
  language,
  existingCodeString,
  prompt,
  directory,
  UID
) => {
  try {
    const response = await fetch(`${getAPIURL}/generate-new-generation-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        followUpPrompt,
        answers,
        context,
        language,
        existingCodeString,
        prompt,
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
