import getAPIURL from "@/src/utils/getAPIURL";

//todo delete all of these unused routes

const detectPromptIntent = async (prompt, UID) => {
  try {
    const response = await fetch(`${getAPIURL}/detect-prompt-intent`, {
      method: "POST",
      body: JSON.stringify({ prompt, UID }),
    });
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.warn({ error });
    return error;
  }
};

export default detectPromptIntent;
