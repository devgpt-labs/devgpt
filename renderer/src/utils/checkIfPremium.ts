import { supabase } from "./supabase/supabase";
import moment from "moment";

const checkIfPremium = async (user: any) => {
  return new Promise(async (resolve) => {
    const devMode = process?.env?.NEXT_PUBLIC_DEVELOPER_MODE;
    if (devMode === "true") {
      resolve(true)
    } else {
      if (!supabase) {
        resolve(false);
        return;
      }
  
      const { data, error } = await supabase
        .from("payments")
        .select(`*`)
        .eq("user_id", user?.id);
  
      if (error) {
        resolve(false);
        return;
      }
  
      if (!data) {
        resolve(false);
        return;
      }
      if (data.length === 0) {
        resolve(false);
        return;
      }
      
      //select payment object in array of payments where the current_period_end is latest
      const latestPayment = data.reduce((prev, current) =>
        prev.current_period_end > current.current_period_end ? prev : current
      );

      //check if current_period_end is after today's date
      const isPaymentActive = moment(latestPayment.current_period_end).isAfter(
        moment()
      );

      resolve(!!isPaymentActive);
    }
  });
};

export default checkIfPremium;
