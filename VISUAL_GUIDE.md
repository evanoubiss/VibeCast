# Visual Guide: Using the New Diagnostic Features

## 1. The Debug Button

When you open VibeCast, you'll see a **🔧 Debug** button in the bottom-right corner:

```
┌────────────────────────────────────────┐
│                                        │
│         VibeCast Interface             │
│                                        │
│                                        │
│                                        │
│                             ┌────────┐ │
│                             │🔧 Debug│ │
│                             └────────┘ │
└────────────────────────────────────────┘
```

## 2. Diagnostic Panel - All Systems Go ✓

Click the debug button to see the diagnostic panel:

```
┌─────────────────────────────────────┐
│ System Diagnostics              ✕   │
├─────────────────────────────────────┤
│ Supabase Config:            YES     │
│ Anonymous Auth:         ✓   OK      │
│ Database Tables:        ✓   OK      │
│ Cloud Sessions:             5       │
│                                     │
│ ─────────────────────────────────── │
│ Local Storage: Has data             │
│                                     │
│ ┌───────────────────────────────┐   │
│ │ 📖 View Troubleshooting Guide │   │
│ └───────────────────────────────┘   │
└─────────────────────────────────────┘
```

**What this means:** Everything is working perfectly! You can create and join sessions across devices.

## 3. Diagnostic Panel - Database Not Set Up ✗

```
┌─────────────────────────────────────┐
│ System Diagnostics              ✕   │
├─────────────────────────────────────┤
│ Supabase Config:            YES     │
│ Anonymous Auth:         ✓   OK      │
│ Database Tables:        ✗   MISSING │
│                                     │
│ ─────────────────────────────────── │
│ Local Storage: Has data             │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ⚠️ Database Not Set Up          │ │
│ │ Run setup-db.sql in Supabase    │ │
│ │ SQL Editor.                     │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌───────────────────────────────┐   │
│ │ 📖 View Troubleshooting Guide │   │
│ └───────────────────────────────┘   │
└─────────────────────────────────────┘
```

**What this means:** Your Supabase credentials are configured, but the database tables haven't been created yet. Follow the instructions to run `setup-db.sql`.

## 4. Diagnostic Panel - Offline Mode

```
┌─────────────────────────────────────┐
│ System Diagnostics              ✕   │
├─────────────────────────────────────┤
│ Supabase Config:        NO (Offline)│
│                                     │
│ ─────────────────────────────────── │
│ Local Storage: Has data             │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ⚠️ Offline Mode Active          │ │
│ │ Add .env.local with Supabase    │ │
│ │ credentials to enable cloud     │ │
│ │ sync.                           │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌───────────────────────────────┐   │
│ │ 📖 View Troubleshooting Guide │   │
│ └───────────────────────────────┘   │
└─────────────────────────────────────┘
```

**What this means:** The app is running in offline mode. Sessions only work in the same browser. To enable cloud sync, add a `.env.local` file with Supabase credentials.

## 5. Improved Error Messages

### When Creating a Session (Facilitator)

**Before Fix:**
```
❌ Database sync failed. Session remains local.
```

**After Fix:**
```
⚠️ Database not set up! Run setup-db.sql in Supabase. 
Session saved locally only.
```

### When Joining a Session (Participant)

**Before Fix:**
```
❌ Session not found. Check the code or Supabase connection.
```

**After Fix (Cloud Mode):**
```
❌ Session "ABC123" not found in cloud and local storage. 
Verify the code is correct.
```

**After Fix (Offline Mode):**
```
❌ Session "ABC123" not found in local storage only 
(offline mode). Verify the code is correct.
```

**After Fix (Database Issue):**
```
❌ Database not set up. Please run setup-db.sql in Supabase.
```

## 6. Browser Console Messages

Open browser DevTools (F12) to see helpful logs:

### Successful Operations ✓

```console
✓ Loaded 3 session(s) from cloud
✓ Session created and synced to cloud: ABC123
✓ Vote synced to cloud
```

### Warnings ⚠️

```console
⚠️ VibeCast: Running in OFFLINE MODE
Supabase environment variables (SUPABASE_URL, SUPABASE_ANON_KEY) are missing.
All data will be stored in localStorage only.

⚠️ Database tables not found. Please run setup-db.sql in Supabase SQL Editor

⚠️ Check that anonymous auth is enabled in Supabase Dashboard

⚠️ Vote saved locally but not synced to cloud
```

## 7. Top Banner Indicators

### Offline Mode
```
┌────────────────────────────────────────────────────┐
│ Running in Offline/Local Mode • Cloud Sync Disabled│ ← Yellow banner
├────────────────────────────────────────────────────┤
│ VibeCast                                           │
```

### Cloud Mode (When in Session)
```
┌────────────────────────────────────────────────────┐
│ VibeCast                    🟢 SESSION: ABC123     │ ← Green dot
```

### Offline Mode (When in Session)
```
┌────────────────────────────────────────────────────┐
│ VibeCast                    🟠 SESSION: ABC123     │ ← Orange dot
```

## 8. Step-by-Step: Fix "Session Not Found" Error

1. **See the error:**
   ```
   ❌ Session not found. Check the code or Supabase connection.
   ```

2. **Click 🔧 Debug button** (bottom-right corner)

3. **Check the diagnostic panel:**
   - If `Database Tables: ✗ MISSING` → Run `setup-db.sql`
   - If `Anonymous Auth: ✗ FAILED` → Enable in Supabase
   - If `Supabase Config: NO` → Create `.env.local` file

4. **Follow the on-screen instructions** or click "📖 View Troubleshooting Guide"

5. **Refresh the page** after fixing

6. **Check diagnostic panel again** - should show all ✓

7. **Try joining the session again** - should work now!

## 9. Complete Setup Checklist

Use the diagnostic panel to verify each step:

```
Setup Progress:

✅ Node.js installed
✅ npm install completed
✅ .env.local created          → Diagnostic: "Supabase Config: YES"
✅ setup-db.sql executed        → Diagnostic: "Database Tables: ✓ OK"
✅ Anonymous auth enabled       → Diagnostic: "Anonymous Auth: ✓ OK"
✅ npm run dev started          → Server running on localhost:3000
✅ All diagnostics show ✓       → Ready to use!
```

## 10. Testing the Complete Flow

### Facilitator (Browser Tab 1)
1. Open http://localhost:3000
2. Click 🔧 Debug - verify all ✓
3. Click "Create Session"
4. Fill in details and launch
5. See session code (e.g., ABC123)
6. Console shows: `✓ Session created and synced to cloud: ABC123`

### Participant (Browser Tab 2 or Different Device)
1. Open http://localhost:3000
2. Click 🔧 Debug - verify all ✓
3. Click "Join Team"
4. Enter session code: ABC123
5. Enter nickname
6. Click "Join the Vibe"
7. Should see voting interface ✓

If step 7 shows "Session not found":
- Open console (F12)
- Check diagnostic panel
- Follow the specific error guidance

---

## Summary

The new diagnostic features make it **immediately clear** what's wrong and how to fix it. No more guessing!

- 🔧 **Debug button** - One-click system health check
- 📊 **Diagnostic panel** - Visual status of all components
- 💬 **Clear error messages** - Specific problems with solutions
- 📝 **Console logs** - Detailed information for debugging
- 📚 **Documentation** - Comprehensive guides for every scenario

**The app now guides you to a working state at every step!**

