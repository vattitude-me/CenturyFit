# 100 Rep Challenge — Full PWA Implementation Plan

## Context

The user wants a free, installable PWA that coaches anyone from zero to 100 pushups, pullups, and squats per day. The app must be personalized (starts with a baseline test), social (friends, cheers, leaderboards), nudge-driven (push notifications), and deployable to Vercel. The working directory `c:\Users\vsri002\code\App\100 Pushup Pullup Squat` is completely empty — this is a greenfield build.

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSR + API routes in one repo; zero-config Vercel deploy |
| Styling | Tailwind CSS 4 | Utility-first, small bundle |
| Auth | Clerk | Built-in Google/Apple OAuth, JWT template for Supabase |
| Database | Supabase (Postgres + Realtime) | RLS, real-time friend feed, Edge Functions for crons |
| Audio | Web Audio API (no lib) | Beep synthesis avoids audio file hosting |
| Push Notifications | Web Push API + `web-push` npm | Native browser push, works with service worker |
| PWA | Manual service worker (TypeScript) | Full control; `next-pwa` has known Next.js 14+ bugs |
| Charts | Recharts | React-native, SSR-safe |
| Deployment | Vercel | Zero-config Next.js, Cron Jobs (Pro) or Supabase pg_cron (free) |

---

## Supabase Schema

```sql
-- Enums
create type exercise_type as enum ('pushup', 'pullup', 'squat');
create type time_slot     as enum ('morning', 'afternoon', 'evening');
create type friend_status as enum ('pending', 'accepted', 'blocked');
create type reaction_type as enum ('fire', 'clap', 'muscle', 'star');

-- User profiles (synced from Clerk via webhook)
create table public.profiles (
  id            uuid primary key,            -- matches Clerk user ID
  username      text unique not null,
  display_name  text,
  avatar_url    text,
  invite_code   text unique default gen_random_uuid()::text,
  timezone      text default 'UTC',
  created_at    timestamptz default now()
);

-- Baseline test results (one active per user)
create table public.baselines (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  pushup_max    int not null,
  pullup_max    int not null,
  squat_max     int not null,
  assessed_at   timestamptz default now(),
  is_active     boolean default true
);
create unique index baselines_active_user_idx on public.baselines(user_id) where is_active = true;

-- Daily plan container
create table public.daily_plans (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  plan_date   date not null,
  unique(user_id, plan_date)
);

-- Individual sets within a daily plan
create table public.planned_sets (
  id              uuid primary key default gen_random_uuid(),
  daily_plan_id   uuid not null references public.daily_plans(id) on delete cascade,
  exercise        exercise_type not null,
  set_number      int not null,
  target_reps     int not null,
  slot            time_slot not null,
  scheduled_time  time,
  sort_order      int not null,
  unique(daily_plan_id, exercise, set_number)
);

-- Completed set log
create table public.completed_sets (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  planned_set_id  uuid references public.planned_sets(id),
  exercise        exercise_type not null,
  reps_completed  int not null,
  cadence_bpm     int,
  completed_at    timestamptz default now(),
  log_date        date generated always as (completed_at::date) stored
);
create index completed_sets_user_date_idx on public.completed_sets(user_id, log_date);

-- Streak tracking
create table public.streaks (
  user_id         uuid primary key references public.profiles(id) on delete cascade,
  current_streak  int default 0,
  longest_streak  int default 0,
  last_active_date date
);

-- Friendships
create table public.friendships (
  id              uuid primary key default gen_random_uuid(),
  requester_id    uuid not null references public.profiles(id) on delete cascade,
  addressee_id    uuid not null references public.profiles(id) on delete cascade,
  status          friend_status default 'pending',
  created_at      timestamptz default now(),
  check (requester_id <> addressee_id),
  unique(requester_id, addressee_id)
);

-- Cheer reactions on completions
create table public.cheers (
  id               uuid primary key default gen_random_uuid(),
  from_user_id     uuid not null references public.profiles(id) on delete cascade,
  to_user_id       uuid not null references public.profiles(id) on delete cascade,
  completed_set_id uuid references public.completed_sets(id),
  reaction         reaction_type not null,
  created_at       timestamptz default now()
);

-- Web Push subscriptions
create table public.push_subscriptions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  endpoint   text not null,
  p256dh     text not null,
  auth_key   text not null,
  unique(user_id, endpoint)
);

-- Notification preferences
create table public.notification_prefs (
  user_id             uuid primary key references public.profiles(id) on delete cascade,
  set_reminders       boolean default true,
  reminder_lead_mins  int default 10,
  idle_reminder_mins  int default 60,
  streak_alerts       boolean default true,
  friend_cheers       boolean default true,
  quiet_start         time default '22:00',
  quiet_end           time default '07:00'
);

-- RLS
alter table public.profiles           enable row level security;
alter table public.baselines          enable row level security;
alter table public.daily_plans        enable row level security;
alter table public.planned_sets       enable row level security;
alter table public.completed_sets     enable row level security;
alter table public.streaks            enable row level security;
alter table public.friendships        enable row level security;
alter table public.cheers             enable row level security;
alter table public.push_subscriptions enable row level security;
alter table public.notification_prefs enable row level security;

-- Realtime (social feed tables)
alter publication supabase_realtime add table public.completed_sets;
alter publication supabase_realtime add table public.cheers;
alter publication supabase_realtime add table public.friendships;
```

