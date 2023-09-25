import { supabase } from "@/utils/supabase";

// Get the number of prompts this user has ran today from supabase 'prompts' table
const getPromptCount = async (emailAddress: string, setPromptCount: any) => {
  if (!supabase) return;

  console.log("getting prompt count...");

  const { data, error } = await supabase
    .from("prompts")
    .select("id")
    .eq("email_address", emailAddress)
    .gte("created_at", new Date().toISOString().slice(0, 10));
  if (error) throw error;

  setPromptCount(data?.length);
};

export default getPromptCount;
