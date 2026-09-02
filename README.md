# CenturyFit — Progressive Web App

**100 push-ups, pull-ups, and squats every single day.**

A free, fully-featured PWA that coaches anyone from their current fitness level to completing 100 reps of each exercise daily, with intelligent daily splitting, rep counting with audio feedback, social accountability, and offline support.

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier works)
- Clerk account (free tier works)

### Setup

#### 1. Clone and install
```bash
git clone <repo>
cd CenturyFit
npm install
```

#### 2. Create your Supabase project
1. Go to https://supabase.com/dashboard
2. Create a new project
3. In **Project Settings > API**, copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY`

#### 3. Run Supabase migrations
1. In Supabase SQL Editor, run the full schema from `supabase/migrations/001_initial_schema.sql`
2. Enable Realtime on tables: `completed_sets`, `cheers`, `friendships`

#### 4. Create your Clerk app
1. Go to https://dashboard.clerk.com
2. Create a new application
3. In **API Keys**, copy:
   - `Publishable Key` → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `Secret Key` → `CLERK_SECRET_KEY`

#### 5. Set up Clerk + Supabase JWT bridge
1. In Clerk dashboard, go to **JWT Templates**
2. Create a new template named `supabase` with payload:
   ```json
   {
     "sub": "{{user.id}}",
     "role": "authenticated"
   }
   ```
3. Copy the **Signing algorithm** and set it as JWT secret in Supabase

#### 6. Create your VAPID keys
```bash
npx web-push generate-vapid-keys
```
Copy the keys to `.env.local`

#### 7. Configure environment
```bash
cp .env.local.example .env.local
```
Fill in all values from steps 2, 4, 6:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_xxxxx
CLERK_SECRET_KEY=sk_xxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxx

NEXT_PUBLIC_VAPID_PUBLIC_KEY=xxxxx
VAPID_PRIVATE_KEY=xxxxx
VAPID_SUBJECT=mailto:admin@centuryfit.app

CRON_SECRET=<random_64_char_string>
```

#### 8. Run locally
```bash
npm run dev
```
Open http://localhost:3000

---

## Architecture

### Frontend (Next.js 15 + React 19)
- **PWA**: Service Worker + Web Manifest for offline + installable
- **Styling**: Tailwind CSS v4 with custom theme
- **Components**: Shadcn/ui-inspired, fully typed with TypeScript
- **Audio**: Web Audio API for rep counter beeps (no external files)
- **Charts**: Recharts for volume tracking
- **State**: Supabase client for real-time + server-side rendering

### Backend
- **Framework**: Next.js API Routes
- **Database**: Supabase (Postgres) with RLS policies
- **Auth**: Clerk for user management
- **Realtime**: Supabase Realtime channels for social feed
- **Background jobs**: Vercel Cron (or Supabase pg_cron on free tier)
- **Push**: Web Push API + service worker

### Key Technologies
| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 | SSR + API + PWA in one repo; zero-config Vercel deploy |
| Frontend | React 19 + TypeScript | Type-safe, modern hooks, excellent DX |
| Styling | Tailwind CSS 4 | Utility-first, small bundle, dark mode built-in |
| Database | Supabase | RLS + Realtime + free tier is generous |
| Auth | Clerk | OAuth + email, JWT bridge to Supabase, free tier |
| Audio | Web Audio API | No files to host, low latency, free |
| Offline | Service Worker + IndexedDB | Cache app shell, queue sets, Background Sync |

---

## Feature Breakdown

### Phase 1: Scaffold ✅
- Next.js + PWA manifest + service worker
- Tailwind setup, global styles, layouts
- Service worker caching strategy

### Phase 2: Auth ✅
- Clerk OAuth (Google, Apple) + email
- Webhook syncs user to Supabase `profiles` table
- Supabase RLS policies enforce per-user data access
- Middleware protects authenticated routes

### Phase 3: Onboarding & Plan Generation ✅
- Multi-step baseline test (max reps for each exercise)
- Plan generator algorithm: progressive overload + intraday splitting
- Daily plan preview before user starts
- Stores baseline in Supabase

### Phase 4: Workout Engine ✅
- **Rep Counter**: tap-to-count with progress ring (SVG)
- **Audio**: beep on each rep, chime on set complete (Web Audio)
- **Metronome**: guided mode auto-increments at chosen BPM
- **Cadence Slider**: 20–120 BPM with presets
- **Screen Wake Lock**: keeps screen on during workout
- **Haptics**: vibration feedback on tap + completion
- **Sound toggle**: mute beeps if desired

### Phase 5: Dashboard & Progress ✅
- **Today's Workout**: 3 exercise cards with progress rings, set list
- **Streak Badge**: current streak with fire emoji + longest streak
- **Progress Page**: 4-week consistency calendar, 28-day volume chart, lifetime stats
- **Bottom Nav**: Today / Progress / Friends / Settings

### Phase 6: Friends & Social (Placeholder)
- Friends list, invite by link
- Activity feed (friend completions in real-time via Realtime)
- Leaderboards (weekly totals)
- Cheer reactions (fire, clap, muscle, star)

### Phase 7: Push Notifications (Scaffolding)
- Subscribe to push in Settings
- Cron job: hourly nudge for upcoming sets
- Cron job: daily streak alerts at 20:00 local
- Respects quiet hours (customizable)
- Handle 410 Gone for stale subscriptions

