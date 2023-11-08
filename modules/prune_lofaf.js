const { getLofaf } = require("git-connectors");

const prune_lofaf = async (req, res, next) => {
  try {
    const { repo, owner, accessToken } = req.body;

    console.log({ repo, owner, accessToken });

    console.log("prune_lofaf started:", owner);

    const lofaf = await getLofaf(owner, repo, accessToken);

    // Filter out the unnecessary files
    let prunedLofaf = lofaf.split(",");

    // Update the request object with the pruned lofaf
    req.body.prunedLofaf = prunedLofaf;

    // Forward the request to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error fetching lofaf:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = prune_lofaf;
