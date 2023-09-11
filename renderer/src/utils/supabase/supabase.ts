import { createClient } from "@supabase/supabase-js";

let credentials;
if (
  process?.env?.NEXT_PUBLIC_SUPABASE_URL &&
  process?.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY
) {
  credentials = createClient(
    process?.env?.NEXT_PUBLIC_SUPABASE_URL,
    process?.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export const supabase = credentials;


