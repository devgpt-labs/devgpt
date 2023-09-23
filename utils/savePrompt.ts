//write the user's email address, prompt and response to a supabase table called prompts
import { supabase } from "@/utils/supabase";

export async function savePrompt(
  email: string,
  prompt: string,
  response: string
) {
  if (!supabase) {
    throw new Error("Supabase not initialized");
  }

  if (!email || !prompt || !response) {
    throw new Error("Missing required fields");
  }

  const { data, error } = await supabase
    .from("prompts")
    .insert([{ email_address: email, prompt: prompt, output: response }])
    .select();

  if (error) {
    console.error(error);
    return error;
  }

  return data;
}
