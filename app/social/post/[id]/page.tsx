import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { SocialFeed } from "../../social-feed"

// Create a Supabase client for server actions
function createServerClient() {
  const cookieStore = cookies()
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()

  // Get the post
  const { data: post, error } = await supabase.from("social_posts").select("*").eq("id", params.id).single()

  if (error || !post) {
    console.error("Error fetching post:", error)
    notFound()
  }

  // Get the user profile for the post
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", post.user_id).single()

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Get like count
  const { count: likesCount } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", post.id)

  // Check if the current user has liked the post
  let userHasLiked = false
  if (session?.user) {
    const { data: like } = await supabase
      .from("likes")
      .select("*")
      .eq("post_id", post.id)
      .eq("user_id", session.user.id)
      .maybeSingle()

    userHasLiked = !!like
  }

  // Get comment count
  const { count: commentsCount } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("post_id", post.id)

  // Combine the post with the profile and counts
  const postWithProfile = {
    ...post,
    profile: profile || null,
    likes_count: likesCount || 0,
    user_has_liked: userHasLiked,
    comments_count: commentsCount || 0,
    comments: [], // We'll load comments on demand
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Post</h1>
      <SocialFeed initialPosts={[postWithProfile]} currentUser={session?.user || null} />
    </div>
  )
}
