//utils
import getFileSystem from "../components/platform/transaction/utils/getFileSystem";
import getFilesToIgnore from "@/src/config/getFilesToIgnore";

const getFilteredLofaf = async (full_directory) => {
  const excludedFilesArray = getFilesToIgnore;

  let filteredLofaf = await getFileSystem(full_directory);

  filteredLofaf = filteredLofaf.filter((file) => {
    return !excludedFilesArray.includes(file.file_name);
  });

  return filteredLofaf;
};

export default getFilteredLofaf;
