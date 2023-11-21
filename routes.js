const express = require('express');
const router = express.Router();

// Import middleware and controllers
const get_access_token = require('./modules/get_access_token.js');
const generate_branch_details = require('./modules/generate_branch_details.js');
const prune_lofaf = require('./modules/prune_lofaf.js');
const select_files = require('./modules/select_files.js');
const prepare_files = require('./modules/prepare_files.js');
const read_files = require('./modules/read_files.js');
const gpt_cannon = require('./modules/gpt_cannon.js');

router.get('/', (req, res) => {
  res.send('API is operational 🤖');
});

router.post(
  '/generate',
  get_access_token,
  generate_branch_details,
  prune_lofaf,
  select_files,
  prepare_files,
  read_files,
  gpt_cannon,
  (req, res) => {
    const { generatedFiles, branchName, branchDescription, tag } = req.body;
    console.log('Finished generating files');
    res.json({
      success: true,
      generatedFiles,
      branchName,
      branchDescription,
      tag,
    });
  }
);

router.post('/validation', get_access_token, (req, res) => {
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

module.exports = router;
