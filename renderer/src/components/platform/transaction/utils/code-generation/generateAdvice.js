import getAPIURL from "@/src/utils/getAPIURL";

const generateAdvice = async (prompt, language, UID) => {
  try {
    const response = await fetch(`${getAPIURL}/generate-advice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, language, UID }),
    });
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.warn({ error });
    return error;
  }
};

export default generateAdvice;
