import { supabase } from "@/src/utils/supabase/supabase";
import moment from "moment";

const fetchUserDailyCode = async (user_id: string) => {
  //get date at 00:00:00
  const startDate = moment(new Date())
    .startOf("day")
    .format("YYYY-MM-DD HH:mm:ss");

  if (user_id && supabase) {
    const { data, error } = await supabase
      .from("new_transactions")
      .select("history")
      .eq("user_id", user_id)
      .gte("created_at", startDate);

    if (error) {
      return error;
    }

    if (data) {
      return data;
    }
  } else {
    return null;
  }
};

export default fetchUserDailyCode;
