# VibeCast Deployment Guide

This guide will walk you through deploying VibeCast to Vercel with Supabase as the backend.

## 📋 Prerequisites

Before you begin, make sure you have:
- A [Supabase](https://supabase.com) account
- A [Vercel](https://vercel.com) account
- A [Google AI Studio](https://ai.google.dev/) account for Gemini API key
- Git installed locally
- This repository ready to push

---

## 🗄️ Phase 1: Supabase Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in the project details:
   - **Organization**: Select or create one
   - **Project Name**: `vibecast` (or your preferred name)
   - **Database Password**: Generate a strong password and **save it securely**
   - **Region**: Choose the region closest to your users
4. Click **"Create new project"**
5. Wait 2-3 minutes for the project to provision

### Step 2: Create Database Tables

1. In your Supabase project dashboard, navigate to **SQL Editor** (in the left sidebar)
2. Click **"New query"**
3. Copy and paste the entire contents of `supabase-schema.sql` from this repository
4. Click **"Run"** or press `Ctrl/Cmd + Enter`
5. You should see a success message confirming the tables were created

**What this does:**
- Creates `sessions` table to store team mood sessions
- Creates `votes` table to store participant votes
- Sets up indexes for query performance
- Enables Row Level Security (RLS) with policies for anonymous access

### Step 3: Enable Anonymous Authentication

1. In the Supabase dashboard, go to **Authentication** → **Providers** (in the left sidebar)
2. Scroll down to find **Anonymous Sign-ins**
3. Toggle it **ON** (enable)
4. Click **"Save"** if prompted

**Why:** VibeCast uses anonymous authentication so participants can join sessions without creating accounts.

### Step 4: Get Your API Credentials

1. Go to **Project Settings** (gear icon in the left sidebar) → **API**
2. Copy and save these two values:
   - **Project URL** (e.g., `https://abcdefghijklmnop.supabase.co`)
   - **anon public** key (a long string under "Project API keys")

**Important:** Keep these safe - you'll need them for Vercel configuration.

---

## 🚀 Phase 2: Vercel Deployment

### Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Click **"Get API key"** in the top-right
4. Create a new API key or use an existing one
5. Copy and save the API key

### Step 2: Push Code to GitHub (if not already done)

If you haven't pushed your code to GitHub yet:

```bash
# Check remote
git remote -v

# If no remote exists, add one
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Stage all changes
git add .

# Commit
git commit -m "Prepare for Vercel deployment with Supabase"

# Push to GitHub
git push -u origin main
```

### Step 3: Connect Vercel to Your Repository

1. Go to [vercel.com](https://vercel.com) and sign in (can use GitHub)
2. Click **"Add New..."** → **"Project"**
3. If prompted, authorize Vercel to access your GitHub account
4. Find and select your `VibeCast` repository
5. Click **"Import"**

### Step 4: Configure Project Settings

Vercel should auto-detect Vite. Verify these settings:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

**Do not deploy yet!** First, add environment variables.

### Step 5: Add Environment Variables

1. In the project configuration page, scroll to **Environment Variables**
2. Add the following three variables:

| Variable Name | Value | Environments |
|---------------|-------|--------------|
| `GEMINI_API_KEY` | Your Gemini API key from Step 1 | Production ✓ Preview ✓ Development ✓ |
| `SUPABASE_URL` | Your Supabase project URL | Production ✓ Preview ✓ Development ✓ |
| `SUPABASE_ANON_KEY` | Your Supabase anon public key | Production ✓ Preview ✓ Development ✓ |

**For each variable:**
- Enter the name in the first field
- Paste the value in the second field
- Check all three environment boxes (Production, Preview, Development)
- Click **"Add"**

### Step 6: Deploy!

1. After adding all environment variables, click **"Deploy"**
2. Wait 2-3 minutes for the build to complete
3. Once successful, you'll get a URL like `https://vibecast-xxx.vercel.app`
4. Click the URL to open your deployed app

---

## ✅ Phase 3: Testing Your Deployment

### Test Checklist

1. **Homepage loads** ✓
   - Visit your Vercel URL
   - Should see the VibeCast landing page
   - No error banner at the top (offline mode)

2. **Create a session** ✓
   - Click "Start New Session"
   - Fill in session name, choose theme, set timer
   - Click "Create Session"
   - You should see the Facilitator View with a session code

3. **Join as participant** ✓
   - Open a new incognito/private browser window
   - Go to the same Vercel URL
   - Click "Join Session"
   - Enter the session code and a nickname
   - Submit a mood vote with reason and kudos

4. **Test AI integration** ✓
   - Back in the facilitator view, click "End Voting & Reveal"
   - Should see AI-generated summary with mood analysis
   - Check that it includes the kudos you submitted

5. **Verify persistence** ✓
   - Click "History" in the navigation
   - Should see your completed session
   - Click on it to view the results again

6. **Verify Supabase sync** ✓
   - Go to Supabase dashboard → **Table Editor**
   - Click on `sessions` table - should see your session
   - Click on `votes` table - should see participant votes

---

## 🔧 Local Development Setup

To run the app locally with Supabase:

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your actual credentials:
   ```bash
   GEMINI_API_KEY=your_actual_gemini_key
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_actual_anon_key
   ```

3. Install dependencies and run:
   ```bash
   npm install
   npm run dev
   ```

4. Open http://localhost:3000

---

## 🌐 Optional: Custom Domain

To use your own domain:

1. In Vercel dashboard, go to your project
2. Click **Settings** → **Domains**
3. Click **"Add"**
4. Enter your domain (e.g., `vibecast.yourdomain.com`)
5. Follow the DNS configuration instructions
6. Wait for DNS propagation (can take up to 48 hours)

---

## 🐛 Troubleshooting

### "Running in Offline/Local Mode" banner appears

**Problem:** Environment variables not properly set.

**Solution:**
1. Go to Vercel dashboard → Your project → **Settings** → **Environment Variables**
2. Verify all three variables are present and correctly spelled
3. Redeploy: **Deployments** → Click "..." on latest → **"Redeploy"**

### Build fails on Vercel

**Problem:** Dependencies missing or build error.

**Solution:**
1. Check the build logs in Vercel for specific errors
2. Verify `package.json` has all required dependencies
3. Try building locally: `npm run build`
4. If it works locally, push any fixes and redeploy

### Votes not saving to Supabase

**Problem:** Database policies or foreign key constraints.

**Solution:**
1. Go to Supabase → **Table Editor**
2. Check both `sessions` and `votes` tables exist
3. Go to **Authentication** → **Policies**
4. Verify "Allow all operations" policies are enabled for both tables
5. Go to **Authentication** → **Providers** and verify anonymous auth is enabled

### "Session not found" error when joining

**Problem:** Session not synced to Supabase or incorrect session code.

**Solution:**
1. Verify the session code is correct (case-sensitive)
2. Check Supabase → **Table Editor** → `sessions` table for the session
3. Check browser console for any Supabase connection errors

### AI summary fails or shows fallback message

**Problem:** Invalid Gemini API key or quota exceeded.

**Solution:**
1. Verify your Gemini API key in Vercel environment variables
2. Check your API quota at [Google AI Studio](https://ai.google.dev/)
3. Check browser console for specific error messages

---

## 📊 Monitoring

### Vercel Analytics

1. In Vercel dashboard → Your project → **Analytics**
2. Enable Web Analytics (free tier available)
3. Monitor page views, performance, and errors

### Supabase Logs

1. In Supabase dashboard → **Logs**
2. View Postgres logs, API logs, and Auth logs
3. Monitor query performance and errors

---

## 🔄 Continuous Deployment

Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every push to other branches and pull requests

To update your production app:
```bash
git add .
git commit -m "Your update message"
git push origin main
```

Vercel will automatically build and deploy in ~2-3 minutes.

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Vite Docs**: https://vitejs.dev/guide/
- **Google AI Studio**: https://ai.google.dev/docs

---

## ✨ Success!

Your VibeCast app is now live! Share your Vercel URL with your team and start tracking those vibes! 🎉

**Quick Access URLs:**
- **Your App**: `https://your-app.vercel.app`
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://supabase.com/dashboard

Happy vibe tracking! 📡✨

