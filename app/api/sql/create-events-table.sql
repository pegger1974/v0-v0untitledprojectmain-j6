-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  location TEXT NOT NULL,
  address TEXT,
  is_online BOOLEAN DEFAULT false,
  is_private BOOLEAN DEFAULT false,
  max_attendees INTEGER,
  cover_image TEXT,
  category TEXT,
  organizer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event_attendees junction table
CREATE TABLE IF NOT EXISTS event_attendees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'registered', -- registered, attended, cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Create event_categories table
CREATE TABLE IF NOT EXISTS event_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO event_categories (name) 
VALUES ('Rally'), ('Festival'), ('Workshop'), ('Exhibition'), ('Anniversary'), ('International'), ('Meetup')
ON CONFLICT (name) DO NOTHING;

-- Create RLS policies for events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policy for viewing events
CREATE POLICY "Public events are viewable by everyone" 
ON events FOR SELECT 
USING (NOT is_private OR auth.uid() = organizer_id);

-- Policy for inserting events
CREATE POLICY "Users can create events" 
ON events FOR INSERT 
WITH CHECK (auth.uid() = organizer_id);

-- Policy for updating events
CREATE POLICY "Users can update their own events" 
ON events FOR UPDATE 
USING (auth.uid() = organizer_id);

-- Policy for deleting events
CREATE POLICY "Users can delete their own events" 
ON events FOR DELETE 
USING (auth.uid() = organizer_id);

-- Create RLS policies for event_attendees
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;

-- Policy for viewing attendees
CREATE POLICY "Event organizers can view attendees" 
ON event_attendees FOR SELECT 
USING (
  auth.uid() IN (
    SELECT organizer_id FROM events WHERE id = event_id
  ) OR auth.uid() = user_id
);

-- Policy for registering for events
CREATE POLICY "Users can register for events" 
ON event_attendees FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy for updating registration
CREATE POLICY "Users can update their own registration" 
ON event_attendees FOR UPDATE 
USING (auth.uid() = user_id);

-- Policy for cancelling registration
CREATE POLICY "Users can cancel their own registration" 
ON event_attendees FOR DELETE 
USING (auth.uid() = user_id);

-- Create storage bucket for event images if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('event_images', 'event_images', true)
  ON CONFLICT (id) DO NOTHING;
  
  -- Set up storage policy to allow authenticated users to upload
  INSERT INTO storage.policies (name, definition, bucket_id)
  VALUES (
    'Authenticated users can upload event images',
    '(role() = ''authenticated'')',
    'event_images'
  )
  ON CONFLICT (name, bucket_id) DO NOTHING;
  
  -- Set up storage policy to allow public access to event images
  INSERT INTO storage.policies (name, definition, bucket_id)
  VALUES (
    'Public access to event images',
    '(role() = ''anon'')',
    'event_images'
  )
  ON CONFLICT (name, bucket_id) DO NOTHING;
END $$;
