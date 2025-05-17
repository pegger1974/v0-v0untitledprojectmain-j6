import { createClient } from "@supabase/supabase-js"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// This is a singleton pattern to ensure we only create one client instance
let supabaseClient: ReturnType<typeof createClientComponentClient> | null = null

export function getSupabaseClient() {
  if (!supabaseClient) {
    // For client components, use the createClientComponentClient
    supabaseClient = createClientComponentClient()
  }
  return supabaseClient
}

// For direct access to Supabase in client components
export const supabase = getSupabaseClient()

// For server components and API routes that need direct access
export function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  })
}
