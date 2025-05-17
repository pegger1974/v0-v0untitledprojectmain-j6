import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const fileType = (formData.get("fileType") as string) || "image"
    const bucket = (formData.get("bucket") as string) || (fileType === "image" ? "post_images" : "post_videos")

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

    // Create an admin client with the service role key for bucket operations
    const adminSupabase = createClient(
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    )

    try {
      // Check if bucket exists
      const { data: buckets } = await adminSupabase.storage.listBuckets()
      const bucketExists = buckets?.some((b) => b.name === bucket)

      if (!bucketExists) {
        // Create the bucket if it doesn't exist using admin client
        const { error: createBucketError } = await adminSupabase.storage.createBucket(bucket, {
          public: true,
          fileSizeLimit: fileType === "image" ? 5 * 1024 * 1024 : 50 * 1024 * 1024, // 5MB for images, 50MB for videos
        })

        if (createBucketError) {
          // If the error is not "bucket already exists", return an error
          if (!createBucketError.message.includes("already exists")) {
            console.error(`Error creating bucket ${bucket}:`, createBucketError)
            return NextResponse.json(
              { error: `Failed to create storage bucket: ${createBucketError.message}` },
              { status: 500 },
            )
          }
          // If the bucket already exists, we can continue
        }
      }

      // Generate a unique file name to prevent collisions
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `${session.user.id}/${fileName}`

      // Upload the file using admin client
      const { data, error: uploadError } = await adminSupabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      })

      if (uploadError) {
        console.error("Error uploading file:", uploadError)
        return NextResponse.json({ error: `Failed to upload file: ${uploadError.message}` }, { status: 500 })
      }

      // Get the public URL
      const { data: urlData } = adminSupabase.storage.from(bucket).getPublicUrl(data.path)

      return NextResponse.json({
        success: true,
        url: urlData.publicUrl,
        path: data.path,
      })
    } catch (error) {
      console.error("Error in file upload:", error)
      return NextResponse.json(
        {
          error: error instanceof Error ? error.message : "Failed to upload file",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Unexpected error in upload API:", error)
    return NextResponse.json(
      {
        error: "An unexpected error occurred during upload",
      },
      { status: 500 },
    )
  }
}