---

## Directory Structure

```
/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/page.tsx
│   │   └── sign-up/page.tsx
│   ├── (app)/
│   │   ├── layout.tsx              # authenticated shell + bottom nav
│   │   ├── dashboard/page.tsx
│   │   ├── workout/
│   │   │   ├── [exercise]/page.tsx # rep counter UI
│   │   │   └── complete/page.tsx   # set done screen
│   │   ├── progress/page.tsx       # charts + streak calendar
│   │   ├── friends/
│   │   │   ├── page.tsx
│   │   │   └── invite/page.tsx
│   │   └── settings/page.tsx
│   ├── onboarding/
│   │   ├── page.tsx                # baseline test multi-step
│   │   └── plan-preview/page.tsx
│   ├── api/
│   │   ├── webhooks/clerk/route.ts # creates profile on user.created
│   │   ├── push/
│   │   │   ├── subscribe/route.ts
│   │   │   └── send/route.ts
│   │   ├── plan/generate/route.ts
│   │   ├── workout/complete-set/route.ts
│   │   ├── friends/
│   │   │   ├── search/route.ts
│   │   │   └── invite/[code]/route.ts
│   │   └── cron/
│   │       ├── nudge/route.ts      # Vercel Cron or called by Supabase pg_cron
│   │       └── streak/route.ts
│   ├── layout.tsx                  # root: manifest link, SW registration, ClerkProvider
│   └── globals.css
├── components/
│   ├── workout/
│   │   ├── RepCounter.tsx          # large tap-circle with progress ring
│   │   ├── CadenceSlider.tsx       # BPM slider + guided mode toggle
│   │   ├── SetCompleteOverlay.tsx  # confetti + rest timer
│   │   └── ExerciseCard.tsx
│   ├── dashboard/
│   │   ├── TodayPlan.tsx
│   │   ├── ExerciseProgress.tsx    # SVG ring per exercise
│   │   └── StreakBadge.tsx
│   ├── progress/
│   │   ├── WeeklyCalendar.tsx
│   │   └── RepChart.tsx            # Recharts AreaChart
│   ├── friends/
│   │   ├── FriendCard.tsx
│   │   ├── FriendFeed.tsx
│   │   └── CheerButton.tsx
│   └── ui/                         # Button, Modal, Sheet, etc.
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # browser client
│   │   ├── server.ts               # server client with Clerk JWT
│   │   └── types.ts                # generated DB types (supabase gen types)
│   ├── audio/
│   │   └── metronome.ts            # Web Audio API engine
│   ├── plan/
│   │   └── generator.ts            # daily plan algorithm
│   ├── push/
│   │   └── webpush.ts              # server-side web-push helper
│   └── utils.ts
├── hooks/
│   ├── useRepCounter.ts
│   ├── useMetronome.ts
│   ├── useDailyPlan.ts
│   ├── useFriendFeed.ts
│   └── usePushSubscription.ts
├── public/
│   ├── manifest.json
│   ├── sw.js                       # compiled from service-worker/sw.ts
│   └── icons/                      # 192, 512, maskable, apple-touch-icon
├── service-worker/
│   └── sw.ts                       # TypeScript source, compiled to public/sw.js
├── supabase/
│   └── migrations/001_initial_schema.sql
├── middleware.ts                   # Clerk route protection
├── next.config.ts
├── vercel.json
└── .env.local.example
```

