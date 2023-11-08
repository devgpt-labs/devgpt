const prepare_files = (req, res, next) => {
  const selectedFiles = req.body.selectedFiles; // Get the list of selected files
  if (!selectedFiles || !Array.isArray(selectedFiles)) {
    return res.status(400).send("Invalid selectedFiles parameter");
  }

  console.log("prepare_files started:", selectedFiles);

  // Initialize an array to hold the prepared files
  const preparedFiles = [];

  // Loop through each selected file and prepare it
  for (const file of selectedFiles) {
    const preparedFile = {
      fileName: file.fileName, // Copying from the original file object
      originalContent: null, // Original content of the file
      newContent: null, // Placeholder for new content to be generated
      tasksCompletedPreviously: "", // Placeholder for storing tasks completed on this file
      similarFile: {
        fileName: file.similarFile,
        content: null,
      }, // Placeholder for storing similar files
    };

    preparedFiles.push(preparedFile);
  }

  // Update the request object with the prepared files
  req.body.preparedFiles = preparedFiles;

  // Forward the request to the next middleware or route handler
  next();
};

module.exports = prepare_files;
