-- VibeCast Supabase Database Schema
-- Run this SQL in Supabase SQL Editor to set up your database

-- Create sessions table
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  themeType TEXT NOT NULL CHECK (themeType IN ('emoji', 'weather', 'custom')),
  customOptions JSONB,
  startTime BIGINT NOT NULL,
  timerDuration INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'locked', 'revealing', 'completed')),
  aiSummary TEXT,
  aiAction TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table
CREATE TABLE votes (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  moodId TEXT NOT NULL,
  reason TEXT,
  kudos TEXT,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_sessions_startTime ON sessions(startTime DESC);
CREATE INDEX idx_votes_session_id ON votes(session_id);

-- Enable Row Level Security (RLS)
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Create policies to allow anonymous access
-- (Since the app uses anonymous auth, we allow all operations)
CREATE POLICY "Allow all operations on sessions" 
ON sessions FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on votes" 
ON votes FOR ALL 
USING (true) 
WITH CHECK (true);

