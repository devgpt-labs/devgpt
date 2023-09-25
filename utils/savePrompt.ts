// Write the user's email address, prompt, and response to a Supabase table called prompts
import { supabase } from "@/utils/supabase";
import { mockManager } from "@/app/configs/mockManager";

export async function savePrompt(
  email: string,
  prompt: string,
  response: string
) {
 
  if (!email || !prompt || !response) {
    throw new Error("Missing required fields");
  }

  if (mockManager.isMockIntegrationsEnabled()) {
    console.log("In development mode. Not saving to Supabase.");
    console.log({ email, prompt, response });
    // Mock a response
    return { email_address: email, prompt: prompt, output: response };
  }

  if (!supabase) {
    throw new Error("Supabase not initialized");
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
