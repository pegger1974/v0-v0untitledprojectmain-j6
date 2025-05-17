import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { SocialFeed } from "./social-feed"
import { getPosts } from "./actions"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function SocialPage() {
  try {
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })

    // Get the current user
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      console.error("Error getting session:", error)
    }

    // Debug session information
    console.log("Server component session info:", {
      hasSession: !!data?.session,
      hasUser: !!data?.session?.user,
      userId: data?.session?.user?.id || "none",
      cookieCount: cookieStore.getAll().length,
    })

    const user = data.session?.user || null

    // Get user profile if user is logged in
    let userProfile = null
    if (user) {
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()
      userProfile = profileData
    }

    // Merge user auth data with profile data
    const currentUser = user
      ? {
          ...user,
          ...userProfile,
        }
      : null

    // Get posts
    const { posts } = await getPosts()

    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Social Feed</h1>
        <SocialFeed initialPosts={posts} currentUser={currentUser} />
      </div>
    )
  } catch (error) {
    console.error("Error in SocialPage:", error)
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Social Feed</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <h3 className="font-bold">Error loading social feed</h3>
          <p>There was a problem loading the social feed. Please try again later.</p>
        </div>
      </div>
    )
  }
}
