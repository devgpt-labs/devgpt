import getAPIURL from "@/src/utils/getAPIURL";

const detectPromptIntent = async (prompt) => {
  try {
    const response = await fetch(`${getAPIURL}`, {
      method: "POST",
      body: JSON.stringify({ prompt }),
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.warn({ error });
    return error;
  }
};

export default detectPromptIntent;
