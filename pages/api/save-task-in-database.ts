import { supabase } from "./utils/supabase";

export default async function handler(req: any, res: any) {
  const parsedBody = JSON.parse(req.body);
  const { user_id, transactionId, prompt, history } = parsedBody;

  if (!user_id || !prompt || !history) {
    res.status(400).send("Missing required parameters");
    return;
  }

  if (!supabase) {
    console.log("❌ No supabase client provided");
    res.status(400).send({ result: "fail - no supabase client provided" });
  }

  if (!user_id || !prompt || !history) {
    console.log("❌ No user_id, prompt, or history provided");
    res
      .status(400)
      .send({ result: "fail - no user_id, prompt, or history provided" });
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
    //@ts-ignore
    transactionObject.transaction_id = transactionId;
  }

  //@ts-ignore
  const { data, error } = await supabase
    .from("new_transactions")
    .upsert(transactionObject)
    .select()
    .single();

  res.status(200).send({ data: data?.transaction_id });
}
