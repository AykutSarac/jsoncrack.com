import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

// Create a single supabase client for interacting with your database
const supabase = createPagesBrowserClient({
  supabaseUrl: "https://bxkgqurwqjmvrqekcbws.supabase.co",
  supabaseKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4a2dxdXJ3cWptdnJxZWtjYndzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA2NDU0MjUsImV4cCI6MjAwNjIyMTQyNX0.3nZ0yhuFjnI3yHbAL8S9UtK-Ny-6F5AylNHgo1tymTU",
});

export { supabase };
