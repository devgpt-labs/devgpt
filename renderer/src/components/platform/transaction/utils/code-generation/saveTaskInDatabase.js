import getAPIURL from "@/src/utils/getAPIURL";

const saveTaskInDatabase = async (user_id, transactionId, prompt, history) => {
  try {
    const response = await fetch(`${getAPIURL}`, {
      method: "POST",
      body: JSON.stringify({ user_id, transactionId, prompt, history }),
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.warn({ error });
    return error;
  }
};

export default saveTaskInDatabase;
