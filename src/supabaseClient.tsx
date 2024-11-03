import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL: string= "https://izzxyxuwjlaurmfeanfa.supabase.co"
const SUPABASE_KEY: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6enh5eHV3amxhdXJtZmVhbmZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA0Mzg2NzYsImV4cCI6MjA0NjAxNDY3Nn0.LUsx2gK32iKvD9DlfBEzIvqxZhyHWfZQyZfnLlYCirk"
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);




export default supabase

