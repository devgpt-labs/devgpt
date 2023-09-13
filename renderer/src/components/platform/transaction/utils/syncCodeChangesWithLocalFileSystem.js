// Utils
import writeToFileSystem from "./writeToFileSystem";
import checkOS from "@/src/utils/checkOS";

const syncCodeChangesWithLocalFileSystem = async (code_changes, directory) => {
  code_changes.map(async (file) => {
    let { code, file_name } = file;

    //fail safe - check if file name contains the directory
    if (!file_name.includes(directory)) {
      //if file name starts with a slash, remove it
      if (file_name.startsWith("/") || file_name.startsWith(`\\`)) {
        file_name = file_name.substring(1);
      }

      //add correct slash for OS to dir
      file_name = `${directory}${checkOS("/", `\\`)}${file_name}`;
    }

    await writeToFileSystem(directory, file_name, code);
  });
};

export default syncCodeChangesWithLocalFileSystem;
