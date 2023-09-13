import getAPIURL from "@/src/utils/getAPIURL";

const generateAdvice = async (prompt, language) => {
  try {
    const response = await fetch(`${getAPIURL}/generate-advice`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, language }),
    });
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.warn({ error });
    return error;
  }
};

export default generateAdvice;
