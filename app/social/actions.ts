"use server"

import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { revalidatePath } from "next/cache"

export type Comment = {
  id: string
  user_id: string
  post_id: string
  content: string
  created_at: string
  updated_at: string
  profile?: {
    id: string
    username?: string
    full_name?: string
    avatar_url?: string
  }
}

export type SocialPost = {
  id: string
  user_id: string
  content: string
  image_url: string | null
  video_url: string | null
  event_id: string | null
  created_at: string
  updated_at: string
  profile?: {
    id: string
    username?: string
    full_name?: string
    avatar_url?: string
  }
  likes_count?: number
  user_has_liked?: boolean
  comments_count?: number
  comments?: Comment[]
}

// Helper function to get or create a user profile
async function getOrCreateProfile(supabase: any, userId: string) {
  try {
    // First, try to get the existing profile
    const { data: existingProfile, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle()

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 is the error code for "no rows returned" which we handle below
      console.error("Error fetching profile:", fetchError)
      throw fetchError
    }

    // If profile exists, return it
    if (existingProfile) {
      return existingProfile
    }

    console.log("No profile found for user, creating one:", userId)

    // Get user details from auth
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError) {
      console.error("Error getting user data:", userError)
      throw userError
    }

    const user = userData.user

    // Create a default profile
    const defaultProfile = {
      id: userId,
      username: `user_${userId.substring(0, 8)}`,
      full_name: user.user_metadata?.full_name || "New User",
      avatar_url: user.user_metadata?.avatar_url || null,
      updated_at: new Date().toISOString(),
    }

    // Insert the new profile
    const { data: newProfile, error: insertError } = await supabase
      .from("profiles")
      .insert(defaultProfile)
      .select()
      .single()

    if (insertError) {
      console.error("Error creating profile:", insertError)
      // Return the default profile even if there was an error inserting
      // This allows the app to continue functioning
      return defaultProfile
    }

    return newProfile
  } catch (error) {
    console.error("Unexpected error in getOrCreateProfile:", error)
    // Return a minimal profile to prevent further errors
    return {
      id: userId,
      username: `user_${userId.substring(0, 8)}`,
      updated_at: new Date().toISOString(),
    }
  }
}

export async function createPost(formData: FormData) {
  try {
    console.log("Starting createPost server action")

    // Create a new Supabase client for each request
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })

    const content = formData.get("content") as string
    const imageUrl = formData.get("imageUrl") as string | null
    const videoUrl = formData.get("videoUrl") as string | null
    const eventId = formData.get("eventId") as string | null

    console.log("Form data received:", {
      content: content?.substring(0, 20) + "...",
      hasImage: !!imageUrl,
      hasVideo: !!videoUrl,
      hasEvent: !!eventId,
    })

    // Get user ID from session
    console.log("Fetching auth session...")
    const { data: sessionData, error: authError } = await supabase.auth.getSession()

    if (authError) {
      console.error("Auth error:", authError)
      return { error: "Authentication error. Please try logging in again." }
    }

    console.log("Session data:", {
      hasSession: !!sessionData?.session,
      hasUser: !!sessionData?.session?.user,
      userId: sessionData?.session?.user?.id || "none",
    })

    if (!sessionData.session || !sessionData.session.user) {
      console.error("No session or user found")

      // Try to get more information about the cookies
      const allCookies = cookieStore.getAll()
      console.log(
        "Available cookies:",
        allCookies.map((c) => c.name),
      )

      return { error: "You must be logged in to create a post" }
    }

    const user = sessionData.session.user

    if (!content && !imageUrl && !videoUrl && !eventId) {
      return { error: "Post must have content or media" }
    }

    console.log("Creating post with user ID:", user.id)

    // Get or create the user profile
    const profile = await getOrCreateProfile(supabase, user.id)

    // Insert the post
    const { data: postData, error } = await supabase
      .from("social_posts")
      .insert({
        user_id: user.id,
        content,
        image_url: imageUrl,
        video_url: videoUrl,
        event_id: eventId,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating post:", error)
      return { error: error.message }
    }

    console.log("Post created successfully:", postData)

    // Combine the post with the profile
    const postWithProfile = {
      ...postData,
      profile: profile || null,
      likes_count: 0,
      user_has_liked: false,
      comments_count: 0,
      comments: [],
    }

    // Revalidate the social page to show the new post
    revalidatePath("/social")

    return { success: true, post: postWithProfile }
  } catch (err) {
    console.error("Unexpected error creating post:", err)
    return { error: "An unexpected error occurred" }
  }
}

