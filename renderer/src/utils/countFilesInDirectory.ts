const fs = require("fs");
const path = require("path");

const shouldExclude = (filesToIgnore: any, file: any) => {
  return filesToIgnore.some((str) => file.includes(str.trim()));
};

const countFiles = (dir: any, filesToIgnoreArray: any) => {
  let count = 0;

  const files = fs?.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);

    if (!shouldExclude(filesToIgnoreArray, fullPath)) {
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        count += countFiles(fullPath, filesToIgnoreArray);
      } else {
        count++;
      }
    }
  }

  return count;
};

const countFilesPreperation = (dir: any, fileTypesToRemove: any) => {
  if (!dir) {
    console.log("❌ No directory provided, or no user_id provided");
    return;
  }

  return new Promise((resolve, reject) => {
    //get files to ignore

    let filesToIgnoreArray = fileTypesToRemove.split(",");
    //filter array to remove empty strings
    filesToIgnoreArray = filesToIgnoreArray.filter((str) => str.trim() !== "");

    const newCount = countFiles(dir, filesToIgnoreArray);

    resolve(newCount);
  });
};

export default countFilesPreperation;
