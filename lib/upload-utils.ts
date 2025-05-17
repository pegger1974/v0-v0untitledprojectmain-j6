import { createClient } from "@supabase/supabase-js"
import { v4 as uuidv4 } from "uuid"

export type UploadResult = {
  path: string
  url: string
}

/**
 * Gets an admin Supabase client with service role key
 * @returns Supabase admin client
 */
function getAdminClient() {
  return createClient(
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  )
}

/**
 * Ensures that a storage bucket exists, creating it if necessary
 * @param bucket The storage bucket name to check/create
 * @returns Promise indicating success
 */
async function ensureBucketExists(bucket: string): Promise<boolean> {
  // Use admin client for bucket operations to bypass RLS
  const adminSupabase = getAdminClient()

  try {
    // Check if bucket exists
    const { data: buckets } = await adminSupabase.storage.listBuckets()
    const bucketExists = buckets?.some((b) => b.name === bucket)

    if (!bucketExists) {
      // Create the bucket if it doesn't exist
      const { error } = await adminSupabase.storage.createBucket(bucket, {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      })

      if (error) {
        // If the error is not "bucket already exists", return false
        if (!error.message.includes("already exists")) {
          console.error(`Error creating bucket ${bucket}:`, error)
          return false
        }
        // If the bucket already exists, we can continue
      }
    }

    return true
  } catch (error) {
    console.error(`Error ensuring bucket ${bucket} exists:`, error)
    return false
  }
}

/**
 * Uploads a file to Supabase Storage
 * @param file The file to upload
 * @param bucket The storage bucket to upload to
 * @param folder Optional folder path within the bucket
 * @returns Promise with the file path and public URL
 */
export async function uploadFile(
  file: File,
  bucket: "profile_images" | "post_images" | "post_videos" | "event_images",
  folder = "",
): Promise<UploadResult> {
  const adminSupabase = getAdminClient()

  // Ensure the bucket exists before attempting to upload
  const bucketExists = await ensureBucketExists(bucket)
  if (!bucketExists) {
    throw new Error(`Storage bucket "${bucket}" does not exist and could not be created`)
  }

  // Generate a unique file name to prevent collisions
  const fileExt = file.name.split(".").pop()
  const fileName = `${uuidv4()}.${fileExt}`
  const filePath = folder ? `${folder}/${fileName}` : fileName

  // Upload the file using admin client to bypass RLS
  const { data, error } = await adminSupabase.storage.from(bucket).upload(filePath, file, {
    cacheControl: "3600",
    upsert: true, // Changed to true to overwrite existing files with the same name
  })

  if (error) {
    console.error("Error uploading file:", error)
    throw new Error(`Failed to upload file: ${error.message}`)
  }

  // Get the public URL
  const { data: urlData } = adminSupabase.storage.from(bucket).getPublicUrl(data.path)

  return {
    path: data.path,
    url: urlData.publicUrl,
  }
}

/**
 * Deletes a file from Supabase Storage
 * @param path The file path to delete
 * @param bucket The storage bucket containing the file
 * @returns Promise indicating success or failure
 */
export async function deleteFile(
  path: string,
  bucket: "profile_images" | "post_images" | "post_videos" | "event_images",
): Promise<boolean> {
  const adminSupabase = getAdminClient()

  const { error } = await adminSupabase.storage.from(bucket).remove([path])

  if (error) {
    console.error("Error deleting file:", error)
    return false
  }

  return true
}