export async function getPosts() {
  try {
    // Create a new Supabase client for each request
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })

    console.log("Fetching posts...")

    // Create a simple mock post for testing
    const mockPosts = [
      {
        id: "mock-post-1",
        user_id: "mock-user-1",
        content: "Welcome to the social feed! This is a placeholder post while we set up the database.",
        image_url: null,
        video_url: null,
        event_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        profile: {
          id: "mock-user-1",
          username: "scooter_enthusiast",
          full_name: "Scooter Enthusiast",
          avatar_url: "/images/avatars/default-avatar.png",
        },
        likes_count: 0,
        user_has_liked: false,
        comments_count: 0,
        comments: [],
      },
    ]

    // First, try a simple query to check if we can access the database
    const { data: testData, error: testError } = await supabase.from("social_posts").select("count").limit(1)

    if (testError) {
      console.error("Error testing database connection:", testError)
      console.log("Returning mock posts due to database error")
      return { posts: mockPosts }
    }

    // Fetch a limited number of posts to reduce load
    const { data: posts, error } = await supabase
      .from("social_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5) // Reduced to just 5 posts to minimize queries

    if (error) {
      console.error("Error fetching posts:", error)
      return { posts: mockPosts }
    }

    console.log(`Found ${posts.length} posts`)

    if (posts.length === 0) {
      return { posts: [] }
    }

    // Get unique user IDs from posts
    const userIds = [...new Set(posts.map((post) => post.user_id))]

    // Fetch profiles for these users in a single query
    const { data: profiles, error: profilesError } = await supabase.from("profiles").select("*").in("id", userIds)

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError)
    }

    // Create a map of user IDs to profiles for quick lookup
    const profileMap = (profiles || []).reduce((map: Record<string, any>, profile) => {
      map[profile.id] = profile
      return map
    }, {})

    // For any missing profiles, create default ones
    for (const userId of userIds) {
      if (!profileMap[userId]) {
        // Create a default profile for display purposes
        profileMap[userId] = {
          id: userId,
          username: `user_${userId.substring(0, 8)}`,
          full_name: "User",
          avatar_url: null,
        }
      }
    }

    // Combine posts with profiles
    const postsWithProfiles = posts.map((post) => ({
      ...post,
      profile: profileMap[post.user_id] || null,
      likes_count: 0, // Default values for now
      user_has_liked: false,
      comments_count: 0,
      comments: [],
    }))

    return { posts: postsWithProfiles }
  } catch (err) {
    console.error("Unexpected error fetching posts:", err)

    // Return empty array in case of error
    return { posts: [] }
  }
}

export async function likePost(postId: string) {
  try {
    // Create a new Supabase client for each request
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })

    // Get the current user
    const { data, error: authError } = await supabase.auth.getSession()

    if (authError) {
      console.error("Auth error:", authError)
      return { error: "Authentication error. Please try logging in again." }
    }

    if (!data.session || !data.session.user) {
      return { error: "You must be logged in to like a post" }
    }

    const user = data.session.user

    // Check if the user has already liked this post
    const { data: existingLike, error: checkError } = await supabase
      .from("likes")
      .select("*")
      .eq("user_id", user.id)
      .eq("post_id", postId)
      .maybeSingle()

    if (checkError) {
      console.error("Error checking for existing like:", checkError)
      return { error: "Failed to check if you've already liked this post" }
    }

    if (existingLike) {
      // User has already liked the post, so unlike it
      const { error: deleteError } = await supabase.from("likes").delete().eq("user_id", user.id).eq("post_id", postId)

      if (deleteError) {
        console.error("Error unliking post:", deleteError)
        return { error: "Failed to unlike the post" }
      }

      // Revalidate the social page to update the like count
      revalidatePath("/social")
      return { success: true, action: "unliked" }
    } else {
      // User hasn't liked the post yet, so like it
      const { error: insertError } = await supabase.from("likes").insert({ user_id: user.id, post_id: postId })

      if (insertError) {
        console.error("Error liking post:", insertError)
        return { error: "Failed to like the post" }
      }

      // Revalidate the social page to update the like count
      revalidatePath("/social")
      return { success: true, action: "liked" }
    }
  } catch (err) {
    console.error("Unexpected error liking/unliking post:", err)
    return { error: "An unexpected error occurred" }
  }
}

