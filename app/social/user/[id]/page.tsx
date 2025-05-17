import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SocialFeed } from "../../social-feed"
import { Calendar, MapPin, Mail, LinkIcon } from "lucide-react"

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

export default async function UserProfilePage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()

  // Get the user profile
  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", params.id).single()

  if (error || !profile) {
    console.error("Error fetching profile:", error)
    notFound()
  }

  // Get the user's posts
  const { data: posts, error: postsError } = await supabase
    .from("social_posts")
    .select("*")
    .eq("user_id", params.id)
    .order("created_at", { ascending: false })
    .limit(10)

  if (postsError) {
    console.error("Error fetching posts:", postsError)
  }

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Get like counts for each post
  const likeCounts = await Promise.all(
    (posts || []).map(async (post) => {
      const { count, error } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id)

      return {
        post_id: post.id,
        count: error ? 0 : count || 0,
      }
    }),
  )

  // Create a map of post IDs to like counts
  const likeCountMap = likeCounts.reduce((map: Record<string, number>, item) => {
    map[item.post_id] = item.count
    return map
  }, {})

  // Get comment counts for each post
  const commentCounts = await Promise.all(
    (posts || []).map(async (post) => {
      const { count, error } = await supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id)

      return {
        post_id: post.id,
        count: error ? 0 : count || 0,
      }
    }),
  )

  // Create a map of post IDs to comment counts
  const commentCountMap = commentCounts.reduce((map: Record<string, number>, item) => {
    map[item.post_id] = item.count
    return map
  }, {})

  // If user is logged in, check which posts they've liked
  let userLikes: Record<string, boolean> = {}
  if (session?.user) {
    const { data: likes, error: likesError } = await supabase
      .from("likes")
      .select("post_id")
      .eq("user_id", session.user.id)

    if (!likesError && likes) {
      userLikes = likes.reduce((map: Record<string, boolean>, like) => {
        map[like.post_id] = true
        return map
      }, {})
    }
  }

  // Combine posts with profile and like information
  const postsWithDetails = (posts || []).map((post) => ({
    ...post,
    profile,
    likes_count: likeCountMap[post.id] || 0,
    user_has_liked: !!userLikes[post.id],
    comments_count: commentCountMap[post.id] || 0,
    comments: [], // We'll load comments on demand
  }))

  // Get user stats
  const { count: postsCount } = await supabase
    .from("social_posts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", params.id)

  const { count: likesCount } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("user_id", params.id)

  const { count: commentsCount } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("user_id", params.id)

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="bg-gray-900 rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
            <Image
              src={profile.avatar_url || "/images/avatars/default-avatar.png"}
              alt={profile.full_name || "User"}
              width={128}
              height={128}
              className="object-cover"
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold">{profile.full_name || "Anonymous User"}</h1>
            {profile.username && <p className="text-gray-400">@{profile.username}</p>}

            <div className="mt-4 space-y-2">
              {profile.bio && <p>{profile.bio}</p>}

              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                {profile.location && (
                  <div className="flex items-center text-sm text-gray-400">
                    <MapPin className="mr-1 h-4 w-4" />
                    {profile.location}
                  </div>
                )}

                {profile.website && (
                  <div className="flex items-center text-sm text-gray-400">
                    <LinkIcon className="mr-1 h-4 w-4" />
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-orange-500"
                    >
                      {profile.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}

                {profile.email && (
                  <div className="flex items-center text-sm text-gray-400">
                    <Mail className="mr-1 h-4 w-4" />
                    <a href={`mailto:${profile.email}`} className="hover:text-orange-500">
                      {profile.email}
                    </a>
                  </div>
                )}

                {profile.created_at && (
                  <div className="flex items-center text-sm text-gray-400">
                    <Calendar className="mr-1 h-4 w-4" />
                    Joined {new Date(profile.created_at).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center md:justify-start gap-4 mt-6">
              {session?.user?.id === profile.id ? (
                <Button asChild className="bg-orange-500 hover:bg-orange-600">
                  <Link href="/profile/edit">Edit Profile</Link>
                </Button>
              ) : (
                <Button className="bg-orange-500 hover:bg-orange-600">Follow</Button>
              )}

              <Button variant="outline" className="bg-gray-800 hover:bg-gray-700">
                Message
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-8 mt-8 pt-4 border-t border-gray-800">
          <div className="text-center">
            <p className="text-2xl font-bold">{postsCount || 0}</p>
            <p className="text-sm text-gray-400">Posts</p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-gray-400">Followers</p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-gray-400">Following</p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold">{likesCount || 0}</p>
            <p className="text-sm text-gray-400">Likes</p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold">{commentsCount || 0}</p>
            <p className="text-sm text-gray-400">Comments</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-6">Posts</h2>
      <SocialFeed initialPosts={postsWithDetails} currentUser={session?.user || null} />
    </div>
  )
}
