import getAPIURL from "@/src/utils/getAPIURL";
import readFromFileSystem from "@/src/components/platform/transaction/utils/readFromFileSystem";

const generateCode = async (
  prompt,
  answers,
  lofaf,
  directory,
  language,
  context,
  UID
) => {
  let lofafArray = lofaf.includes(",") ? lofaf.split(",") : [lofaf];

  const existing_code = await Promise.all(
    lofafArray.map(async (file) => {
      const code = await readFromFileSystem(directory, file);

      return {
        file_name: file.trim(),
        code: code,
      };
    })
  );

  try {
    const response = await fetch(`${getAPIURL}/generate-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        answers,
        directory,
        language,
        context,
        existing_code,
        UID,
      }),
    });
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.warn({ error });
    return error;
  }
};

export default generateCode;
