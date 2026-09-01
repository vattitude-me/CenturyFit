# CenturyFit — Full Product & Technical Plan

> **One-liner:** A free Progressive Web App (PWA) that takes *anyone* — from someone who can do 3 push-ups to someone who can do 40 — and coaches them, day by day, to **100 push-ups, 100 pull-ups, and 100 squats every single day**, split intelligently across the day, with a rep-by-rep audio counter, adjustable tempo, friends, and motivational nudges.

**Author:** Vatsan Sri
**Date:** September 1, 2026
**Deployment target:** Vercel (Next.js PWA)
**Cost model:** 100% free to run and use

---

## 1. Vision & Guiding Principles

The core insight behind every successful "100 reps" app is that **100 consecutive reps is intimidating, but 100 reps spread across a day is achievable by almost anyone**. The apps below all lean on progressive overload + habit design.

### What we learned from the market (reference apps)

| App | Platform | Key idea we borrow | Gap we fix |
|---|---|---|---|
| **Hundred Pushups / hundredpushups.com** | iOS | The classic "0→100 in 6 weeks" progressive plan and initial-test baseline | Push-ups only; no pull-ups/squats, no social |
| **Zen Labs 0–100 Pushups Trainer** (1M+ downloads, 4.7★) | Android/iOS | Voice-coach guided sets, badges, proven 8-week program | Ads, single-exercise, no rep counter |
| **BeStronger 100 Push-ups** (73k reviews) | Android | 11 programs by level, warm-up/stretch, reminders, "test → pick program" | Paywalled, no live counter |
| **Foxyfitness 100 Push-Ups / Squats / Sit-Ups** | iOS/Android | Groups & friends, workout generator, streaks, streak-freezes | Separate apps per exercise, Pro-gated |
| **100.Reps (Lorenz Magg)** | Android | The exact 3-exercise combo: pull-ups + push-ups + squats, 10×10, offline | No coaching, no counter, no social |
| **100 Reps: Workout Tracker** | iOS | Focus Mode (one exercise at a time), streak recovery, milestone certificates | Premium add-ons, no rep counter |
| **TikMe / TimerBro / REPS counter** | iOS/Web | Voice/metronome rep counting, adjustable tempo, "feel the tempo don't count it" | Not tied to a progression program |
| **Fito / Strava / FitCraft** | Multi | Social nudges, leaderboards, gamified accountability (XP, streaks) | Not bodyweight-100 focused |

**References:** hundredpushups.com <cite>turn1search19</cite><cite>turn1search20</cite>, Zen Labs 0–100 Pushups <cite>turn1search23</cite>, BeStronger <cite>turn1search24</cite>, Foxyfitness groups/streaks <cite>turn1search12</cite>, 100.Reps pull-ups+push-ups+squats <cite>turn1search7</cite>, 100 Reps Focus Mode/streak recovery <cite>turn1search8</cite>, TikMe voice counter/adjustable tempo <cite>turn1search1</cite>, TimerBro pulsing metronome tempo <cite>turn1search6</cite>, REPS web counter modes <cite>turn1search5</cite>, Fito friends/nudges <cite>turn1search15</cite>, FitCraft accountability/gamification research <cite>turn1search17</cite>.

### Our differentiators (the "why us")
1. **All three lifts, one app** — push-ups, pull-ups, squats, each to 100/day. Most apps do one.
2. **Truly personalized baseline** — an adaptive test on day 1, re-tested periodically, that reshapes your daily split for *your* body, not a generic 8-week table.
3. **Built-in rep counter with sound + controllable speed** — the metronome/voice counter is the *centerpiece* of the workout screen, not a separate app.
4. **Smart intraday splitting** — 100 reps auto-chunked into "greasing the groove" mini-sets across your waking hours.
5. **Social accountability that actually nudges** — friends see your rings, and the app pings *you* (and optionally a friend) when you're falling behind.
6. **Free forever, installable PWA** — no app store, works offline, deploys on Vercel's free tier.

> ⚠️ **Note on retention:** Research cited by FitCraft shows the average fitness app loses **73–96% of users within 30 days** — behavioral design (streaks, social pressure, gamification), not just reminders, is what retains users. <cite>turn1search17</cite> This plan treats accountability as a first-class feature, not an afterthought.

---

## 2. Target Users & Core Use Cases

- **The absolute beginner** (can do 1–10 push-ups): needs regressions (knee push-ups, band-assisted pull-ups, box squats) and a gentle ramp.
- **The intermediate** (10–40 reps): needs an aggressive-but-safe split to reach 100/day fast.
- **The consistency-seeker**: can already hit the numbers but wants streaks, friends, and daily structure.
- **The competitor**: wants leaderboards and to challenge friends.

