# CenturyFit — Production Setup & Deployment Checklist

## Current Status
✅ **Codebase:** Production-ready  
✅ **Build:** Passes (npm run build succeeds)  
✅ **Dev Server:** Running successfully  
✅ **Clerk:** Connected and verified  
⏳ **Supabase:** Credentials valid, but **database schema needs to be created**

---

## ⚠️ NEXT STEPS: Create Supabase Database Schema

### Step 1: Access Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project: **xummgwwdprjeolqcbsul**
3. Navigate to **SQL Editor**

### Step 2: Run the Database Migration
1. Click **"New Query"** in the SQL Editor
2. Copy the entire contents from: [`supabase/migrations/001_initial_schema.sql`](./supabase/migrations/001_initial_schema.sql)
3. Paste into the SQL editor
4. Click **"Run"** (or press Ctrl+Enter)

This will create all 10 required tables:
- `profiles` — User accounts
- `baselines` — Initial max rep tests
- `daily_plans` — Generated workout plans
- `planned_sets` — Individual sets in each plan
- `completed_sets` — Logged workouts
- `streaks` — Current and longest streaks
- `friendships` — Friend relationships
- `cheers` — Social reactions
- `push_subscriptions` — Web push tokens
- `notification_prefs` — User notification settings

### Step 3: Enable Realtime (Optional, for live social features)
In Supabase Dashboard:
1. Go to **Database > Replication**
2. Toggle **ON** for these tables:
   - `completed_sets` (for activity feed)
   - `cheers` (for reactions)
   - `friendships` (for friend requests)

---

## 🚀 Deploy to Vercel

### Step 1: Connect GitHub Repository
1. Go to https://vercel.com/new
2. Import your GitHub repository: `vattitude-me/CenturyFit`
3. Vercel will auto-detect Next.js 15

### Step 2: Add Environment Variables
Copy all values from your `.env` file into Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=https://xummgwwdprjeolqcbsul.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

NEXT_PUBLIC_VAPID_PUBLIC_KEY=A8M0KBdVw8grt5_...
VAPID_PRIVATE_KEY=ytnnuCP3cEjwHkT2Wvq_...
VAPID_SUBJECT=mailto:info.vattitude@gmail.com

CRON_SECRET=<generate_random_64_char_string>
NEXT_PUBLIC_CACHE_VERSION=1
```

### Step 3: Configure Clerk Webhook
After Vercel deployment:

1. Get your Vercel URL (e.g., `https://centuryfit-app.vercel.app`)
2. Go to Clerk Dashboard: **Webhooks**
3. Create a new endpoint:
   - **URL:** `https://your-vercel-url.vercel.app/api/webhooks/clerk`
   - **Events:** Select `user.created`
4. Copy the **Signing Secret** and add to Vercel env vars as `CLERK_WEBHOOK_SECRET`

### Step 4: Deploy
Click **Deploy** in Vercel. Your app will be live in ~2 minutes.

---

## 📝 Optional: Set Up Cron Jobs

CenturyFit includes two scheduled cron tasks (hourly nudges, daily streak updates).

### Option A: Vercel Cron (Recommended for Pro plan)
Already configured in [`vercel.json`](./vercel.json). If you upgrade to Vercel Pro, crons auto-enable.

### Option B: Supabase Edge Functions (Free tier)
1. Create Edge Functions that call `/api/cron/nudge` and `/api/cron/streak`
2. Schedule them using Supabase's cron job extension

---

## 🧪 Testing After Deployment

### 1. Test Sign-up
1. Go to your Vercel URL
2. Click "Sign Up"
3. Create an account with Google or email

### 2. Test Baseline Test
1. Complete the 3-exercise baseline test
2. Verify it generates a daily plan

### 3. Test Workout
1. Start a workout (e.g., Push-ups)
2. Tap to count reps
3. Verify audio beeps play (if browser audio enabled)

### 4. Test Dashboard
1. Check that today's plan appears
2. Verify streak badge shows

---

## 📱 Install PWA

1. On mobile or desktop:
   - Open DevTools or app menu
   - Find "Install" or "Add to Home Screen"
   - Confirm installation

2. Launch the app
3. Verify offline functionality (disable internet and reload)

---

## 🆘 Troubleshooting

### Database says "table not found"
→ Run the SQL migration in Supabase SQL Editor

### Clerk webhook returns 401
→ Verify `CLERK_WEBHOOK_SECRET` is set correctly in Vercel env vars

### App shows blank page
→ Check browser console for errors; verify all env vars are set

### Push notifications not working
→ Enable notifications in Settings; verify browser allows notifications

---

## 📚 Architecture Overview

```
User → Vercel (Next.js 15)
         ├── Clerk Auth (OAuth + JWT)
         ├── Supabase DB (RLS policies)
         ├── Service Worker (offline + push)
         └── Background Sync (queue offline sets)
         
Realtime Feed → Supabase Realtime → WebSocket
```

---

## Next: Mobile Apps

After web deployment succeeds, you can export to:
- **iOS:** React Native + Xcode
- **Android:** React Native + Android Studio
- **Cross-platform:** Expo EAS Build

---

**Questions?** Check `README.md` or the `instructions/` directory.
