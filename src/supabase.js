import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ocuzorzjdfwaqeyjmxvc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jdXpvcnpqZGZ3YXFleWpteHZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMTI4OTksImV4cCI6MjA4OTY4ODg5OX0.WV1zCcPIqIBzMsylz6g4qH3Cii6t2CqSnOUZfsWP60M";

export const supabase = createClient(supabaseUrl, supabaseKey);