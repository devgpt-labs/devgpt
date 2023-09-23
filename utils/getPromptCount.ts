import {supabase} from '@/utils/supabase'

// Get the number of prompts this user has ran today from supabase 'prompts' table
const getPromptCount = async (user: any, setPromptCount: any) => {
  if (!supabase) return;

  const { data, error } = await supabase
    .from("prompts")
    .select("id")
    .eq("email_address", user?.email)
    .gte("created_at", new Date().toISOString().slice(0, 10));
  if (error) throw error;

  setPromptCount(data?.length);
};

export default getPromptCount;
