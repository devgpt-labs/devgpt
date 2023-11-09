const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const gpt_cannon = async (req, res, next) => {
  let preparedFilesContent = JSON.parse(
    JSON.stringify(req.body.preparedFilesContent)
  ); // Extract preparedFilesContent from the request body - make a deep copy

  if (!preparedFilesContent || !Array.isArray(preparedFilesContent)) {
    return res.status(400).send("Invalid preparedFilesContent parameter");
  }

  try {
    console.log("gpt_cannon started:", preparedFilesContent);

    const task = req.body.task;

    // map over the preparedFilesContent and the details of each file
    const fileDetails = preparedFilesContent.map((file) => {
      const fileName = file.fileName;
      const originalContent = file.originalContent;
      const similarFile = file.similarFile;

      return `${fileName ? `Original file name:"${fileName}"\n\n` : ""}
			${originalContent ? `Original code:"${originalContent}"\n\n` : ""}
			${
        !originalContent || originalContent.length < 10
          ? `Similar file for reference:"${JSON.stringify(similarFile)}"\n\n`
          : ""
      }
			`;
    });

    // Join the file details into a single string
    const fileDetailsString = fileDetails.join("\n\n");

    // Create a prompt to send to the language model
    const prompt = `Task to complete: "${task}".\n\n
		
		Here is some information about the files you will be editing:\n\n

		${fileDetailsString}`;

    console.log("Starting GPT call:", prompt);

    // Make a call to the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      temperature: 0,
      response_format: { type: "json_object" },
      stream: false,
      messages: [
        {
          role: "system",
          content: `You are writing code for the developer's given task
							please be thorough in your response and complete all features of the task
							If you create new files, please add them to the array of generatedFiles
							Do not remove any comments or documentation
							Important: always return the entire code contained in the file, not just the changes
							
							Response in valid JSON ARRAY of objects containing the following properties:
							
							property name: generatedFiles
							type: 'array'

							generatedFiles should contain objects with the following properties:

							Response in valid JSON with
							property name: 'file_name'
							description: 'The path of the file to be created or updated, this was provided by the developer as "fileName"'
							type: 'string'
							and
							property name: 'new_code'
							description: 'The new contents of this code file'
							type: 'string'
							and
							property name: 'details_of_code_changes'
							description: 'A detailed sentence describing the changes on a granular level'
							type: 'string'`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    console.log("GPT call complete:", response?.choices?.[0]?.message);

    // Extract and process the generated content
    const { generatedFiles } = JSON.parse(
      response.choices?.[0]?.message?.content
    );

    generatedFilesInCorrectFormat = generatedFiles.map((file) => {
      const { new_code, details_of_code_changes, file_name } = file;

      //get the original file object
      const originalFile = preparedFilesContent.find(
        (file) => file.fileName === file_name
      );

      return {
        fileName: file_name,
        originalContent: originalFile?.originalContent || "",
        newContent: new_code,
        tasksCompletedPreviously: details_of_code_changes,
        similarFile: originalFile?.similarFile || "",
      };
    });

    console.log({ generatedFilesInCorrectFormat });

    // Update the request object with the modified preparedFilesContent array
    req.body.generatedFiles = generatedFilesInCorrectFormat;

    // Move to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error with OpenAI API call:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = gpt_cannon;
