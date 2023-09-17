const fs = require("fs");
const glob = require("glob");

const writeToFileSystem = async (directory, file, content) => {
  try {
    // use readdir method to read the files of the direcoty
    const getDirectories = (callback) => {
      //ignore files from node_modules and build folders
      glob(
        directory + "/**/*",
        {
          ignore: [
            "**/packages/**",
            "**/bin/**",
            "**/obj/**",
            "**/build/**",
            "**/target/**",
            "**/node_modules/**",
            "**/dist/**",
            "**/pkg/**",
            "**/vendor/**",
          ],
        },
        callback
      );
    };

    const file_contents = getDirectories(async (err, res) => {
      // Get all content before the last / in the file_name
      const file_path = file.substring(0, file.lastIndexOf("/"));

      await fs.promises
        .mkdir(file_path, { recursive: true })
        .catch(console.error);

      await fs.writeFile(String(file), content, { flag: "w" }, function (err) {
        if (err) {
          return console.error(err);
        } else {
          console.log("✨ Eureka! Code written to file.");
        }
      });
    });

    return file_contents;
  } catch (error) {
    console.log(error);
    return;
  }
};
export default writeToFileSystem;
