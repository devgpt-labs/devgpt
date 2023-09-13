import getAPIURL from "@/src/utils/getAPIURL";

const generateQuestions = async (prompt, context, language, UID) => {
  try {
    const response = await fetch(`${getAPIURL}/generate-questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, context, language, UID }),
    });
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.warn({ error });
    return error;
  }
};

export default generateQuestions;
