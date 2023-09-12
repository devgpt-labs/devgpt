import getAPIURL from "@/src/utils/getAPIURL";

const getLofaf = async (prompt, directory, directory) => {
  const lofaf = await getFilteredLofaf(directory);

  try {
    const response = await fetch(`${getAPIURL}`, {
      method: "POST",
      body: JSON.stringify({ prompt, directory, lofaf }),
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.warn({ error });
    return error;
  }
};

export default getLofaf;
