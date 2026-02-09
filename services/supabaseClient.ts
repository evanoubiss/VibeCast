
import { createClient } from '@supabase/supabase-js';

// Use placeholders to prevent the "supabaseUrl is required" error during initialization
// if the environment variables are not yet set.
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);

if (!isSupabaseConfigured) {
  console.warn(
    "VibeCast: Supabase environment variables (SUPABASE_URL, SUPABASE_ANON_KEY) are missing. " +
    "The application is running in 'Offline/Mock' mode. Persistence and real-time features will not work."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
