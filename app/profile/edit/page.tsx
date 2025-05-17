"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Upload, Loader2, ArrowLeft, Camera, AlertCircle } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase-client"
import Link from "next/link"

export default function EditProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAvatarUploading, setIsAvatarUploading] = useState(false)
  const [isCoverUploading, setIsCoverUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)
      const supabase = getSupabaseClient()

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error || !session) {
        console.error("Auth error:", error)
        router.push("/login?redirect=/profile/edit")
        return
      }

      setUser(session.user)
      await fetchProfile(session.user.id)
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  const fetchProfile = async (userId: string) => {
    try {
      const supabase = getSupabaseClient()

      // First check if profile exists
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle()

      if (error && error.code !== "PGRST116") {
        throw error
      }

      // If profile doesn't exist, create one
      if (!data) {
        const { data: userData } = await supabase.auth.getUser()

        const newProfile = {
          id: userId,
          username: `user_${userId.substring(0, 8)}`,
          full_name: userData.user?.user_metadata?.full_name || "New User",
          avatar_url: userData.user?.user_metadata?.avatar_url || null,
          updated_at: new Date().toISOString(),
        }

        const { data: createdProfile, error: createError } = await supabase
          .from("profiles")
          .insert(newProfile)
          .select()
          .single()

        if (createError) {
          throw createError
        }

        setProfile(createdProfile || newProfile)
        setAvatarUrl(createdProfile?.avatar_url || null)
        setCoverUrl(createdProfile?.cover_image_url || null)
      } else {
        setProfile(data)
        setAvatarUrl(data.avatar_url)
        setCoverUrl(data.cover_image_url)
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error)
      setError(`Failed to load your profile: ${error.message}`)
      toast({
        title: "Error",
        description: "Failed to load your profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleFileUpload = async (file: File, type: "avatar" | "cover") => {
    if (type === "avatar") {
      setIsAvatarUploading(true)
    } else {
      setIsCoverUploading(true)
    }

    setError(null)

    try {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size exceeds 5MB limit")
      }

      const formData = new FormData()
      formData.append("file", file)
      formData.append("fileType", type)

      const response = await fetch("/api/upload/profile", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Failed to upload ${type}`)
      }

      if (data.success) {
        if (type === "avatar") {
          setAvatarUrl(data.url)
        } else {
          setCoverUrl(data.url)
        }

        toast({
          title: "Success",
          description: `${type === "avatar" ? "Profile picture" : "Cover image"} uploaded successfully.`,
        })
      } else {
        throw new Error(data.error || `Failed to upload ${type}`)
      }
    } catch (error: any) {
      console.error(`Error uploading ${type}:`, error)
      setError(`Failed to upload ${type}: ${error.message}`)
      toast({
        title: "Upload failed",
        description: `Failed to upload ${type === "avatar" ? "profile picture" : "cover image"}. ${error.message}`,
        variant: "destructive",
      })
    } finally {
      if (type === "avatar") {
        setIsAvatarUploading(false)
      } else {
        setIsCoverUploading(false)
      }
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return
    const file = e.target.files[0]
    await handleFileUpload(file, "avatar")
  }

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return
    const file = e.target.files[0]
    await handleFileUpload(file, "cover")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData(e.target as HTMLFormElement)
      const updatedProfile = {
        full_name: formData.get("fullName") as string,
        username: formData.get("username") as string,
        bio: formData.get("bio") as string,
        location: formData.get("location") as string,
        website: formData.get("website") as string,
        avatar_url: avatarUrl,
        cover_image_url: coverUrl,
        updated_at: new Date().toISOString(),
      }

      const supabase = getSupabaseClient()
      const { error } = await supabase.from("profiles").update(updatedProfile).eq("id", user.id)

      if (error) {
        throw new Error(error.message)
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })

      // Redirect to profile page
      router.push("/profile")
    } catch (error: any) {
      console.error("Error updating profile:", error)
      setError(`Failed to update profile: ${error.message}`)
      toast({
        title: "Update failed",
        description: `Failed to update your profile: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <p className="mt-2 text-gray-400">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" className="mr-2" asChild>
          <Link href="/profile">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Edit Profile</h1>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-200 px-4 py-3 rounded mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>{error}</div>
        </div>
      )}

      <Card className="bg-gray-900 border-gray-800 mb-6">
        <CardHeader>
          <CardTitle>Cover Image</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-800 mb-4">
            <Image
              src={coverUrl || "/placeholder.svg?height=400&width=800&query=abstract+background"}
              alt="Cover image"
              fill
              className="object-cover"
            />
            {isCoverUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity">
              <input
                type="file"
                accept="image/*"
                id="cover"
                className="hidden"
                onChange={handleCoverChange}
                disabled={isCoverUploading}
              />
              <Button
                type="button"
                variant="outline"
                className="bg-black/50 hover:bg-black/70"
                onClick={() => document.getElementById("cover")?.click()}
                disabled={isCoverUploading}
              >
                {isCoverUploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="mr-2 h-4 w-4" />
                )}
                Change Cover Image
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle>Your Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-800 mb-4">
                <Image
                  src={avatarUrl || "/images/avatars/default-avatar.png"}
                  alt="Profile picture"
                  fill
                  className="object-cover"
                />
                {isAvatarUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity">
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-black/50 hover:bg-black/70 rounded-full p-2 h-auto"
                    onClick={() => document.getElementById("avatar")?.click()}
                    disabled={isAvatarUploading}
                  >
                    <Camera className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <input
                type="file"
                accept="image/*"
                id="avatar"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={isAvatarUploading}
              />
              <Button
                type="button"
                variant="outline"
                className="bg-gray-800 hover:bg-gray-700"
                onClick={() => document.getElementById("avatar")?.click()}
                disabled={isAvatarUploading}
              >
                {isAvatarUploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                Change Profile Picture
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  defaultValue={profile?.full_name || ""}
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  defaultValue={profile?.username || ""}
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  defaultValue={profile?.location || ""}
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  defaultValue={profile?.website || ""}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                defaultValue={profile?.bio || ""}
                className="bg-gray-800 border-gray-700"
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                className="bg-gray-800 hover:bg-gray-700"
                onClick={() => router.push("/profile")}
              >
                Cancel
              </Button>

              <Button type="submit" className="bg-orange-500 hover:bg-orange-600" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
