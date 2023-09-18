import { supabase } from "@/src/utils/supabase/supabase";

const convertToTimeFormat = (minutes) => {
  if (minutes < 60) {
    return `${minutes} minutes`;
  } else if (minutes < 1440) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours} hours`;
    } else {
      return `${hours} hours ${remainingMinutes} minutes`;
    }
  } else {
    const days = Math.floor(minutes / 1440);
    const remainingMinutes = minutes % 1440;
    const hours = Math.floor(remainingMinutes / 60);
    const finalRemainingMinutes = remainingMinutes % 60;

    let result = "";
    if (days === 1) {
      result += "1 day";
    } else {
      result += `${days} days`;
    }

    if (hours > 0) {
      result += ` ${hours} hours`;
    }

    if (finalRemainingMinutes > 0) {
      result += ` ${finalRemainingMinutes} minutes`;
    }

    return result;
  }
};

function countLinesOfCode(objectsArray) {
  let totalLines = 0;

  objectsArray.forEach((object) => {
    if (object.code) {
      // Splitting the code by newline character and counting the resulting array length
      let lines = object.code.split("\n");
      totalLines += lines.length;
    }
  });

  return totalLines;
}

const calculateTimeSaved = async (codeChangesArray, user) => {
  let timeSaved = 0;

  //assume that each line of code written takes just 0.19 of a minute to write to write
  //this is a very rough estimate, but it's a start
  const timePerLine = 0.19;
  const estimationForEachTask = 7.12; //in minutes

  //count the number of lines of code written
  const linesOfCode = countLinesOfCode(codeChangesArray);

  //calculate the time saved
  timeSaved = linesOfCode * timePerLine;

  const { data, error } = await supabase
    .from("new_transactions")
    .select("*")
    .eq("user_id", user?.id);

  let transactionCount = data?.length || 0;

  //return an integer
  return {
    timeSaved: convertToTimeFormat(Math.round(timeSaved)),
    totalTimeSaved:
      transactionCount === 1
        ? convertToTimeFormat(Math.round(timeSaved))
        : convertToTimeFormat(
            Math.round(transactionCount * estimationForEachTask + timeSaved)
          ),
  };
};

export default calculateTimeSaved;
