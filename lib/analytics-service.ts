import { getSupabaseClient } from "@/lib/supabase-client"

// Types for analytics events
export type AnalyticsEvent = {
  event_type: string
  page?: string
  properties?: Record<string, any>
  user_id?: string
}

// Create a function to track events
export async function trackEvent(event: AnalyticsEvent) {
  try {
    const supabase = getSupabaseClient()

    // Get the current user if available
    const {
      data: { session },
    } = await supabase.auth.getSession()
    const userId = session?.user?.id

    // If user_id is not provided but user is logged in, use their ID
    if (!event.user_id && userId) {
      event.user_id = userId
    }

    // For anonymous tracking, we'll use a server-side approach
    // Instead of inserting directly, we'll use a server action or API route
    const response = await fetch("/api/track-analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Failed to track event: ${errorData.error}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Error tracking event:", error)
    // Don't throw the error to prevent breaking the user experience
    return { success: false, error }
  }
}

// Function to get analytics data (admin only)
export async function getAnalytics(options: {
  startDate?: Date
  endDate?: Date
  eventType?: string
  limit?: number
}) {
  try {
    const supabase = getSupabaseClient()

    let query = supabase.from("analytics_events").select("*")

    if (options.startDate) {
      query = query.gte("created_at", options.startDate.toISOString())
    }

    if (options.endDate) {
      query = query.lte("created_at", options.endDate.toISOString())
    }

    if (options.eventType) {
      query = query.eq("event_type", options.eventType)
    }

    if (options.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) throw error

    return { data, success: true }
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return { data: [], success: false, error }
  }
}
