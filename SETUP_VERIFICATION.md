# VibeCast Setup Verification

## Quick Check: Is Everything Configured?

### 1. Environment Variables ✅/❌

Check if `.env.local` exists:
```bash
ls -la .env.local
```

If it doesn't exist, create it:
```bash
cat > .env.local << 'EOF'
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
VITE_GEMINI_API_KEY=your-gemini-api-key-here
EOF
```

### 2. Supabase Database Setup ✅/❌

**Option A: Using Supabase Dashboard (Recommended)**

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** → **New query**
4. Copy contents of `setup-db.sql` from this project
5. Paste and click **Run**

**Option B: Using psql (Advanced)**

```bash
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres" < setup-db.sql
```

### 3. Anonymous Authentication ✅/❌

1. Go to: https://supabase.com/dashboard/project/[YOUR-PROJECT]/auth/providers
2. Find **Anonymous Sign-ins**
3. Toggle **ON**

### 4. Test the Connection

Run the app:
```bash
npm run dev
```

Open http://localhost:3000 and:
1. Click the **🔧 Debug** button in bottom-right corner
2. Check the diagnostic panel:
   - ✓ Supabase Config: YES
   - ✓ Anonymous Auth: OK
   - ✓ Database Tables: OK
   - ✓ Cloud Sessions: 0 (or more)

### 5. Test Session Creation & Joining

**Facilitator (Tab 1):**
1. Click **Create Session**
2. Fill in details and click **Launch VibeCast**
3. Note the session code (e.g., `ABC123`)
4. Check browser console for: `✓ Session created and synced to cloud: ABC123`

**Participant (Tab 2 or Different Browser):**
1. Click **Join Team**
2. Enter the session code
3. Enter a nickname
4. Click **Join the Vibe**
5. Should see the voting interface

If you see **"Session not found"** error:
- Open browser console (F12)
- Look for specific error messages
- Open the diagnostic panel (🔧 Debug button)
- Follow instructions in `TROUBLESHOOTING.md`

---

## Common Issues

### "Running in Offline/Local Mode" banner appears

**Cause:** No `.env.local` file or missing Supabase credentials

**Fix:** Create `.env.local` with valid credentials

### "⚠️ Database not set up!"

**Cause:** Database tables don't exist

**Fix:** Run `setup-db.sql` in Supabase SQL Editor

### "Session not found"

**Causes:**
1. Database not set up (see above)
2. Anonymous auth not enabled
3. Wrong session code
4. Session only exists locally (offline mode)

**Fix:** Check diagnostic panel and follow recommendations

### Diagnostic panel shows all ✗

**Cause:** Supabase not configured or credentials are invalid

**Fix:** 
1. Verify `.env.local` exists and has correct values
2. Get fresh credentials from Supabase Dashboard → Settings → API
3. Restart dev server: `npm run dev`

---

## Verification Checklist

- [ ] `.env.local` file exists with valid credentials
- [ ] Database tables created (run `setup-db.sql`)
- [ ] Anonymous authentication enabled
- [ ] Dev server running (`npm run dev`)
- [ ] Diagnostic panel shows all ✓
- [ ] Can create session as facilitator
- [ ] Can join session as participant (different browser/tab)
- [ ] Votes appear in real-time on facilitator screen

---

## Still Having Issues?

1. **Open the diagnostic panel** (🔧 Debug button)
2. **Check browser console** for detailed error messages
3. **Read TROUBLESHOOTING.md** for comprehensive solutions
4. **Check Supabase logs** in dashboard

The app now provides detailed diagnostics at every step to help identify issues quickly!

