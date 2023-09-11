const fs = require("fs");
const glob = require("glob");
const readFromFileSystem = async (directory, file) => {
  if (!file || !directory) {
    return null;
  }

  try {
    const file_contents = await new Promise((resolve, reject) => {
      // ignore files from node_modules and build folders
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
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            if (!res.includes(file)) {
              reject("file not found");
            }

            fs.readFile(file, { encoding: "utf-8" }, (err, data) => {
              if (!err) {
                resolve(data);
              } else {
                reject(err);
              }
            });
          }
        }
      );
    });

    return file_contents;
  } catch (error) {
    return null;
  }
};

export default readFromFileSystem;
