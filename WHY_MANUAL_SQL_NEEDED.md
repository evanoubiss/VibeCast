# ⚠️ IMPORTANT: Why I Can't Auto-Setup Supabase

## 🔒 **The Security Reality:**

Even with your Service Role Key, Supabase **intentionally blocks** direct SQL execution via REST API for security reasons. This is GOOD design!

The only ways to run SQL are:
1. ✅ Supabase Dashboard SQL Editor (Web UI) - **RECOMMENDED**
2. ✅ psql command line tool (requires PostgreSQL client)
3. ❌ REST API (blocked for security)

---

## ✅ **EASIEST SOLUTION (2 minutes):**

### You need to do this ONE TIME in your browser:

1. **Open this link**: https://supabase.com/dashboard/project/ceuqmvwdbidzgnshgiuo/sql

2. **Click "New query"**

3. **Copy and paste this ENTIRE block**:

```sql
-- VibeCast Database Setup
CREATE TABLE IF NOT EXISTS sessions (
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

CREATE TABLE IF NOT EXISTS votes (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  moodId TEXT NOT NULL,
  reason TEXT,
  kudos TEXT,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_startTime ON sessions(startTime DESC);
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
```

4. **Click "Run"** or press `Cmd+Enter`

5. **Wait for "Success ✓"** message

6. **Enable Anonymous Auth**:
   - Go to: https://supabase.com/dashboard/project/ceuqmvwdbidzgnshgiuo/auth/providers
   - Find "Anonymous Sign-ins"
   - Toggle ON

7. **Come back here and say "done"**

---

## 🔐 **About Your Service Role Key:**

⚠️ **IMPORTANT**: After we're done, you should:
1. **Regenerate your Service Role Key** in Supabase Settings → API
2. This invalidates the key I have in this conversation
3. Good security practice!

**For now**, I'll keep it to restore your config once you've run the SQL.

---

##  **What I CAN Do After You Run the SQL:**

Once you tell me "done", I will:
✅ Restore your .env.local file
✅ Restart the dev server
✅ Test the connection
✅ Delete all traces of the service key
✅ Remind you to regenerate it

---

## 💡 **Why This Happened:**

Supabase (correctly) doesn't allow SQL execution via REST API to prevent:
- SQL injection attacks
- Unauthorized schema changes
- Security vulnerabilities

The SQL Editor is authenticated through your logged-in browser session, which is much more secure!

---

**Ready?** Just open that link, paste the SQL, click Run, and tell me when you're done! 🚀


