import getAPIURL from "@/src/utils/getAPIURL";

const saveTaskInDatabase = async (
  user_id,
  transactionId,
  prompt,
  history,
  UID
) => {
  try {
    const response = await fetch(`${getAPIURL}/save-task-in-database`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id, transactionId, prompt, history, UID }),
    });
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.warn({ error });
    return error;
  }
};

export default saveTaskInDatabase;
