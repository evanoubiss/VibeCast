# 🔧 Fix Database Error - Quick Guide

## ❌ **Current Error:**
```
Failed to load resource: the server responded with a status of 400
Supabase fetch error
```

## ✅ **Root Cause:**
You have valid Supabase credentials in `.env.local`, but the **database tables don't exist yet**.

Your Supabase project: `https://ceuqmvwdbidzgnshgiuo.supabase.co`

---

## 🚀 **Quick Fix (5 minutes):**

### Step 1: Go to Supabase SQL Editor
1. Open: https://supabase.com/dashboard
2. Select your project: `ceuqmvwdbidzgnshgiuo`
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New query"**

### Step 2: Run the Database Schema
1. Open the file: `supabase-schema.sql` from your project
2. **Copy the entire contents** (shown below)
3. **Paste** into the SQL Editor
4. Click **"Run"** or press `Ctrl/Cmd + Enter`
5. Wait for success message ✅

### Step 3: Enable Anonymous Authentication
1. Go to **Authentication** → **Providers**
2. Scroll to **"Anonymous Sign-ins"**
3. Toggle **ON**
4. Save

### Step 4: Refresh Your Browser
1. Go back to http://localhost:3000/
2. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. The errors should be gone! ✅

---

## 📋 **SQL Schema to Run:**

Copy everything below into Supabase SQL Editor:

```sql
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
```

---

## ✅ **Expected Result:**

After running the SQL:
- ✅ `sessions` table created
- ✅ `votes` table created
- ✅ Indexes created
- ✅ RLS policies enabled
- ✅ No more 400 errors!

---

## 🔄 **Alternative: Test Without Supabase First**

If you want to test the app in **offline mode** first:

1. Rename `.env.local` temporarily:
   ```bash
   mv .env.local .env.local.backup
   ```

2. Refresh browser - app will run in offline mode (localStorage only)

3. When ready to enable Supabase, rename it back:
   ```bash
   mv .env.local.backup .env.local
   ```

---

## 🎯 **Quick Links:**

- **Supabase Dashboard**: https://supabase.com/dashboard/project/ceuqmvwdbidzgnshgiuo
- **SQL Editor**: https://supabase.com/dashboard/project/ceuqmvwdbidzgnshgiuo/sql
- **Authentication**: https://supabase.com/dashboard/project/ceuqmvwdbidzgnshgiuo/auth/providers

---

**Once you run the SQL, everything will work!** 🚀