---

## Implementation Phases

### Phase 1 — Project Scaffold

**Goal:** Runnable Next.js skeleton with PWA manifest + service worker registered

**Files to create:**
- `package.json` — dependencies: `next`, `react`, `tailwindcss`, `@clerk/nextjs`, `@supabase/supabase-js`, `web-push`, `recharts`, `idb`
- `next.config.ts` — SW copy via custom webpack, CSP headers
- `public/manifest.json` — app name, icons, `display: standalone`, `start_url: /dashboard`
- `app/layout.tsx` — manifest link, iOS meta tags, SW registration script, ClerkProvider
- `service-worker/sw.ts` — install (cache app shell), fetch (cache-first static / network-first API), push event, notificationclick
- `vercel.json` — cron definitions
- `.env.local.example` — all required env var names

**Key setup:**
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_VAPID_PUBLIC_KEY
VAPID_PRIVATE_KEY
VAPID_SUBJECT=mailto:admin@yourapp.com
```
Generate VAPID keys once: `npx web-push generate-vapid-keys`

**Third-party setup:**
1. Supabase project → run schema SQL → copy URL + keys
2. Clerk app → enable Google + Apple OAuth → copy keys
3. In Clerk dashboard: create "supabase" JWT template with `{ "sub": "{{user.id}}", "role": "authenticated" }`
4. In Supabase: set JWT secret to Clerk's JWKS endpoint

---

### Phase 2 — Auth & User Profile

**Goal:** Sign-up/login, Clerk webhook creates profile row, onboarding baseline test

**Critical files:**
- `middleware.ts` — `clerkMiddleware()` protecting all `/(app)/*` routes
- `app/api/webhooks/clerk/route.ts` — on `user.created`: insert into `profiles`, `notification_prefs`, `streaks`
- `lib/supabase/server.ts` — creates Supabase client with Clerk JWT so RLS `auth.uid()` resolves
- `app/onboarding/page.tsx` — multi-step form: welcome → pushup max → pullup max → squat max → submit
- `app/onboarding/plan-preview/page.tsx` — shows generated plan, CTA "Start Day 1"

**Clerk + Supabase JWT bridge (critical, test early):**
```ts
// lib/supabase/server.ts
const supabaseToken = await getToken({ template: 'supabase' })
return createClient(url, anonKey, {
  global: { headers: { Authorization: `Bearer ${supabaseToken}` } }
})
```

---

### Phase 3 — Core Workout Engine

**Goal:** Rep counter with audio, adjustable cadence, set completion tracking

#### Plan generation algorithm (`lib/plan/generator.ts`)

```
generateDailyPlan(baselineMax, weekNumber, lastWeekCompletionRate):
  repsPerSet = floor(baselineMax × progressFactor)
    where progressFactor = min(0.6 + (weekNumber - 1) × 0.05, 0.80)
    if lastWeekCompletionRate < 0.70: do not increase progressFactor
  totalSets  = ceil(100 / repsPerSet)
  last set   = 100 - (totalSets - 1) × repsPerSet  (remainder)
  distribute across slots:
    morning:   sets 1..floor(totalSets/3)
    afternoon: next floor(totalSets/3)
    evening:   remainder
  scheduledTime per slot: morning=07:30+30m each, afternoon=12:00+30m, evening=18:00+30m
```

Example: baseline 25 pushups, Week 1 → 15 reps/set × 7 sets (6×15 + 1×10)

#### Audio engine (`lib/audio/metronome.ts`)

```ts
// AudioContext created on first user gesture (stored at module level, not in React state)
function playBeep(ctx, freq = 880, dur = 0.05) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain); gain.connect(ctx.destination)
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0.3, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
  osc.start(); osc.stop(ctx.currentTime + dur)
}
// Completion sound: lower frequency chord (440 Hz)
```

#### Counter component (`components/workout/RepCounter.tsx`)

- Large circular tap target (min 64px radius) — tap anywhere to +1
- SVG progress ring: `stroke-dashoffset` = `circumference × (1 - count/target)`
- Shows "12 / 15" in center
- Long-press = undo last rep
- On `count === target`: plays completion beep + calls `onSetComplete()`

#### Cadence slider (`components/workout/CadenceSlider.tsx`)

- BPM range: 20–120, default 40
- "Guided" toggle: when ON, metronome ticks and auto-increments counter; when OFF, user taps manually
- `navigator.vibrate(50)` haptic on each rep if available

---

### Phase 4 — Dashboard & Progress

**Goal:** Today's plan overview, weekly streak calendar, rep history charts

**Key files:**
- `app/(app)/dashboard/page.tsx` — Server Component fetching today's plan; passes to client components
- `components/dashboard/TodayPlan.tsx` — three sections (pushups/pullups/squats), each with progress ring + set list; tapping a pending set navigates to `/workout/[exercise]?setId=xxx`
- `components/dashboard/ExerciseProgress.tsx` — SVG circular ring, color: red < 33%, amber 33–66%, green > 66%
- `components/progress/WeeklyCalendar.tsx` — 4-week grid, color-coded dots (gray/amber/green)
- `components/progress/RepChart.tsx` — Recharts `AreaChart`, 3 overlapping areas (one per exercise), last 28 days
- `app/(app)/progress/page.tsx` — streak display, 4-week calendar, RepChart, personal records

---

### Phase 5 — Friends & Social

**Goal:** Add friends, see their progress, send cheer reactions, leaderboard

**Key files:**
- `app/(app)/friends/page.tsx` — three tabs: Friends list (live progress rings), Activity feed, Leaderboard
- `app/(app)/friends/invite/page.tsx` — unique invite URL + Web Share API button
- `app/api/friends/invite/[code]/route.ts` — resolves invite code → creates pending friendship; redirects unauthenticated users to sign-up preserving code
- `app/api/friends/search/route.ts` — `GET ?q=username`, returns up to 10 matches (excludes self + existing friends)
- `hooks/useFriendFeed.ts` — Supabase Realtime subscription to `completed_sets` for friend IDs; falls back to 30s polling on free tier
- `components/friends/CheerButton.tsx` — 4 emoji reactions, animated burst on send, disabled if already cheered

**Free tier note:** Use `useSWR` with `refreshInterval: 30_000` for friend feed initially; add Supabase Realtime only on dashboard when app is foregrounded.

---

### Phase 6 — Push Notifications

**Goal:** Scheduled set reminders, idle nudges, streak alerts

**Key files:**
- `hooks/usePushSubscription.ts` — in-app permission prompt → `pushManager.subscribe()` → POST to `/api/push/subscribe`
- `app/api/push/subscribe/route.ts` — upserts subscription into `push_subscriptions`
- `app/api/push/send/route.ts` — uses `web-push` to send to stored subscriptions; handles 410 Gone (deletes stale)
- `app/api/cron/nudge/route.ts` — hourly cron: finds sets due in next `reminder_lead_mins`, skips quiet hours, calls send API
- `app/api/cron/streak/route.ts` — daily cron at 02:00 UTC: updates streak counters, sends "streak at risk" push at 20:00 local if day incomplete

**Service worker push handling:**
```ts
self.addEventListener('push', (event) => {
  const { title, body, url, type } = event.data.json()
  event.waitUntil(self.registration.showNotification(title, {
    body, icon: '/icons/icon-192.png',
    data: { url },
    actions: [{ action: 'open', title: "Let's Go!" }, { action: 'snooze', title: 'Snooze 30m' }],
    tag: type, renotify: true
  }))
})
```

**Free tier cron alternative:** Supabase `pg_cron` extension + Edge Function calls the nudge endpoint — no Vercel Pro required.

**iOS note:** Push only works in iOS 16.4+ standalone mode. Show in-app banner: "Add to Home Screen to enable notifications."

---

### Phase 7 — Polish & Deployment

**Goal:** Lighthouse PWA score 100, offline mode, production deploy

**Offline flow:**
- App shell (dashboard, workout pages) cached at SW install
- Completed sets while offline → stored in `IndexedDB` via `idb` library
- Background Sync API fires `sync` event on reconnect → SW reads IndexedDB → POSTs to `/api/workout/complete-set`

**iOS PWA additions in `app/layout.tsx`:**
```tsx
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
```

**Vercel deploy checklist:**
1. Push repo to GitHub
2. Import to Vercel, add all env vars
3. HTTPS auto-provisioned (required for service workers)
4. Run Lighthouse CI in GitHub Actions for PWA budget enforcement
5. Enable Vercel Cron (Pro) or configure Supabase pg_cron for free tier

**Lighthouse targets:**

| Metric | Target |
|---|---|
| Performance | ≥ 90 |
| PWA | 100 |
| Accessibility | ≥ 95 |
| Best Practices | 100 |

---

## Critical Files (implement first, everything depends on these)

| File | Why critical |
|---|---|
| `lib/supabase/server.ts` | Clerk+Supabase JWT bridge — all server-side data access breaks without it |
| `app/api/webhooks/clerk/route.ts` | Profile creation — no profile = no RLS rows = 403 everywhere |
| `lib/plan/generator.ts` | Core algorithm — all workout features depend on this |
| `lib/audio/metronome.ts` | Web Audio engine — must gate AudioContext on user gesture |
| `service-worker/sw.ts` | Offline + push — errors here break the entire PWA experience |

---

## Known Challenges & Mitigations

| Challenge | Mitigation |
|---|---|
| Clerk → Supabase JWT mismatch | Test with a raw Supabase query in Phase 2 before building any feature |
| Web Audio autoplay policy | AudioContext created in module scope on first button tap, never in React render |
| iOS push limitations | Feature-detect `PushManager`; show graceful fallback + Home Screen install prompt |
| Vercel Cron free tier (daily only) | Use Supabase pg_cron for hourly nudges on free tier |
| Realtime connection limits | Poll with `useSWR refreshInterval: 30000` first; add Realtime only on active screen |
| SW cache busting after deploy | Inject `CACHE_VERSION` from `next.config.ts` `env` block into SW source |

---

## Verification

After each phase:
- **Phase 1:** `npm run dev` → `/` loads, manifest accessible at `/manifest.json`, SW registered in DevTools > Application
- **Phase 2:** Sign up with Google → profile row appears in Supabase → onboarding baseline form saves → plan-preview shows
- **Phase 3:** Workout page → tap counter → beep plays → ring fills → set complete overlay fires
- **Phase 4:** Dashboard shows today's sets with completion rings; progress page shows chart + streak
- **Phase 5:** Add friend by invite link → friend's completion appears in feed → send cheer reaction
- **Phase 6:** Subscribe to push → trigger test notification from send endpoint → notification appears on mobile
- **Phase 7:** `npx @lhci/cli autorun` → PWA score 100; go offline → workout still works → sets sync on reconnect
