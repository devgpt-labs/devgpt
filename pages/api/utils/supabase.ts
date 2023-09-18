import { createClient } from "@supabase/supabase-js";

let credentials;
if (process?.env?.SUPABASE_URL && process?.env?.SUPABASE_ANON_KEY) {
  credentials = createClient(
    process?.env?.SUPABASE_URL,
    process?.env?.SUPABASE_ANON_KEY
  );
}

export const supabase = credentials;
