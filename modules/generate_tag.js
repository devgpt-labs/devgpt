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

  const prompt = `Given the task software task of "${task}", what would you tag this PR as?`;

  try {
    console.log("generate_tag started:", task);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      temperature: 0.4,
      stream: false,
      messages: [
        {
          role: "system",
          content:
            "Please tag the developer's PR, the response should be a single word or phrase, like a standard git tag; e.g. bugfix or feature.",
        },
        {
          role: "user",
          content: `"Add the user's surename to the Profile component."`,
        },
        {
          role: "assistant",
          content: "Feature",
        },
        {
          role: "user",
          content: `Task: "${prompt}"`,
        },
      ],
    });

    const message = response.choices[0].message.content;

    // Update the request object with the selected files
    req.body.tag = message;

    // Forward the request to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = generate_branch_name;
