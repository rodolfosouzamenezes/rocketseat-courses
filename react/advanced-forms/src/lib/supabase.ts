import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
export const SUPABASE_BUCKET = import.meta.env.VITE_SUPABASE_BUCKET;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);