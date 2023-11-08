const { getCode } = require("git-connectors");

const MAX_CONTENT_LENGTH = 5000; // This should be a parameter
const MAX_SIMILAR_CONTENT_LENGTH = 1500; // This should be a parameter

const read_files = async (req, res, next) => {
  const { repo, owner, accessToken } = req.body;

  const preparedFiles = JSON.parse(JSON.stringify(req.body.preparedFiles)); // Get the list of prepared files, and make a deep copy
  if (!preparedFiles || !Array.isArray(preparedFiles)) {
    return res.status(400).send("Invalid preparedFiles parameter");
  }

  try {
    console.log("read_files started:", preparedFiles);

    // Loop through each prepared file and fetch its content
    for (const file of preparedFiles) {
      const fileName = file.fileName;

      try {
        let content = await getCode(owner, repo, fileName, accessToken);
        //cut the content to a max of MAX_CONTENT_LENGTH
        content = content.substring(0, MAX_CONTENT_LENGTH);

        // Get content
        file.originalContent = content;
      } catch {
        console.log("Error fetching file content, skipping file:", fileName);
      }

      if (file.similarFile) {
        try {
          // Get similar content
          let similarContent = await getCode(
            owner,
            repo,
            file.similarFile.fileName,
            accessToken
          );

          //trim similarFile to MAX_SIMILAR_CONTENT_LENGTH
          similarContent = similarContent.substring(
            0,
            MAX_SIMILAR_CONTENT_LENGTH
          );

          file.similarFile = {
            fileName: file.similarFile.fileName,
            content: similarContent,
          };
        } catch {
          console.log(
            "Error fetching similar file content, skipping file:",
            fileName
          );
        }
      }
    }

    // Update the request object with the populated preparedFiles
    req.body.preparedFilesContent = preparedFiles;

    // Forward the request to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error fetching file contents:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = read_files;
