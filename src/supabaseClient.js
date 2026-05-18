import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project-url.supabase.co';        // ← Paste your URL
const supabaseAnonKey = 'your-anon-public-key-here';               // ← Paste your anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
