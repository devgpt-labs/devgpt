import getAPIURL from "@/src/utils/getAPIURL";

const saveTaskInDatabase = async (user_id, transactionId, prompt, history) => {
  try {
    const response = await fetch(`${getAPIURL}/save-task-in-database`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        "Access-Control-Allow-Headers": "Set-Cookie",
      },
      withCredentials: true,
      body: JSON.stringify({ user_id, transactionId, prompt, history }),
    });
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.warn({ error });
    return error;
  }
};

export default saveTaskInDatabase;
