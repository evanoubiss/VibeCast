-- VibeCast Supabase Database Schema
-- Note: Column names are quoted to preserve camelCase in PostgreSQL
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  "themeType" TEXT NOT NULL CHECK ("themeType" IN ('emoji', 'weather', 'custom')),
  "customOptions" JSONB,
  "startTime" BIGINT NOT NULL,
  "timerDuration" INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'locked', 'revealing', 'completed')),
  "aiSummary" TEXT,
  "aiAction" TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS votes (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  "moodId" TEXT NOT NULL,
  reason TEXT,
  kudos TEXT,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_startTime ON sessions("startTime" DESC);
CREATE INDEX IF NOT EXISTS idx_votes_session_id ON votes(session_id);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all operations on sessions" ON sessions;
CREATE POLICY "Allow all operations on sessions" 
ON sessions FOR ALL 
USING (true) 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on votes" ON votes;
CREATE POLICY "Allow all operations on votes" 
ON votes FOR ALL 
USING (true) 
WITH CHECK (true);


