-- Create the necessary storage buckets if they don't exist
DO $$
BEGIN
    -- This is a placeholder since we can't directly create buckets via SQL
    -- The actual bucket creation happens in the API route and upload-utils.ts
    
    -- Ensure the profiles table has the necessary columns
    BEGIN
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cover_image_url TEXT;
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location TEXT;
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS website TEXT;
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
    EXCEPTION
        WHEN undefined_table THEN
            CREATE TABLE profiles (
                id UUID PRIMARY KEY,
                username TEXT UNIQUE,
                full_name TEXT,
                avatar_url TEXT,
                cover_image_url TEXT,
                location TEXT,
                website TEXT,
                bio TEXT,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
    END;
END;
$$;
