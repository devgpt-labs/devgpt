import getAPIURL from "@/src/utils/getAPIURL";

const generateCode = async (
  prompt,
  answers,
  lofaf,
  directory,
  language,
  context
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
    const response = await fetch(`${getAPIURL}`, {
      method: "POST",
      body: JSON.stringify({
        prompt,
        answers,
        directory,
        language,
        context,
        existing_code,
      }),
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.warn({ error });
    return error;
  }
};

export default generateCode;
