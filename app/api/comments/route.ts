import { type NextRequest, NextResponse } from "next/server"
import { getComments, createComment, deleteComment } from "@/app/social/actions"

export async function GET(request: NextRequest) {
  const postId = request.nextUrl.searchParams.get("postId")

  if (!postId) {
    return NextResponse.json({ success: false, error: "Post ID is required" }, { status: 400 })
  }

  const result = await getComments(postId)

  if (result.error) {
    return NextResponse.json({ success: false, error: result.error }, { status: 500 })
  }

  return NextResponse.json({ success: true, comments: result.comments })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { postId, content } = body

  if (!postId || !content) {
    return NextResponse.json({ success: false, error: "Post ID and content are required" }, { status: 400 })
  }

  const result = await createComment(postId, content)

  if (result.error) {
    return NextResponse.json({ success: false, error: result.error }, { status: 500 })
  }

  return NextResponse.json({ success: true, comment: result.comment })
}

export async function DELETE(request: NextRequest) {
  const commentId = request.nextUrl.searchParams.get("commentId")

  if (!commentId) {
    return NextResponse.json({ success: false, error: "Comment ID is required" }, { status: 400 })
  }

  const result = await deleteComment(commentId)

  if (result.error) {
    return NextResponse.json({ success: false, error: result.error }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
