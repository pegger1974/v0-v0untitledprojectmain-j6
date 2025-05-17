import { type NextRequest, NextResponse } from "next/server"
import { createPost } from "@/app/social/actions"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const result = await createPost(formData)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in POST /api/posts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
