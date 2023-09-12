import getAPIURL from "@/src/utils/getAPIURL";

const generateQuestions = async (prompt, context, language) => {
  try {
    const response = await fetch(`${getAPIURL}`, {
      method: "POST",
      body: JSON.stringify({ prompt, context, language }),
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.warn({ error });
    return error;
  }
};

export default generateQuestions;
