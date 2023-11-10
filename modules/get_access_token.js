const { getAccessToken } = require("git-connectors");
require("dotenv").config();

const get_access_token = async (req, res, next) => {
  try {
    const { login, repo } = req.body;

    getAccessToken(
      repo,
      login,
      process.env.APP_ID,
      JSON.parse(process.env.PEM).pem
    ).then((token) => {
      req.body.accessToken = token;
      next();
    });
  } catch (error) {
    console.error("Error calling get access token:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = get_access_token;
