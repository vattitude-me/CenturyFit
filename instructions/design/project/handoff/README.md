# Hundred — build handoff

**Product.** A coach that takes someone from ~3 push-ups to 100 push-ups, 100 pull-ups and 100 squats every day, split into short windows across the day, counted out loud rep by rep.

**Positioning.** Free forever. No ads, no paywall, no locked exercises. Offline-first and usable with no account. Accounts + sync, reminders, and social ship after v1 (see `05-roadmap-flags.md`).

**Targets.** Native iOS, native Android, and PWA from one design. All layouts are spec'd at 390 × 844 logical px and scale by intrinsic sizing — nothing is pixel-pinned.

## Files

| File | What it holds |
| --- | --- |
| `01-screens.md` | Screen-by-screen spec: purpose, layout, states, copy, transitions |
| `02-components-tokens.md` | Component inventory + the Nocturne tokens each part consumes |
| `03-coach-logic.md` | Baseline → plan → daily split → progression math |
| `04-counter-audio.md` | Rep counter modes, cadence engine, audio/haptic contract |
| `05-roadmap-flags.md` | Feature flags, permissions, platform differences |

The interactive reference is `Hundred Reps Coach.dc.html` in the project root — it runs the real cadence engine and carries two counter variants and two dashboard variants (switchable in Tweaks). Treat the prototype as the source of truth for motion and interaction; treat these files as the source of truth for numbers and copy.

## Design direction

Nocturne: near-neutral blue-grey dark ground (`#161826`), Inter at weight 500 for headings, 8px/14px radii, a single blurple accent (`#9184d9`) used as **line and glow, never as a flood**. Primary buttons are accent-outlined, not filled. Contrast comes from tonal ramps, not saturation.

Copy tone: **playful but not shouty.** Encouragement never outranks the action on screen. Never guilt the user for a missed window — the coach moves the reps instead.
