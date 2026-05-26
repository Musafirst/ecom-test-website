import { createClient } from '@supabase/supabase-js'

const supabaseUrl     = process.env.SUPABASE_URL!
const supabaseSecret  = process.env.SUPABASE_SERVICE_KEY!

if (!supabaseUrl || !supabaseSecret) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables')
}

/**
 * Server-only Supabase client using the service_role key.
 * Never import this in client components — it bypasses Row Level Security.
 */
export const supabase = createClient(supabaseUrl, supabaseSecret, {
  auth: { persistSession: false },
})
