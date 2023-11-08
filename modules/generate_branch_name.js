const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generate_branch_name = async (req, res, next) => {
  const task = req.body.task;

  if (!task) {
    return res.status(400).send("Invalid parameters in generate_branch_nameß");
  }

  const prompt = `Given the task of "${task}", what would you name this branch in git?`;

  try {
    console.log("generate_branch_name started:", task);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      temperature: 0,
      stream: false,
      messages: [
        {
          role: "system",
          content:
            "Please name the developer's branch, the response should by hyphenated and lowercase with dashes between words, like a standard git branch name.",
        },
        {
          role: "user",
          content: `Task: "${prompt}"`,
        },
      ],
    });

    const message = response.choices[0].message.content;

    // Update the request object with the selected files
    req.body.branchName = message;

    // Forward the request to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = generate_branch_name;
