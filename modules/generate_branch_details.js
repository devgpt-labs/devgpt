const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generate_branch_details = async (req, res, next) => {
  const task = req.body.task;

  if (!task) {
    return res.status(400).send("Invalid parameters");
  }

  const prompt = `I have this task: "${task}". Please generate the branch name, description and tag.`;

  try {
    console.log("generate_branch_details started:", task);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      response_format: { type: "json_object" },
      temperature: 0,
      stream: false,
      messages: [
        {
          role: "system",
          content: `Your task is to generate the git branch details for a developer's task,
							Response in valid JSON object containing the following properties:
							
							property name: 'branchName'
							description: 'The name of the git branch for this task, e.g. feat/add-new-feature'
							type: 'string'
							and
							property name: 'branchDescription'
							description: 'The description of the task being completed in this branch'
							type: 'string'
							and
							property name: 'tag'
							description: 'A tag applied to this branch, e.g. bug-fix, feature, documentation etc.'
							type: 'string'`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    let { branchName, branchDescription, tag } = JSON.parse(
      response.choices?.[0]?.message?.content
    );

    // Update the request object with the branch details
    req.body.branchName = branchName;
    req.body.branchDescription = branchDescription;
    req.body.tag = tag;

    // Forward the request to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = generate_branch_details;
