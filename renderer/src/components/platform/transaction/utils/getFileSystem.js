const glob = require("glob");

const getFileSystem = (directory) => {
  return new Promise((resolve, reject) => {
    try {
      const getDirectories = (callback) => {
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

      getDirectories((err, res) => {
        if (err) {
          console.log("Error", err);
          reject(err);
        } else {
          resolve(res);
        }
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

export default getFileSystem;