**Primary job-to-be-done:** *"Get me to 100 push-ups, 100 pull-ups, and 100 squats every day, starting from wherever I am, without hurting myself, and keep me from quitting."*

---

## 3. Core Feature Set

### 3.1 Onboarding & Baseline Assessment (the "Initial Test")
Mirrors the proven "take the initial test → get your program" pattern from Hundred Pushups and BeStronger. <cite>turn1search20</cite><cite>turn1search24</cite>

- **Max-rep test** for each of the 3 exercises: "Do as many good-form reps as you can in one set."
- Optional **regression detection**: if max push-ups < 5 → start with knee push-ups / incline; if max pull-ups = 0 → start with band-assisted / negatives / Australian rows.
- Capture: age band, injury flags (shoulder/knee/wrist/back), available equipment (pull-up bar? resistance band?), preferred wake/sleep window (for intraday splitting), and days available.
- **Output:** a personalized `baseline` = `{pushups: N, pullups: M, squats: K}` and a starting difficulty tier per exercise.

### 3.2 Personalized Daily Plan Engine
- Computes today's **target volume** per exercise (ramping toward 100) and the **regression/progression variant** to use.
- **Progressive overload** logic: nudges the daily total up when yesterday was completed comfortably (all sets done, low reported effort), holds or deloads when missed or high effort — the same principle Nudges Me / RepCount automate. <cite>turn1search14</cite><cite>turn1search2</cite>
- Two run modes borrowed from *100 Reps*:
  - **Focus Mode** — one exercise at a time, guided. <cite>turn1search8</cite>
  - **Overview Mode** — manage the full day's three exercises at a glance. <cite>turn1search8</cite>

### 3.3 Intraday Splitting ("Grease the Groove")
The differentiator you specifically asked for.

- Takes the daily target (e.g., 100 push-ups) and splits it into **mini-sets across the day** based on the user's baseline single-set capacity.
- Example: baseline max = 20 push-ups → split into **5 blocks of ~20**, scheduled at wake, mid-morning, lunch, afternoon, evening.
- Beginner example: baseline max = 5 → **10 blocks of ~10 (knee variant)** or fewer total reps that day, ramping over weeks.
- Each block becomes a **scheduled reminder** with a one-tap "Start block" → opens the rep counter.
- User can **reshuffle blocks** by dragging them on a day timeline.

### 3.4 The Rep Counter (centerpiece)
Combines the best of TikMe (voice), TimerBro (pulsing metronome tempo), and REPS (multi-mode). <cite>turn1search1</cite><cite>turn1search6</cite><cite>turn1search5</cite>

- **Counting modes:**
  1. **Metronome / auto-count** — the app counts up out loud ("one… two… three…") at a set tempo; you follow the beat.
  2. **Tap-to-count** — tap the screen (or a big button) once per rep.
  3. **Voice-triggered** (stretch) — count reps by breath/grunt or a spoken "go".
  4. **Camera pose-detection** (stretch, optional) — like REPS, uses on-device pose estimation to auto-count. <cite>turn1search5</cite>
- **Sound per rep:** a click/beep/voice number on each rep, plus a distinct "set complete" chime. Custom audio cues supported (import your own), like TikMe. <cite>turn1search1</cite>
- **Controllable speed:** a **tempo slider** (e.g., 0.5–3 seconds per rep) — set slow for strict/tempo reps, fast for burnout sets. TimerBro's "feel the tempo, don't count it" model. <cite>turn1search6</cite>
- **Tempo notation (stretch):** eccentric-pause-concentric-pause (e.g., 3-1-2-1) for strength work. <cite>turn1search6</cite>
- **Screen-on + background audio** so it works with your phone locked or propped up; cues mix over your music. <cite>turn1search1</cite><cite>turn1search6</cite>
- **Rest timer** between sets with countdown and skip.

### 3.5 Warm-up & Cool-down
- Auto warm-up before sessions and stretching after, as BeStronger does — reduces injury and improves adherence. <cite>turn1search24</cite>

### 3.6 Progress, Streaks & Gamification
- **Daily rings** (one per exercise) that fill as you hit 100.
- **Streaks** with **streak-freeze / streak-recovery** for sick/rest days (Foxyfitness + 100 Reps patterns). <cite>turn1search12</cite><cite>turn1search8</cite>
- **XP / levels / badges / milestone certificates** — gamification proven to boost activity (BE FIT & STEP UP trials referenced by FitCraft). <cite>turn1search17</cite><cite>turn1search8</cite>
- **Charts:** day/month/year volume, best set, personal bests per exercise. <cite>turn1search2</cite>
- **Calendar heatmap** of consistency (completed / missed / skipped / recovered days). <cite>turn1search8</cite>

### 3.7 Social — Friends, Motivation & Nudges
Modeled on Fito's cross-platform friends + friendly nudges and FitCraft's social accountability. <cite>turn1search15</cite><cite>turn1search17</cite>

