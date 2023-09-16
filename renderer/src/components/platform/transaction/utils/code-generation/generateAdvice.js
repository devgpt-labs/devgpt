import getAPIURL from "@/src/utils/getAPIURL";

const generateAdvice = async (prompt, language, UID) => {
  try {
    const response = await fetch(`${getAPIURL}/generate-advice`, {
      method: "POST",
      body: JSON.stringify({ prompt, language, UID }),
    });
    return response;
  } catch (error) {
    console.warn({ error });
    return error;
  }
};

export default generateAdvice;
