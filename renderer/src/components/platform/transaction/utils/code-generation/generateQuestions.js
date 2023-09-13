import getAPIURL from "@/src/utils/getAPIURL";

const generateQuestions = async (prompt, context, language) => {
  try {
    const response = await fetch(`${getAPIURL}/generate-questions`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, context, language }),
    });
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.warn({ error });
    return error;
  }
};

export default generateQuestions;
