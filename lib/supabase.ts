import 'server-only'
import { createClient } from '@supabase/supabase-js'

/**
 * Server-only Supabase client using the service_role key.
 * Never import this in client components because it bypasses Row Level Security.
 */
export function getSupabase() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseSecret = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseSecret) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables')
  }

  return createClient(supabaseUrl, supabaseSecret, {
    auth: { persistSession: false },
  })
}
