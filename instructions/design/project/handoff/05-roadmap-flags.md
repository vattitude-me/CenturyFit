# Flags, permissions, platform notes

## Ship order

**v1 (offline, no account)** — onboarding + baseline, plan, auto-scheduled windows, dashboard, live counter with voice cadence + tap fallback, set complete, progress & streaks, settings. All data on-device. No sign-up anywhere in the app.

**v1.1 — reminders & nudges.** Local notifications only: 5 minutes before each window, plus max two playful nudges a day. Requires the notification permission — ask at the *first* window reminder opt-in, never on launch.

**v1.2 — accounts & sync.** Optional sign-in that **merges** the local ledger into the account (append-only `SetLog` with client ids = union merge, no conflict UI). The Settings panel already promises this; keep the wording.

**v1.3 — Squad.** Friends, feed, nudges, leaderboards. Depends on accounts. Stays a side tab. Nudges capped at 2 per friend per day.

**Later** — camera auto-count (ships behind a flag once pose accuracy holds), watch app, challenges.

## Feature flags

| Flag | Default | Gates |
| --- | --- | --- |
| `counter.camera` | off | Camera auto-count mode + its Settings row |
| `notifications.reminders` | off until v1.1 | window reminders, nudges |
| `account.sync` | off until v1.2 | sign-in, merge flow, sync panel CTA |
| `social.squad` | preview | Squad tab renders the preview screen only |
| `counter.variant` | `cadenceRing` | `cadenceRing` \| `bigNumeral` \| `ladderLane` |
| `dashboard.variant` | `rings` | `rings` \| `fuelBars` |

Keep the last two as remote-configurable — they're the two screens worth A/B testing.

## Permissions

| Permission | When asked | If denied |
| --- | --- | --- |
| Notifications | first reminder opt-in (v1.1) | reminders row stays off, no nag |
| Camera | first tap of Camera auto mode | silent fallback to voice-led |
| Motion (optional) | never in v1 | — |

Nothing in v1 requires a permission to complete a workout.

## Platform differences

**iOS** — background audio mode for cadence under lock; `AVAudioSession .duckOthers`; `AVSpeechSynthesizer`; Core Haptics; `UNUserNotificationCenter` for window reminders; keep-awake via `isIdleTimerDisabled` during a set.

**Android** — foreground service (media/exercise) for background cadence; `AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK`; `TextToSpeech`; `VibratorManager` (haptics off below API 29); `AlarmManager`/WorkManager for exact-time reminders; `KEEP_SCREEN_ON`.

**PWA** — `speechSynthesis` + Web Audio for ticks. Two honest limits: background/locked-screen audio is not guaranteed on iOS Safari, and scheduled local notifications are unavailable there. Detect and tell the user in one line at the Settings row rather than failing silently; suggest keeping the tab foregrounded during a set. Cache-first service worker; IndexedDB for the ledger; installable with a maskable dark icon on `#161826`.

## Non-negotiables

- No paywall, no ads, no locked exercises — anywhere, including empty states.
- No sign-up before a first workout.
- Never lose a rep: append-only ledger, manual `±`, crash recovery prompt.
- Never guilt the user. A missed window reflows; a broken streak still shows total reps.