### Phase 8: Offline Support ✅
- App shell cached in service worker
- Completed sets queued in IndexedDB while offline
- Background Sync fires on reconnection
- Offline indicator banner

---

## File Structure

```
app/
├── (auth)/                  # Sign in / sign up (unauthenticated)
│   ├── sign-in/[[...sign-in]]/page.tsx
│   └── sign-up/[[...sign-up]]/page.tsx
├── (app)/                   # Main app (authenticated)
│   ├── dashboard/page.tsx   # Today's plan
│   ├── progress/page.tsx    # Charts + calendar
│   ├── friends/page.tsx     # Friends list + feed
│   ├── settings/page.tsx    # User settings
│   ├── workout/[exercise]/page.tsx  # Rep counter
│   └── layout.tsx           # Bottom nav + auth check
├── onboarding/
│   ├── page.tsx             # Baseline test
│   └── plan-preview/page.tsx
├── api/
│   ├── webhooks/clerk/route.ts      # Profile sync
│   ├── workout/complete-set/route.ts  # Log set + update streak
│   ├── push/subscribe/route.ts       # Save subscription
│   ├── push/send/route.ts            # Send push (for testing)
│   ├── cron/nudge/route.ts           # Hourly reminders
│   └── cron/streak/route.ts          # Daily streak update
└── layout.tsx               # Root + ClerkProvider

components/
├── workout/
│   ├── RepCounter.tsx       # Tap-to-count with progress ring
│   ├── CadenceSlider.tsx    # BPM slider + guided mode
│   └── SetCompleteOverlay.tsx  # Confetti + rest timer
├── dashboard/
│   ├── ExerciseProgress.tsx # SVG progress ring
│   ├── ExerciseCard.tsx     # Exercise + sets card
│   ├── StreakBadge.tsx      # Fire emoji + streak count
│   └── TodayPlan.tsx        # Orchestrates all three exercises
└── progress/
    ├── RepChart.tsx         # Recharts AreaChart
    └── WeeklyCalendar.tsx   # Consistency grid

lib/
├── supabase/
│   ├── client.ts            # Browser client
│   ├── server.ts            # Server client with Clerk JWT
│   └── types.ts             # Generated DB types
├── audio/
│   └── metronome.ts         # Web Audio API helper
├── plan/
│   └── generator.ts         # Daily plan algorithm
├── push/
│   └── webpush.ts           # Server push sender
└── offline/
    └── idb.ts               # IndexedDB queue for offline

hooks/
├── useRepCounter.ts         # Counter logic
├── useMetronome.ts          # Auto-increment timer
└── useWakeLock.ts           # Screen lock hook

service-worker/
└── sw.ts                    # Service worker (compiles to public/sw.js)

public/
├── manifest.json            # PWA manifest
├── sw.js                    # Compiled service worker
└── icons/                   # PWA icons (192, 512, maskable, apple)
```

---

## Environment Variables

Create `.env.local` from `.env.local.example` and fill in:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_xxxxx
CLERK_SECRET_KEY=sk_xxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxx

# VAPID (from `npx web-push generate-vapid-keys`)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=xxxxx
VAPID_PRIVATE_KEY=xxxxx
VAPID_SUBJECT=mailto:admin@centuryfit.app

# Cron protection
CRON_SECRET=<random 64-char string>
```

---

## Development

### Run dev server
```bash
npm run dev
```

### Build for production
```bash
npm run build
npm start
```

### Compile service worker
```bash
npm run build:sw
```

### Lint
```bash
npm run lint
```

---

## Deployment

### Deploy to Vercel

1. Push to GitHub:
   ```bash
   git add .
   git commit -m "Initial CenturyFit commit"
   git push origin main
   ```

2. Import to Vercel:
   - Go to https://vercel.com/new
   - Select your GitHub repo
   - Add environment variables from `.env.local`
   - Deploy

3. Set up Clerk webhook:
   - In Clerk dashboard, go to Webhooks
   - Add endpoint: `https://your-vercel-url.vercel.app/api/webhooks/clerk`
   - Select events: `user.created`

4. Enable Vercel Cron (Pro plan) or use Supabase pg_cron (free):
   - For Pro: crons are auto-enabled, see `vercel.json`
   - For free: create Supabase Edge Functions to call cron endpoints

5. Test push notifications:
   - Go to Settings, enable notifications
   - Check browser console for service worker registration
   - Use `/api/push/send` endpoint to test

---

## Roadmap

- **MVP (now)**: Onboarding, workout engine, dashboard, offline
- **Phase 2**: Friends, social feed, leaderboards
- **Phase 3**: Push notifications, cron jobs
- **Phase 4**: Camera pose detection (TensorFlow.js), voice counting
- **Phase 5**: Apple Health / Google Fit export, custom sound packs
- **Post-launch**: Competitions, streaks-as-a-service API, mobile app (React Native)

---

## Support

- **Issues**: GitHub Issues
- **Docs**: See `instructions/` directory
- **Community**: Discussions

---

## License

MIT

---

## Built with

- [Next.js](https://nextjs.org)
- [React](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase](https://supabase.com)
- [Clerk](https://clerk.com)
- [Recharts](https://recharts.org)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)