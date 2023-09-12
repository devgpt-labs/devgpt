import getAPIURL from "@/src/utils/getAPIURL";

const generateAdvice = async (prompt, language) => {
  try {
    const response = await fetch(`${getAPIURL}`, {
      method: "POST",
      body: JSON.stringify({ prompt, language }),
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.warn({ error });
    return error;
  }
};

export default generateAdvice;
