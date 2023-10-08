// Write the user's email address, prompt, and response to a Supabase table called prompts
import { supabase } from "@/utils/supabase";

export async function savePrompt(
  email: string,
  prompt: string,
  response: string,
  tokens: number
) {
  if (!email || !prompt || !response) {
    throw new Error("Missing required fields");
  }

  if (!supabase) {
    throw new Error("Supabase not initialized");
  }
  const { data, error } = await supabase.from("prompts").insert([
    {
      email_address: email,
      prompt: prompt,
      output: response,
      tokens: tokens,
    },
  ]);

  if (error) {
    console.error(error);
    return error;
  }

  return data;
}
