import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hcsspkyoomaeciaqmudu.supabase.co';        // ← Paste your URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhjc3Nwa3lvb21hZWNpYXFtdWR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NTY1NDIsImV4cCI6MjA5NDUzMjU0Mn0.5wHCjKoXkjKlyp09rr9Yg1SlWTJpGA_If6Ob83LMYPY';               // ← Paste your anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
