import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://zelmdomxfhzjsulxytrx.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplbG1kb214Zmh6anN1bHh5dHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NTkyNDksImV4cCI6MjA3MjAzNTI0OX0.HNtu8JJTz0VCuAspU84y_9Qdw9BQ7x-ynj0WZVCT00Y"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)