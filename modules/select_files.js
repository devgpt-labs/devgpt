const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const select_files = async (req, res, next) => {
  const prunedLofaf = req.body.prunedLofaf;
  const task = req.body.task;

  if (!prunedLofaf || !Array.isArray(prunedLofaf) || !task) {
    return res.status(400).send("Invalid parameters");
  }

  const prompt = `Given the task of "${task}", which files are most relevant for completing the task?`;

  try {
    console.log("select_files started:", prunedLofaf);

    const response = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      response_format: { type: "json_object" },
      temperature: 0,
      stream: false,
      messages: [
        {
          role: "system",
          content: `Your task is to pick files from a list that are relevant to the developer's task,
							Pick as few files as possible to complete the task.
							If new files are needed, please add their paths to the JSON ARRAY of generatedFiles,
							for each file also return a similar file that will be used for reference.
							IMPORTANT: The developer will often quote relevant file names in the task, if so, ONLY return those.
							Response in valid JSON ARRAY of objects containing the following properties:
							
							property name: selectedFiles
							type: 'array'

							selectedFiles should contain objects with the following properties:

							property name: 'fileName'
							description: 'File path of the useful file'
							type: 'string'
							and
							property name: 'similarFile'
							description: 'File path of a similar file to be used as an example'
							type: 'string'`,
        },
        {
          role: "user",
          content: `${prompt} ProjectFiles: "${prunedLofaf}"`,
        },
      ],
    });

    let { selectedFiles } = JSON.parse(response.choices?.[0]?.message?.content);

    const FILES_EDITING_LIMIT = 3; // this should be a parameter
    selectedFiles = selectedFiles.slice(0, FILES_EDITING_LIMIT);

    // Update the request object with the selected files
    req.body.selectedFiles = selectedFiles;

    // Forward the request to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = select_files;
