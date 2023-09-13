import getAPIURL from "@/src/utils/getAPIURL";
import getFilteredLofaf from "@/src/utils/getFilteredLofaf";

const getLofaf = async (prompt, directory, UID) => {
  const lofaf = await getFilteredLofaf(directory);

  try {
    const response = await fetch(`${getAPIURL}/get-lofaf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, directory, lofaf, UID }),
    });
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.warn({ error });
    return error;
  }
};

export default getLofaf;
