const getFilesFromString = (stringWithFiles: string) => {
  // Usage
  // getFilesFromString(
  //   "hello world, how @/src/myfiles.js are you dooooing today!! :) ) )! )!) @files/myfiles.com @files famsdf 1 2 3 "
  // )

  //todo move all of these utils to /utils

  const filePaths: string[] = [];

  let start: number = 0;
  let end: number = 0;

  while (start < stringWithFiles.length) {
    // Find the first occurrence of '@' starting from the current position
    start = stringWithFiles.indexOf("@", start);

    // If '@' is not found, break out of the loop
    if (start === -1) {
      break;
    }

    // Find the next space starting from the position after '@'
    end = stringWithFiles.indexOf(" ", start);

    // If space is not found, use the end of the string
    if (end === -1) {
      end = stringWithFiles.length;
    }

    // Extract the file path between '@' and space
    const filePath: string = stringWithFiles.substring(start + 1, end);

    // Add the file path to the list
    filePaths.push(filePath);

    // Update the start position to search for the next '@'
    start = end + 1;
  }

  return filePaths;
};

export default getFilesFromString;
