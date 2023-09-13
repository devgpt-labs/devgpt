import { supabase } from "@/src/utils/supabaseClient";

const saveTaskInDatabase = async (user_id, transactionId, prompt, history) => {
  return new Promise(async (resolve, reject) => {
    if (!supabase) {
      console.log("❌ No supabase client provided");
      reject({ result: "fail - no supabase client provided" });
    }

    if (!user_id || !prompt || !history) {
      console.log("❌ No user_id, prompt, or history provided");
      reject({ result: "fail - no user_id, prompt, or history provided" });
    }

    let transactionObject = {
      user_id: user_id,
      input: prompt,
      history: JSON.stringify(history),
    };

    if (
      transactionId &&
      transactionId !== "new" &&
      typeof transactionId === "string"
    ) {
      transactionObject.transaction_id = transactionId;
    }

    const { data, error } = await supabase
      .from("new_transactions")
      .upsert(transactionObject)
      .select()
      .single();

    resolve(data?.transaction_id);
  });
};

export default saveTaskInDatabase;