- **Add friends** (via invite link / username).
- **Shared activity feed:** friends' completed rings, streaks, PRs; give a "like" / cheer.
- **Leaderboards & challenges:** weekly "100-a-day" challenge, "most consistent," head-to-head. <cite>turn1search15</cite>
- **The Nudge system (your requested feature):**
  - **Self-nudge:** push notification if a scheduled block is missed ("You've got 40 push-ups left before 9pm 💪").
  - **Peer-nudge:** a friend can send you a nudge; the app can also **auto-nudge a friend** on your behalf if you're inactive ("Vatsan hasn't worked out today — send encouragement?"). <cite>turn1search15</cite>
  - **Inactivity + milestone messages**, like 100 Reps' smarter reminders. <cite>turn1search8</cite>

### 3.8 Settings & Personalization
- Adjustable daily goals, set sizes, rest times, tempo defaults, reminder times, dark/light themes, sound packs, language.
- Injury-aware substitutions and equipment toggles.

---

## 4. Personalization Logic (Detailed)

### 4.1 Baseline → Starting Volume
```
maxSet = user's best single set (from initial test)
dailyTarget_start = clamp( round(maxSet * 3), min=20, max=100 )   # gentle day-1 total
splitBlocks = ceil( dailyTarget / (maxSet * 0.6) )                # ~60% of max per block to stay fresh
```

### 4.2 Weekly Progression
```
if (yesterday.completed && reportedEffort <= "moderate"):
    dailyTarget += progressionStep        # e.g., +5–10 reps/day toward 100
elif (missed 2+ days in a row):
    dailyTarget = max(dailyTarget * 0.8, floor)   # deload, protect the streak/joints
else:
    hold
```
- Caps at **100/day**; after reaching 100/day for the daily split, unlock **"consecutive-set" challenges** (fewer, bigger sets → toward 100 unbroken, the classic Hundred Pushups goal). <cite>turn1search20</cite>

### 4.3 Regressions & Progressions (so anyone can start)
| Exercise | Can't do 1 → start here | Progression ladder |
|---|---|---|
| Push-ups | Wall → incline → knee | knee → negative → full → tempo → explosive <cite>turn1search21</cite> |
| Pull-ups | Dead hang → band-assisted → Australian rows → negatives | negatives → band → strict → weighted <cite>turn1search9</cite><cite>turn1search10</cite> |
| Squats | Box/chair squat → assisted | box → bodyweight → tempo → pause → pistol progressions |

---

## 5. Technical Architecture

### 5.1 Stack (free-tier friendly, Vercel-native)
- **Framework:** Next.js 15 (App Router) + React + TypeScript.
- **PWA:** `next-pwa` / custom service worker → installable, **offline-first** (workouts work with no connection, like 100.Reps). <cite>turn1search7</cite>
- **Styling/UI:** Tailwind CSS + shadcn/ui; big-touch-target workout screens.
- **State/local storage:** IndexedDB (via Dexie) for offline logs; syncs when online.
- **Audio:** Web Audio API for low-latency rep clicks/beeps + `SpeechSynthesis` API for spoken numbers (zero cost, no audio files needed).
- **Rep counter tempo:** `requestAnimationFrame` + Web Audio scheduler for drift-free metronome timing.
- **Wake lock:** Screen Wake Lock API so the screen stays on during a set. <cite>turn1search1</cite>
- **Notifications/Nudges:** Web Push API + service worker (VAPID keys) for reminders and peer-nudges — free.
- **Optional camera counting (stretch):** TensorFlow.js MoveNet / MediaPipe Pose, **on-device** (no server cost). <cite>turn1search5</cite>

### 5.2 Backend & Data (all free-tier)
- **Auth + DB:** Supabase (Postgres + Auth + Realtime) free tier, or Vercel Postgres + Auth.js.
- **Realtime social feed & nudges:** Supabase Realtime channels.
- **Scheduled nudges:** Vercel Cron → checks who's behind on their daily target → triggers Web Push.
- **Storage:** minimal (avatars) → Supabase Storage free tier.

### 5.3 Data Model (core tables)
```
users(id, name, avatar, wake_time, sleep_time, equipment, injuries, created_at)
baselines(user_id, exercise, max_reps, tier, tested_at)
daily_plans(id, user_id, date, exercise, target_reps, variant, blocks_json, status)
sets(id, user_id, date, exercise, reps, tempo, effort, source, completed_at)
streaks(user_id, current, longest, freezes_remaining, last_active)
friendships(user_id, friend_id, status)
nudges(id, from_user, to_user, type, message, created_at, read)
challenges(id, name, type, start, end, participants_json)
badges(user_id, badge_id, earned_at)
```

