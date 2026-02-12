<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# VibeCast - Team Mood Tracker

Gamify your team check-ins with visual themes, AI-powered mood synthesis, and interactive reveals.

View your app in AI Studio: https://ai.studio/apps/drive/14ZTfSYEZUvbBiqBkFmQKLmPwRVI2zNYC

## Quick Start

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (create `.env.local`):
   ```bash
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   VITE_GEMINI_API_KEY=your-gemini-api-key-here
   ```

3. Set up Supabase database:
   - Run `setup-db.sql` in your Supabase SQL Editor
   - Enable anonymous authentication in Supabase Dashboard

4. Run the app:
   ```bash
   npm run dev
   ```

5. Verify setup:
   - Open http://localhost:3000
   - Click the 🔧 **Debug** button (bottom-right)
   - All checks should show ✓

## Features

- 🎨 **Themed Mood Selection** - Choose from Emoji or Weather themes
- 👥 **Real-time Collaboration** - Multiple participants can join sessions simultaneously
- 🤖 **AI-Powered Summaries** - Gemini AI analyzes team mood and provides insights
- 📊 **Visual Results** - Beautiful reveal animation with mood distribution
- 💾 **Cloud Sync** - Sessions synced across devices via Supabase
- 📴 **Offline Mode** - Works without Supabase (localStorage fallback)

## Troubleshooting

### "Session not found" Error

The app now includes comprehensive diagnostics:

1. **Click the 🔧 Debug button** to see system status
2. **Check browser console** for detailed error messages
3. **Read [TROUBLESHOOTING.md](TROUBLESHOOTING.md)** for solutions

Common issues:
- Database not set up → Run `setup-db.sql`
- Anonymous auth disabled → Enable in Supabase Dashboard
- Missing credentials → Create `.env.local` file

See [SETUP_VERIFICATION.md](SETUP_VERIFICATION.md) for complete setup checklist.

## Documentation

- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Comprehensive error solutions
- **[SETUP_VERIFICATION.md](SETUP_VERIFICATION.md)** - Setup checklist and verification
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment guide for Vercel
- **[setup-db.sql](setup-db.sql)** - Database schema

## Development

Built with:
- React + TypeScript
- Vite
- Supabase (database + real-time)
- Google Gemini AI
- Tailwind CSS