export async function getComments(postId: string) {
  try {
    // Create a new Supabase client for each request
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })

    // Get comments for the post
    const { data: comments, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching comments:", error)
      return { comments: [] }
    }

    if (!comments || comments.length === 0) {
      return { comments: [] }
    }

    // Get unique user IDs from comments
    const userIds = [...new Set(comments.map((comment) => comment.user_id))]

    // Fetch profiles for these users
    const { data: profiles, error: profilesError } = await supabase.from("profiles").select("*").in("id", userIds)

    if (profilesError) {
      console.error("Error fetching profiles for comments:", profilesError)
    }

    // Create a map of user IDs to profiles for quick lookup
    const profileMap = (profiles || []).reduce((map: Record<string, any>, profile) => {
      map[profile.id] = profile
      return map
    }, {})

    // For any missing profiles, create default ones
    for (const userId of userIds) {
      if (!profileMap[userId]) {
        // Create a default profile for display purposes
        profileMap[userId] = {
          id: userId,
          username: `user_${userId.substring(0, 8)}`,
          full_name: "User",
          avatar_url: null,
        }
      }
    }

    // Combine comments with profiles
    const commentsWithProfiles = comments.map((comment) => ({
      ...comment,
      profile: profileMap[comment.user_id] || null,
    }))

    return { comments: commentsWithProfiles }
  } catch (error) {
    console.error("Unexpected error fetching comments:", error)
    return { comments: [] }
  }
}

export async function createComment(postId: string, content: string) {
  try {
    // Create a new Supabase client for each request
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })

    if (!content.trim()) {
      return { error: "Comment cannot be empty" }
    }

    // Get the current user
    const { data, error: authError } = await supabase.auth.getSession()

    if (authError) {
      console.error("Auth error:", authError)
      return { error: "Authentication error. Please try logging in again." }
    }

    if (!data.session || !data.session.user) {
      return { error: "You must be logged in to comment" }
    }

    const user = data.session.user

    // Get or create the user profile
    const profile = await getOrCreateProfile(supabase, user.id)

    // Insert the comment
    const { data: commentData, error } = await supabase
      .from("comments")
      .insert({
        user_id: user.id,
        post_id: postId,
        content,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating comment:", error)
      return { error: error.message }
    }

    // Combine the comment with the profile
    const commentWithProfile = {
      ...commentData,
      profile,
    }

    // Revalidate the social page to show the new comment
    revalidatePath("/social")

    return { success: true, comment: commentWithProfile }
  } catch (err) {
    console.error("Unexpected error creating comment:", err)
    return { error: "An unexpected error occurred" }
  }
}

export async function deleteComment(commentId: string) {
  try {
    // Create a new Supabase client for each request
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })

    // Get the current user
    const { data, error: authError } = await supabase.auth.getSession()

    if (authError) {
      console.error("Auth error:", authError)
      return { error: "Authentication error. Please try logging in again." }
    }

    if (!data.session || !data.session.user) {
      return { error: "You must be logged in to delete a comment" }
    }

    const user = data.session.user

    // Check if the comment belongs to the user
    const { data: comment, error: checkError } = await supabase
      .from("comments")
      .select("*")
      .eq("id", commentId)
      .eq("user_id", user.id)
      .maybeSingle()

    if (checkError) {
      console.error("Error checking comment ownership:", checkError)
      return { error: "Failed to verify comment ownership" }
    }

    if (!comment) {
      return { error: "You can only delete your own comments" }
    }

    // Delete the comment
    const { error: deleteError } = await supabase.from("comments").delete().eq("id", commentId)

    if (deleteError) {
      console.error("Error deleting comment:", deleteError)
      return { error: "Failed to delete the comment" }
    }

    // Revalidate the social page to update the comments
    revalidatePath("/social")
    return { success: true }
  } catch (err) {
    console.error("Unexpected error deleting comment:", err)
    return { error: "An unexpected error occurred" }
  }
}
