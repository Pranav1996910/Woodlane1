-- Create doors table for storing door products
CREATE TABLE IF NOT EXISTS public.doors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for security
ALTER TABLE public.doors ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view doors (public read access)
CREATE POLICY "Allow public read access"
  ON public.doors FOR SELECT
  USING (true);

-- Allow anyone to insert (for admin through password protection)
CREATE POLICY "Allow public insert"
  ON public.doors FOR INSERT
  WITH CHECK (true);

-- Allow anyone to delete (for admin through password protection)
CREATE POLICY "Allow public delete"
  ON public.doors FOR DELETE
  USING (true);

-- Allow anyone to update (for admin through password protection)
CREATE POLICY "Allow public update"
  ON public.doors FOR UPDATE
  USING (true);
