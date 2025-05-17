-- Add cover_image_url column to profiles table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'profiles'
        AND column_name = 'cover_image_url'
    ) THEN
        ALTER TABLE profiles ADD COLUMN cover_image_url TEXT;
    END IF;
END $$;
