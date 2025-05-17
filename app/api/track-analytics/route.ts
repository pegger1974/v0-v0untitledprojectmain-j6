import { NextResponse } from "next/server"
import { createSupabaseClient } from "@/lib/supabase-server"

export async function POST(request: Request) {
  try {
    const event = await request.json()

    // Validate the event
    if (!event.event_type) {
      return NextResponse.json({ error: "Event type is required" }, { status: 400 })
    }

    // Create a server-side Supabase client with admin privileges
    const supabase = createSupabaseClient()

    // Insert the event into the analytics_events table
    const { error } = await supabase.from("analytics_events").insert({
      event_type: event.event_type,
      page: event.page,
      properties: event.properties,
      user_id: event.user_id || null,
    })

    if (error) {
      console.error("Error inserting analytics event:", error)
      return NextResponse.json({ error: "Failed to track event" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in track-analytics API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
