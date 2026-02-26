-- Run this in your Supabase SQL Editor to create the necessary bookings table

CREATE TABLE public.bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    student_name TEXT NOT NULL,
    gender TEXT,
    student_email TEXT NOT NULL,
    student_phone TEXT NOT NULL,
    course TEXT,
    year_of_study TEXT,
    parent_email TEXT,
    parent_phone TEXT,
    aadhaar_number TEXT,
    srm_id TEXT,
    property_name TEXT,
    token_amount INTEGER,
    payment_method TEXT,
    status TEXT
);

-- Row Level Security (RLS) setup to allow anonymous inserts for the mock payment flow
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts" ON public.bookings
    FOR INSERT 
    TO public
    WITH CHECK (true);

-- Optional: Allow public to view bookings (if you want to build a dashboard later)
CREATE POLICY "Allow public selects" ON public.bookings
    FOR SELECT
    TO public
    USING (true);
