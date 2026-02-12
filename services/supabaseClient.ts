
import { createClient } from '@supabase/supabase-js';

// Check if environment variables are configured
export const isSupabaseConfigured = !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);

// Use placeholders to prevent the "supabaseUrl is required" error during initialization
// if the environment variables are not yet set.
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder';

if (!isSupabaseConfigured) {
  console.warn(
    "⚠️ VibeCast: Running in OFFLINE MODE\n" +
    "Supabase environment variables (SUPABASE_URL, SUPABASE_ANON_KEY) are missing.\n" +
    "All data will be stored in localStorage only.\n" +
    "To enable cloud sync, add environment variables to .env.local file."
  );
}

// Create client with placeholder values if not configured
// In offline mode, this client won't be used
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});
