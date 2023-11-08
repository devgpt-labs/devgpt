const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generate_branch_description = async (req, res, next) => {
  const task = req.body.task;
  const branchName = req.body.branchName;

  if (!task || !branchName) {
    return res
      .status(400)
      .send("Invalid parameters in generate_branch_description");
  }

  const prompt = `Given the task of development task of "${task}", and a branch name of "${branchName}", What would you use as a description for the branch?`;

  try {
    console.log("generate_branch_description started:", task, branchName);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      temperature: 0,
      stream: false,
      messages: [
        {
          role: "user",
          content: `Task: "${prompt}"`,
        },
      ],
    });

    const message = response.choices[0].message.content;

    // Update the request object with the selected files
    req.body.branchDescription = message;

    // Forward the request to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = generate_branch_description;
