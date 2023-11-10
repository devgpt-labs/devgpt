const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3999;

//routes
const get_access_token = require("./modules/get_access_token.js");
const generate_branch_details = require("./modules/generate_branch_details.js");
const prune_lofaf = require("./modules/prune_lofaf.js");
const select_files = require("./modules/select_files.js");
const prepare_files = require("./modules/prepare_files.js");
const read_files = require("./modules/read_files.js");
const gpt_cannon = require("./modules/gpt_cannon.js");

// Middleware for parsing JSON and URL-encoded forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `);
});

app.get("/", (req, res) => {
  res.send("API is operational 🤖");
});

app.post(
  "/generate",
  get_access_token,
  generate_branch_details,
  prune_lofaf,
  select_files,
  prepare_files,
  read_files,
  gpt_cannon,
  (req, res) => {
    // The final modified files will be in req.body.preparedFiles
    const { generatedFiles, branchName, branchDescription, tag } = req.body;

    console.log("Finished generating files");

    // Do something with the modified files, like saving or sending them somewhere
    res.json({
      success: true,
      generatedFiles,
      branchName,
      branchDescription,
      tag,
    });
  }
);

app.post("/validation", get_access_token, (req, res) => {
  const { accessToken } = req.body;
  if (accessToken) {
    res.json({
      success: true,
    });
  } else {
    res.json({
      success: false,
    });
  }
});

// Export the Express API
module.exports = app;