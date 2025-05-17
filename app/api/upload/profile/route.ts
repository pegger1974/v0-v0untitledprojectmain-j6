import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const fileType = (formData.get("fileType") as string) || "avatar" // avatar or cover

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Create a Supabase client with the cookies for user authentication
    const supabase = createRouteHandlerClient({ cookies })

    // Check if user is authenticated
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession()

    if (authError || !session) {
      return NextResponse.json({ error: "Authentication required to upload files" }, { status: 401 })
    }

    const userId = session.user.id

    try {
      // Create a separate admin client with the service role key for bucket operations
      // This bypasses RLS policies
      const adminSupabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

      // Check if profile_images bucket exists, create if not
      const { data: buckets } = await adminSupabase.storage.listBuckets()
      const profileBucketExists = buckets?.some((bucket) => bucket.name === "profile_images")

      if (!profileBucketExists) {
        const { error: bucketError } = await adminSupabase.storage.createBucket("profile_images", {
          public: true,
          fileSizeLimit: 5242880, // 5MB
        })

        if (bucketError) {
          console.error("Error creating bucket:", bucketError)
          return NextResponse.json(
            { error: `Failed to create storage bucket: ${bucketError.message}` },
            { status: 500 },
          )
        }
      }

      // Upload the file using the admin client to bypass RLS
      const fileExt = file.name.split(".").pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      const filePath = `${userId}/${fileType}/${fileName}`

      const { data: uploadData, error: uploadError } = await adminSupabase.storage
        .from("profile_images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        })

      if (uploadError) {
        console.error("Error uploading file:", uploadError)
        return NextResponse.json({ error: `Failed to upload file: ${uploadError.message}` }, { status: 500 })
      }

      // Get the public URL
      const { data: urlData } = adminSupabase.storage.from("profile_images").getPublicUrl(uploadData.path)

      // Update the user's profile with the new image URL using the regular client
      if (fileType === "avatar") {
        await supabase.from("profiles").update({ avatar_url: urlData.publicUrl }).eq("id", userId)
      } else if (fileType === "cover") {
        await supabase.from("profiles").update({ cover_image_url: urlData.publicUrl }).eq("id", userId)
      }

      return NextResponse.json({
        success: true,
        url: urlData.publicUrl,
        path: uploadData.path,
      })
    } catch (uploadError: any) {
      console.error("Error uploading file:", uploadError)
      return NextResponse.json({ error: `Failed to upload file: ${uploadError.message}` }, { status: 500 })
    }
  } catch (error: any) {
    console.error("Unexpected error in upload API:", error)
    return NextResponse.json({ error: `An unexpected error occurred during upload: ${error.message}` }, { status: 500 })
  }
}
