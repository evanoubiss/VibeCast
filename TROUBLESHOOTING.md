# VibeCast Troubleshooting Guide

## "Session not found" Error

This error occurs when a participant tries to join a session that doesn't exist in their browser's local storage or in the Supabase database.

### Common Causes & Solutions

#### 1. **Supabase Database Not Set Up**

**Symptoms:**
- Browser console shows: `Database tables not found. Please run setup-db.sql`
- Error code: `42P01`
- Session creation shows: "⚠️ Database not set up! Run setup-db.sql in Supabase"

**Solution:**
1. Go to [Supabase SQL Editor](https://supabase.com/dashboard)
2. Select your project
3. Click **SQL Editor** → **New query**
4. Copy and paste the contents of `setup-db.sql` from this project
5. Click **Run** or press `Cmd/Ctrl + Enter`
6. Verify success message appears

#### 2. **Anonymous Authentication Not Enabled**

**Symptoms:**
- Browser console shows: `Anonymous auth error`
- Sessions don't sync between devices/browsers

**Solution:**
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **Authentication** → **Providers**
3. Find **Anonymous Sign-ins**
4. Toggle it **ON**
5. Save changes

#### 3. **Running in Offline Mode**

**Symptoms:**
- Yellow banner at top: "Running in Offline/Local Mode"
- Sessions only work in the same browser

**Explanation:**
The app is missing Supabase credentials and running with localStorage only.

**Solution:**
Create a `.env.local` file in the project root with:

```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

Get these values from: [Supabase Project Settings → API](https://supabase.com/dashboard/project/_/settings/api)

#### 4. **Wrong Session Code**

**Symptoms:**
- Error shows: `Session "ABC123" not found in cloud and local storage`
- Session code is correct but still fails

**Solution:**
- Session codes are **case-sensitive** (though the input auto-uppercases)
- Verify the facilitator successfully created the session (check their screen for the session code)
- Check browser console on facilitator's side for: `✓ Session created and synced to cloud: [CODE]`

#### 5. **Row Level Security (RLS) Policy Issues**

**Symptoms:**
- Session exists but participants can't see it
- Console shows permission errors

**Solution:**
Run this SQL in Supabase SQL Editor to fix policies:

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Allow all operations on sessions" ON sessions;
DROP POLICY IF EXISTS "Allow all operations on votes" ON votes;

-- Recreate permissive policies
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

## Debugging Steps

### Check Browser Console

Open browser DevTools (F12 or Cmd+Option+I) and look for:

**Good signs:**
- `✓ Loaded X session(s) from cloud`
- `✓ Session created and synced to cloud: [CODE]`
- `✓ Vote synced to cloud`

**Warning signs:**
- `⚠️ Database tables not found`
- `⚠️ Check that anonymous auth is enabled`
- `⚠️ Cloud sync unavailable`
- `⚠️ Vote saved locally but not synced to cloud`

### Verify Supabase Configuration

1. **Check environment variables exist:**
   - Look for `.env.local` file in project root
   - Verify it contains `SUPABASE_URL` and `SUPABASE_ANON_KEY`

2. **Test Supabase connection:**
   - Open browser console
   - Look for "Running in OFFLINE MODE" warning
   - If present, Supabase is not configured

3. **Check database tables:**
   - Go to [Supabase Table Editor](https://supabase.com/dashboard)
   - Verify `sessions` and `votes` tables exist
   - If not, run `setup-db.sql`

4. **Verify anonymous auth:**
   - Go to **Authentication** → **Providers**
   - Ensure **Anonymous Sign-ins** is enabled

### Test Session Creation and Joining

**Facilitator side:**
1. Create a session
2. Check console for: `✓ Session created and synced to cloud: [CODE]`
3. If you see "⚠️ Database not set up!" - run setup-db.sql

**Participant side:**
1. Enter the session code
2. Check console for detailed error messages
3. If "Session not found" appears, verify:
   - Session code is correct
   - Supabase is configured (no yellow offline banner)
   - Database is set up

---

## Quick Fixes

### Option 1: Test Offline (Same Browser)

For immediate testing without Supabase:
- Create session in one tab (as facilitator)
- Join session in another tab (as participant)
- Both must be in the **same browser** (uses localStorage)

### Option 2: Full Cloud Setup (Recommended)

1. Set up Supabase:
   - Run `setup-db.sql` in SQL Editor
   - Enable anonymous authentication
   - Add credentials to `.env.local`

2. Restart dev server:
   ```bash
   npm run dev
   ```

3. Clear browser cache (if needed):
   - Open DevTools → Application → Local Storage
   - Delete VibeCast entries
   - Refresh page

---

## Still Having Issues?

1. **Check all console logs** - The app now provides detailed diagnostics
2. **Verify Supabase project is active** - Check dashboard
3. **Try incognito mode** - Rules out browser cache issues
4. **Check network tab** - Look for failed API requests to Supabase

For database structure issues, refer to `setup-db.sql` for the complete schema.

