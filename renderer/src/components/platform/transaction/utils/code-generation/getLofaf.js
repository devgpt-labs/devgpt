import getAPIURL from "@/src/utils/getAPIURL";
import getFilteredLofaf from "@/src/utils/getFilteredLofaf";

const getLofaf = async (prompt, directory) => {
  const lofaf = await getFilteredLofaf(directory);

  try {
    const response = await fetch(`${getAPIURL}/get-lofaf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        "Access-Control-Allow-Headers": "Set-Cookie",
      },
      withCredentials: true,
      body: JSON.stringify({ prompt, directory, lofaf }),
    });
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.warn({ error });
    return error;
  }
};

export default getLofaf;