### 5.4 Why this stays free
- Vercel Hobby (frontend + cron + serverless), Supabase free tier (DB/auth/realtime), Web Push (free), on-device AI (no inference cost), SpeechSynthesis (no TTS bill). No ads needed to break even.

---

## 6. Screen-by-Screen (UX Map)

1. **Onboarding** → goals, injury/equipment, wake/sleep window.
2. **Initial Test** → guided max-rep test per exercise → baseline.
3. **Today (Home)** → 3 rings + today's intraday blocks on a timeline; big "Start next block".
4. **Rep Counter** → giant number, tempo slider, mode switch (metronome/tap/voice/camera), rest timer, sound toggle.
5. **Progress** → streak, calendar heatmap, charts, PRs, badges.
6. **Friends** → feed, leaderboard, add friend, send/receive nudges, challenges.
7. **Settings** → reminders, sound packs, tempo defaults, theme, language, streak-freezes.

---

## 7. Build Roadmap (Milestones)

### Phase 0 — Foundation (Week 1–2)
- Next.js + PWA scaffold on Vercel, offline shell, Supabase auth, design system.

### Phase 1 — MVP: solo core loop (Week 3–6)
- Onboarding + initial test + baseline.
- Daily plan engine + intraday split.
- **Rep counter with sound + tempo slider** (metronome + tap modes).
- Local logging, streaks, basic rings. *(Shippable, genuinely useful.)*

### Phase 2 — Retention layer (Week 7–9)
- Charts, calendar heatmap, badges, streak-freeze/recovery.
- Warm-up/cool-down flows.
- Scheduled reminders (Web Push + Vercel Cron).

### Phase 3 — Social & nudges (Week 10–12)
- Friends, feed, leaderboards, challenges.
- Peer-nudge + auto-nudge-a-friend + inactivity nudges.

### Phase 4 — Advanced (post-launch)
- Camera pose-detection auto-count, voice-triggered counting.
- Tempo notation (3-1-2-1), custom sound packs, milestone certificates.
- Apple Health / Google Fit export.

---

## 8. Success Metrics
- **D1/D7/D30 retention** (target: beat the 4–27% industry survival by leaning on streaks + social). <cite>turn1search17</cite>
- **% of users completing 100/day** within 6–8 weeks (benchmark: proven programs claim 100 in 6–10 weeks). <cite>turn1search24</cite>
- Daily active blocks completed, streak length, friends per user, nudges → workout conversion.

---

## 9. Risks & Mitigations
| Risk | Mitigation |
|---|---|
| Overtraining/injury from 100/day too fast | Baseline-gated ramp, deloads, regressions, injury flags, rest days |
| Notification fatigue → uninstalls | Smart, few, personalized nudges (not spam) — behavioral design over blasting <cite>turn1search17</cite> |
| Rep-counter timing drift | Web Audio scheduler, not `setInterval` |
| Free-tier limits | On-device AI + local-first data minimize server load |
| Retention cliff | Streaks, streak-freezes, social accountability from day 1 <cite>turn1search17</cite> |

---

## 10. Naming & Branding (optional)
Working name **CenturyFit** (100 = a century). Alternatives: *Triple100*, *HundredEveryday*, *100³*, *GrooveReps*. Tagline: *"100 a day. Every day. From wherever you start."*

---

### Appendix — Reference Apps Consulted
Hundred Pushups program & app <cite>turn1search19</cite><cite>turn1search20</cite>; Push-Ups 0–100 trainer <cite>turn1search21</cite>; James Sugrue HundredPushups <cite>turn1search22</cite>; Zen Labs 0–100 Pushups (voice coach, badges) <cite>turn1search23</cite>; BeStronger (test→program, reminders, warm-up) <cite>turn1search24</cite>; Foxyfitness (groups, streaks, streak-freezes, per-exercise apps) <cite>turn1search12</cite>; 100.Reps (pull-ups+push-ups+squats, offline) <cite>turn1search7</cite>; 100 Reps Tracker (Focus/Overview mode, streak recovery, certificates) <cite>turn1search8</cite>; 100 Pull Ups Workout (adaptive personal plans) <cite>turn1search10</cite>; pull-up tracking app landscape <cite>turn1search9</cite>; TikMe (voice counter, custom cues, screen-on) <cite>turn1search1</cite>; TimerBro (pulsing metronome, tempo notation, music mixing) <cite>turn1search6</cite>; REPS web counter (manual/timer/camera/voice modes) <cite>turn1search5</cite>; RepCount (progress charts, PRs) <cite>turn1search2</cite>; Nudges Me (auto progression/reminders) <cite>turn1search14</cite>; Fito (friends, nudges, cross-platform) <cite>turn1search15</cite>; FitCraft (accountability, gamification, retention research) <cite>turn1search17</cite>.
