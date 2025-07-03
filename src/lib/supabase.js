import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://lrrvbskpappgyhrbkdby.supabase.co"
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycnZic2twYXBwZ3locmJrZGJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MTgwMTQsImV4cCI6MjA2NzA5NDAxNH0.swgXDra_H3gcjA2_TeAmPWiT7HcIZn1u-N6m3YU2X2A"

export const supabase = createClient(supabaseUrl, supabaseKey)
