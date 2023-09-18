import fetchUserDailyCode from "./fetchUserDailyCode";
import integers from "@/src/config/planIntegers";
import getUserSubscription from "./getUserSubscription";

const checkUsersCodeUsage = async (user_id: string) => {
  if (!user_id) return { userIsCapped: true, lines: 0 };

  let userIsPremium = false;
  function countLinesOfCode(objectsArray) {
    let totalLines = 0;
    objectsArray.forEach((object) => {
      if (object && object.code) {
        // Splitting the code by newline character and counting the resulting array length
        let lines = object.code.split("\n");
        totalLines += lines.length;
      }
    });

    return totalLines;
  }
  const premium = await getUserSubscription(user_id);
  if (premium.activeSubscription) {
    userIsPremium = true;
  } else {
    userIsPremium = false;
  }

  const lineLimit = userIsPremium
    ? integers.paid_lines_of_code_count
    : integers.free_lines_of_code_count;

  if (user_id) {
    let userCode = await fetchUserDailyCode(user_id);

    if (!userCode) return { userIsCapped: true, lines: 0 };

    if (!userCode?.map) return { userIsCapped: true, lines: 0 };

    userCode = userCode?.map((code) => {
      return JSON.parse(code.history);
    });

    userCode = userCode.flat();

    //only keep user codes where the source is 'code'
    userCode = userCode.filter((code) => {
      return code.source === "code";
    });

    //map the content of each object
    userCode = userCode.map((code) => {
      return code.content[0];
    });

    if (userCode) {
      let totalLines = countLinesOfCode(userCode);

      if (totalLines < lineLimit) {
        return { userIsCapped: true, lines: totalLines };
      } else {
        return { userIsCapped: false, lines: totalLines };
      }
    } else {
      return { userIsCapped: true, lines: 0 };
    }
  }
};

export default checkUsersCodeUsage;
