"use client"

import type React from "react"
import { useState, useRef, useTransition, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share, Send, Plus, ImageIcon, Video, X, AlertCircle, Loader2 } from "lucide-react"
import { type SocialPost, likePost, createComment, getComments, createPost } from "./actions"
import { Comment } from "./comment"
import { ShareDialog } from "./share-dialog"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

interface SocialFeedProps {
  initialPosts: SocialPost[]
  currentUser: any
}

export function SocialFeed({ initialPosts, currentUser: serverUser }: SocialFeedProps) {
  const router = useRouter()
  const { user: clientUser, isLoading, session } = useAuth()
  const [posts, setPosts] = useState<SocialPost[]>(initialPosts)
  const [newPostContent, setNewPostContent] = useState("")
  const [isPending, startTransition] = useTransition()
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({})
  const [isSubmittingComment, setIsSubmittingComment] = useState<Record<string, boolean>>({})
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [sharePostId, setSharePostId] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [previewVideo, setPreviewVideo] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [authError, setAuthError] = useState<string | null>(null)

  // Use either the server-provided user or the client-side auth context
  const user = clientUser || serverUser

  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  // Debug the authentication state
  useEffect(() => {
    console.log("Auth state:", {
      serverUser: serverUser ? `Logged in (server): ${serverUser.id}` : "Not logged in (server)",
      clientUser: clientUser ? `Logged in (client): ${clientUser.id}` : "Not logged in (client)",
      session: session ? `Session exists: ${session.access_token.substring(0, 10)}...` : "No session",
      isLoading,
      postsCount: posts.length,
    })
  }, [serverUser, clientUser, isLoading, posts.length, session])

  const handleImageClick = () => {
    imageInputRef.current?.click()
  }

  const handleVideoClick = () => {
    videoInputRef.current?.click()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image files must be less than 5MB",
          variant: "destructive",
        })
        return
      }

      setSelectedImage(file)
      setSelectedVideo(null)
      setPreviewVideo(null)

      // Create a preview URL
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Check file size (limit to 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Video files must be less than 50MB",
          variant: "destructive",
        })
        return
      }

      setSelectedVideo(file)
      setSelectedImage(null)
      setPreviewImage(null)

      // Create a preview URL
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewVideo(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearMedia = () => {
    setSelectedImage(null)
    setSelectedVideo(null)
    setPreviewImage(null)
    setPreviewVideo(null)

    // Reset file inputs
    if (imageInputRef.current) imageInputRef.current.value = ""
    if (videoInputRef.current) videoInputRef.current.value = ""
  }

  const uploadMedia = async (file: File, fileType: "image" | "video"): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("fileType", fileType)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + Math.random() * 15
        return newProgress > 90 ? 90 : newProgress
      })
    }, 500)

    try {
      // Upload to Supabase Storage via API route
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        throw new Error(errorData.error || `Failed to upload ${fileType}`)
      }

      const uploadData = await uploadResponse.json()

      if (uploadData.success) {
        return uploadData.url
      } else {
        throw new Error(uploadData.error || `Failed to upload ${fileType}`)
      }
    } catch (error) {
      clearInterval(progressInterval)
      setUploadProgress(0)
      throw error
    }
  }

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError(null)

    if (!newPostContent.trim() && !selectedImage && !selectedVideo) {
      toast({
        title: "Empty post",
        description: "Please add some content, an image, or a video to your post.",
        variant: "destructive",
      })
      return
    }

    if (!user) {
      setAuthError("You must be logged in to create a post")
      toast({
        title: "Authentication required",
        description: "You must be logged in to create a post",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append("content", newPostContent)

        // Upload image if selected
        if (selectedImage) {
          try {
            const imageUrl = await uploadMedia(selectedImage, "image")
            formData.append("imageUrl", imageUrl)
          } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Failed to upload image")
          }
        }

        // Upload video if selected
        if (selectedVideo) {
          try {
            const videoUrl = await uploadMedia(selectedVideo, "video")
            formData.append("videoUrl", videoUrl)
          } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Failed to upload video")
          }
        }

        console.log("Submitting post with form data:", {
          content: newPostContent.substring(0, 20) + "...",
          hasImage: !!selectedImage,
          hasVideo: !!selectedVideo,
        })

        // Call the server action to create the post
        const result = await createPost(formData)

        if (result.error) {
          console.error("Error from server action:", result.error)
          setAuthError(result.error)
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          })
          return
        }

        if (result.success && result.post) {
          setPosts([result.post, ...posts])
          setNewPostContent("")
          clearMedia()
          toast({
            title: "Success",
            description: "Your post has been created",
          })
        }
      } catch (error) {
        console.error("Error creating post:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to create post. Please try again."
        setAuthError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setIsUploading(false)
        setUploadProgress(0)
      }
    })
  }

  const handleLikePost = async (postId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to like a post",
        variant: "destructive",
      })
      router.push("/login?redirect=/social")
      return
    }

    try {
      const result = await likePost(postId)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      if (result.success) {
        setPosts(
          posts.map((post) => {
            if (post.id === postId) {
              const newLikesCount =
                result.action === "liked" ? (post.likes_count || 0) + 1 : (post.likes_count || 0) - 1
              return {
                ...post,
                likes_count: newLikesCount,
                user_has_liked: result.action === "liked",
              }
            }
            return post
          }),
        )
      }
    } catch (error) {
      console.error("Error liking post:", error)
      toast({
        title: "Error",
        description: "Failed to like post. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleToggleComments = async (postId: string) => {
    const isExpanded = expandedComments[postId]

    if (!isExpanded) {
      try {
        const { comments } = await getComments(postId)

        setPosts(
          posts.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                comments,
              }
            }
            return post
          }),
        )
      } catch (error) {
        console.error("Error fetching comments:", error)
        toast({
          title: "Error",
          description: "Failed to load comments. Please try again.",
          variant: "destructive",
        })
      }
    }

    setExpandedComments({
      ...expandedComments,
      [postId]: !isExpanded,
    })
  }

  const handleCommentChange = (postId: string, value: string) => {
    setCommentInputs({
      ...commentInputs,
      [postId]: value,
    })
  }

  const handleSubmitComment = async (postId: string) => {
    const content = commentInputs[postId]
    if (!content?.trim()) return

    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to comment",
        variant: "destructive",
      })
      router.push("/login?redirect=/social")
      return
    }

    setIsSubmittingComment({
      ...isSubmittingComment,
      [postId]: true,
    })

    try {
      const result = await createComment(postId, content)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      if (result.success && result.comment) {
        setPosts(
          posts.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                comments: [...(post.comments || []), result.comment],
                comments_count: (post.comments_count || 0) + 1,
              }
            }
            return post
          }),
        )

        setCommentInputs({
          ...commentInputs,
          [postId]: "",
        })
      }
    } catch (error) {
      console.error("Error creating comment:", error)
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingComment({
        ...isSubmittingComment,
        [postId]: false,
      })
    }
  }

  const handleShare = (postId: string) => {
    setSharePostId(postId)
    setShareDialogOpen(true)
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-6 text-center">
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <h3 className="text-xl font-bold mb-2">Loading...</h3>
          <p className="text-gray-600 dark:text-gray-400">Please wait while we load your feed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {authError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>
            {authError}
            <div className="mt-2">
              <Button variant="outline" size="sm" onClick={() => router.push("/login?redirect=/social")}>
                Sign In
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {user ? (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage
                  src={user.avatarUrl || user.user_metadata?.avatar_url || "/images/avatars/default-avatar.png"}
                  alt={user.name || user.user_metadata?.full_name || "You"}
                />
                <AvatarFallback>
                  {(user.name || user.user_metadata?.full_name || "You").substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold">Create a Post</h2>
                <p className="text-sm text-gray-500">
                  Posting as {user.name || user.user_metadata?.full_name || user.email}
                </p>
              </div>
            </div>
          </CardHeader>
          <form onSubmit={handleCreatePost}>
            <CardContent>
              <Textarea
                placeholder="What's on your mind?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="min-h-[100px]"
                disabled={isUploading}
              />

              {/* Media preview */}
              {previewImage && (
                <div className="mt-4 relative">
                  <Image
                    src={previewImage || "/placeholder.svg"}
                    alt="Selected image"
                    width={400}
                    height={300}
                    className="rounded-md max-h-[300px] w-auto object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={clearMedia}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {previewVideo && (
                <div className="mt-4 relative">
                  <video src={previewVideo} controls className="rounded-md max-h-[300px] w-full object-contain" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={clearMedia}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Upload progress */}
              {isUploading && uploadProgress > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Uploading...</span>
                    <span className="text-sm font-medium">{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {/* Hidden file inputs */}
              <input
                type="file"
                accept="image/*"
                ref={imageInputRef}
                onChange={handleImageChange}
                className="hidden"
                disabled={isUploading}
              />
              <input
                type="file"
                accept="video/*"
                ref={videoInputRef}
                onChange={handleVideoChange}
                className="hidden"
                disabled={isUploading}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleImageClick}
                  disabled={isUploading || !!selectedVideo}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Photo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleVideoClick}
                  disabled={isUploading || !!selectedImage}
                >
                  <Video className="h-4 w-4 mr-2" />
                  Video
                </Button>
              </div>
              <Button
                type="submit"
                disabled={isPending || isUploading || (!newPostContent.trim() && !selectedImage && !selectedVideo)}
              >
                {isPending || isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isUploading ? "Uploading..." : "Posting..."}
                  </>
                ) : (
                  "Post"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      ) : (
        <Card className="p-6 text-center">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-4">
              <MessageCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Join the Conversation</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Sign in to share your scooter adventures with the community.
            </p>
            <div className="flex gap-4">
              <Button onClick={() => router.push("/login?redirect=/social")}>Sign In</Button>
              <Button variant="outline" onClick={() => router.push("/signup?redirect=/social")}>
                Sign Up
              </Button>
            </div>
          </div>
        </Card>
      )}

      {posts.length === 0 ? (
        <Card className="p-6 text-center">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="rounded-full bg-gray-100 p-3 mb-4">
              <MessageCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No posts yet</h3>
            <p className="text-gray-500 mb-4">Be the first to share something with the community!</p>
            {user ? (
              <Button onClick={() => document.querySelector("textarea")?.focus()}>
                <Plus className="h-4 w-4 mr-2" />
                Create a Post
              </Button>
            ) : (
              <Button onClick={() => router.push("/login?redirect=/social")}>Sign In to Post</Button>
            )}
          </div>
        </Card>
      ) : (
        posts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage
                    src={post.profile?.avatar_url || "/images/avatars/default-avatar.png"}
                    alt={post.profile?.username || "User"}
                  />
                  <AvatarFallback>{(post.profile?.username || "User").substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{post.profile?.full_name || post.profile?.username || "User"}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(post.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{post.content}</p>
              {post.image_url && (
                <div className="mt-3">
                  <Image
                    src={post.image_url || "/placeholder.svg"}
                    alt="Post image"
                    width={600}
                    height={400}
                    className="rounded-md max-h-[400px] w-auto object-contain"
                  />
                </div>
              )}
              {post.video_url && (
                <div className="mt-3">
                  <video src={post.video_url} controls className="rounded-md max-h-[400px] w-full object-contain" />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col items-stretch pt-0">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-gray-500">{post.likes_count || 0} likes</div>
                <div className="text-sm text-gray-500">{post.comments_count || 0} comments</div>
              </div>
              <div className="flex justify-between border-t border-b py-2">
                <Button variant="ghost" size="sm" className="flex-1" onClick={() => handleLikePost(post.id)}>
                  <Heart className={`h-4 w-4 mr-2 ${post.user_has_liked ? "fill-red-500 text-red-500" : ""}`} />
                  Like
                </Button>
                <Button variant="ghost" size="sm" className="flex-1" onClick={() => handleToggleComments(post.id)}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Comment
                </Button>
                <Button variant="ghost" size="sm" className="flex-1" onClick={() => handleShare(post.id)}>
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>

              {expandedComments[post.id] && (
                <div className="mt-4 space-y-4">
                  {post.comments && post.comments.length > 0 ? (
                    post.comments.map((comment) => <Comment key={comment.id} comment={comment} />)
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-2">No comments yet</p>
                  )}

                  <div className="flex items-center space-x-2 mt-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user?.avatarUrl || user?.user_metadata?.avatar_url || "/images/avatars/default-avatar.png"}
                        alt={user?.name || user?.user_metadata?.full_name || "You"}
                      />
                      <AvatarFallback>
                        {user
                          ? (user.name || user.user_metadata?.full_name || "You").substring(0, 2).toUpperCase()
                          : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex items-center space-x-2">
                      <Textarea
                        placeholder={user ? "Write a comment..." : "Sign in to comment"}
                        value={commentInputs[post.id] || ""}
                        onChange={(e) => handleCommentChange(post.id, e.target.value)}
                        className="min-h-[40px] py-2"
                        disabled={!user}
                      />
                      <Button
                        size="icon"
                        onClick={() => handleSubmitComment(post.id)}
                        disabled={isSubmittingComment[post.id] || !commentInputs[post.id]?.trim() || !user}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardFooter>
          </Card>
        ))
      )}

      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        postId={sharePostId}
        onClose={() => setSharePostId(null)}
      />
    </div>
  )
}
