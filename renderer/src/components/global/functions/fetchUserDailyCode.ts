import { supabase } from "@/src/utils/supabase/supabase";
import moment from "moment";

const fetchUserDailyCode = async (user_id: string) => {
  const yesterday = moment(new Date()).subtract(1, "days").format("YYYY-MM-DD");
  if (user_id && supabase) {
    const { data, error } = await supabase
      .from("new_transactions")
      .select("history")
      .eq("user_id", user_id)
      .gte("created_at", yesterday);

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
