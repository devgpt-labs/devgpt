require("dotenv").config();
import { createClient } from "@supabase/supabase-js";
require("dotenv").config({
  path: ".env",
});

let NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
let NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!NEXT_PUBLIC_SUPABASE_URL) {
  NEXT_PUBLIC_SUPABASE_URL = String(process.env.NEXT_PUBLIC_SUPABASE_URL);
}
if (!NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  NEXT_PUBLIC_SUPABASE_ANON_KEY = String(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

if (!NEXT_PUBLIC_SUPABASE_URL)
  console.log("NEXT_PUBLIC_SUPABASE_URL not defined");

let credentials = null;
if (NEXT_PUBLIC_SUPABASE_URL && NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  credentials = createClient(
    NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export const supabase = credentials;
