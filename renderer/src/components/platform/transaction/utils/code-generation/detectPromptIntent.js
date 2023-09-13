import getAPIURL from "@/src/utils/getAPIURL";

const detectPromptIntent = async (prompt, UID) => {
  try {
    const response = await fetch(`${getAPIURL}/detect-prompt-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
