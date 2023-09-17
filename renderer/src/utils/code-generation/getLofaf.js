import getAPIURL from "@/src/utils/getAPIURL";
import getFilteredLofaf from "@/src/utils/getFilteredLofaf";

const getLofaf = async (prompt, directory, UID) => {
  const lofaf = await getFilteredLofaf(directory);

  try {
    const response = await fetch(`${getAPIURL}/get-lofaf`, {
      method: "POST",
      body: JSON.stringify({ prompt, directory, lofaf, UID }),
    });
    const json = await response.json();
    return "README.MD";
  } catch (error) {
    console.warn({ error });
    return error;
  }
};

export default getLofaf;
