# 🚀 VibeCast Deployment Checklist

**Repository**: https://github.com/evanoubiss/VibeCast.git  
**Status**: ✅ Code is deployment-ready  
**Date Created**: February 10, 2026

---

## ✅ Pre-Deployment Verification

- [x] ✅ Dependencies installed (`npm install` successful)
- [x] ✅ Production build works (`npm run build` successful)
- [x] ✅ Git repository configured
- [x] ✅ `vercel.json` configured for SPA routing
- [x] ✅ `supabase-schema.sql` ready for database setup
- [x] ✅ `.gitignore` properly configured
- [ ] ⏳ Latest changes pushed to GitHub

---

## 📝 Step-by-Step Deployment

### STEP 1: Push Latest Code to GitHub (5 min)

```bash
# You have 1 unpushed commit - push it now:
git push origin main
```

**⚠️ If you get authentication error:**
- Use GitHub Desktop, or
- Set up SSH keys, or  
- Use personal access token

---

### STEP 2: Create Supabase Project (15 min)

1. **Go to**: https://supabase.com
2. **Sign in** (or create account)
3. **Click**: "New Project"
4. **Fill in**:
   - Organization: (select or create)
   - Project Name: `vibecast`
   - Database Password: (generate strong password - **SAVE IT!**)
   - Region: (choose closest to you)
5. **Click**: "Create new project"
6. **Wait**: 2-3 minutes for provisioning

**📋 Save These Values:**
```
Supabase Project URL: ___________________________________
Supabase Anon Key: ______________________________________
Database Password: ______________________________________
```

---

### STEP 3: Set Up Supabase Database (5 min)

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Open `supabase-schema.sql` from your project
4. **Copy entire file contents** and paste into SQL Editor
5. Click **"Run"** (or Ctrl/Cmd + Enter)
6. ✅ Should see success message

**What this creates:**
- `sessions` table (stores mood sessions)
- `votes` table (stores participant votes)
- Indexes for performance
- Row Level Security policies

---

### STEP 4: Enable Anonymous Auth in Supabase (2 min)

1. Go to **Authentication** → **Providers** (left sidebar)
2. Scroll to **"Anonymous Sign-ins"**
3. Toggle **ON**
4. Save changes

---

### STEP 5: Get Supabase API Credentials (2 min)

1. Go to **Project Settings** (gear icon) → **API**
2. **Copy and save**:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (long string)

---

### STEP 6: Get Gemini API Key (5 min)

1. **Go to**: https://ai.google.dev/
2. **Sign in** with Google account
3. **Click**: "Get API key"
4. **Create** new API key (or use existing)
5. **Copy and save** the API key

**📋 Save This Value:**
```
Gemini API Key: _________________________________________
```

---

### STEP 7: Deploy to Vercel (10 min)

#### 7A. Import Project

1. **Go to**: https://vercel.com
2. **Sign in** (connect with GitHub if new)
3. **Click**: "Add New..." → "Project"
4. **Find**: `VibeCast` repository
5. **Click**: "Import"

#### 7B. Verify Build Settings

Vercel should auto-detect these (verify they match):

- **Framework Preset**: Vite ✓
- **Build Command**: `npm run build` ✓
- **Output Directory**: `dist` ✓
- **Install Command**: `npm install` ✓

#### 7C. Add Environment Variables ⚠️ **CRITICAL STEP**

**DO NOT DEPLOY WITHOUT THESE!**

Click **"Add Environment Variable"** for each:

| Variable Name | Value | Environments |
|---------------|-------|--------------|
| `GEMINI_API_KEY` | (paste your Gemini key) | ✓ Production ✓ Preview ✓ Development |
| `SUPABASE_URL` | (paste your Supabase URL) | ✓ Production ✓ Preview ✓ Development |
| `SUPABASE_ANON_KEY` | (paste your Supabase anon key) | ✓ Production ✓ Preview ✓ Development |

**For each variable:**
1. Enter name in first field
2. Paste value in second field
3. Check all three environment boxes
4. Click "Add"

#### 7D. Deploy!

1. **Click**: "Deploy"
2. **Wait**: 2-3 minutes
3. **Get URL**: `https://vibecast-xxx.vercel.app`
4. **Click URL** to open your app

---

### STEP 8: Test Your Deployment (10 min)

Open your Vercel URL and test:

#### Test 1: Homepage ✓
- [ ] Homepage loads
- [ ] No "Offline Mode" banner at top (if banner appears, env vars missing!)

#### Test 2: Create Session ✓
- [ ] Click "Start New Session"
- [ ] Fill: Session name, theme, timer
- [ ] Click "Create Session"
- [ ] See Facilitator View with session code

#### Test 3: Join as Participant ✓
- [ ] Open **new incognito/private window**
- [ ] Go to same Vercel URL
- [ ] Click "Join Session"
- [ ] Enter session code + nickname
- [ ] Submit mood vote with reason and kudos

#### Test 4: AI Summary ✓
- [ ] Back in facilitator window
- [ ] Click "End Voting & Reveal"
- [ ] See AI-generated summary
- [ ] Verify it includes kudos

#### Test 5: Persistence ✓
- [ ] Click "History" in navigation
- [ ] See completed session
- [ ] Click session to view results

#### Test 6: Supabase Sync ✓
- [ ] Go to Supabase dashboard
- [ ] Click **Table Editor** (left sidebar)
- [ ] Open `sessions` table - should see your session
- [ ] Open `votes` table - should see participant votes

---

## 🎉 Success Criteria

When all tests pass:
- ✅ App is live at your Vercel URL
- ✅ Sessions persist to Supabase
- ✅ Votes save to database
- ✅ AI summaries generate correctly
- ✅ History view shows past sessions

---

## 🐛 Troubleshooting

### "Offline Mode" Banner Appears
**Problem**: Environment variables not set  
**Fix**: Go to Vercel → Project Settings → Environment Variables → Add all 3 variables → Redeploy

### Build Fails
**Problem**: Dependencies or build error  
**Fix**: Check Vercel build logs for errors. Build works locally (already tested ✓)

### Votes Not Saving
**Problem**: Database policies or anonymous auth  
**Fix**: 
- Verify `supabase-schema.sql` was run successfully
- Check Authentication → Providers → Anonymous auth is ON
- Check Table Editor shows both tables exist

### AI Summary Fails
**Problem**: Invalid Gemini API key  
**Fix**: Verify `GEMINI_API_KEY` in Vercel, check quota at ai.google.dev

---

## 🔄 Future Updates

To update your production app:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel auto-deploys on every push to `main` branch! 🚀

---

## 📊 Post-Deployment (Optional)

### Add Custom Domain
1. Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain
3. Configure DNS records as shown

### Enable Analytics
1. Vercel Dashboard → Your Project → Analytics
2. Enable Web Analytics (free tier available)

### Monitor Logs
- **Vercel**: Dashboard → Your Project → Logs
- **Supabase**: Dashboard → Logs

---

## 🔗 Quick Links

- **Your GitHub Repo**: https://github.com/evanoubiss/VibeCast.git
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Google AI Studio**: https://ai.google.dev/

---

## 📞 Documentation Resources

- **Full Deployment Guide**: See `DEPLOYMENT.md` in your repo
- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Vite Docs**: https://vitejs.dev/guide/

---

**Created by Cursor AI Assistant**  
**Ready to deploy! Follow steps in order.** 🚀

