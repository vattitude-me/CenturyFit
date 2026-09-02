# Screen-by-screen spec

Order matches the screen rail in the prototype. Every screen is 390 × 844 logical px, safe-area aware, dark ground `--color-bg` (#161826).

---

## 01 — Welcome

**Purpose:** convert on the promise before asking for anything.

Layout, top to bottom: accent kicker `HUNDRED` (11px, .22em tracking) · headline 38px/1.04, three lines, weight 500 · 14px support paragraph, max 290px · flexible hero panel (gradient `#1d2033 → #161826`, radius 16px, radial accent bloom top-right) containing a 9-bar ascending chart and the overline `3 REPS → 100 REPS · 12 WEEKS` · primary button `Find my starting point` (48px, accent outline) · secondary `I already train — skip ahead` (44px) · three neutral tags: `Free forever` `Works offline` `No account needed`.

- No status-bar overlay content; no nav bar; no tab bar.
- Primary → 02. Secondary → 06 (plan is seeded from typed maxes later).
- Copy: *"Three hundred reps a day. Cut into pieces you'll actually do."*

## 02 — Baseline test

**Purpose:** one honest max set per exercise; every number in the plan derives from these three.

Header row: back button (36px icon, secondary) · 3px progress track at 33% · `1 of 3`.
Then h-27px `Let's find your floor` + 13.5px support copy. Three tap rows (radius 14, `--color-surface`, 38px icon chip in the exercise's ramp tint): name, sub-label, and a right-side value that reads `Test →` before and `8 reps` after. Accent-900 tip panel: pull-up zero is explicitly fine. Footer: primary CTA (label flips to `Build my plan` once all three are recorded) + ghost `I'll type my numbers instead`.

**States:** untested (muted `Test →`) / tested (accent-200 value) / skipped (value `—`, plan uses conservative defaults 5 / 0 / 15).
Tapping a test row opens the **live counter (07)** in `baseline` mode — no target, count-up only, `End test` banks the max.

## 03 — Equipment & pull-up path

Radio group, 3 options: doorway/wall bar · park or gym bar · no bar yet. Selected state = 1px accent inset ring + filled dot with a 4px bg-colored inner ring (never a fill-only cue).

Below: the **pull-up path** panel — 5 equal rungs as 4px bars with 9.5px labels: Rows · Negatives · Band · Partials · Full. Cleared rungs and current rung take the accent; future rungs take `rgba(233,233,237,.14)`; the current label alone is accent-300. Body copy states the promotion rule: **8 clean reps in one set moves you up a rung.**

`No bar yet` swaps the path to Rows → Incline rows → Negatives (door-frame) and shows a one-line note that the 100-rep pull-up goal stays, measured in rows until a bar exists.

## 04 — Auto-scheduled windows

The coach proposes; the user edits. Four rows (radius 13): time (52px, tabular) · body text + duration sub-line · drag handle. All rows reorderable; reps redistribute on drop.

Below, one toggle row: **Let the coach re-shuffle** — "Miss a window and the reps move, not vanish." Default **on**. Toggle: 44 × 26 track, 20px knob, accent when on.

Default proposal for a day-1 user (waking 06:30, sleeping 23:00): 07:10 push · 09:40 squats · 12:30 pull · 17:45 mixed. No window exceeds ~6 min.

## 05 — Plan preview

Accent kicker `YOUR PLAN · 84 DAYS`, headline `From 8 to 100`, then a filled area chart (SVG, 300×110 viewBox, accent stroke 2px + 35%→0 gradient fill) with anchored end labels `Day 1 · 24 reps` and `Day 84 · 100 reps`.

Three plan rows, one per exercise: icon chip · name · progression sub-line (`8 max → 46 today · 8% a week`) · today's target in 16px tabular figures with a 10px `today` caption. CTA `Start day 1` → 06.

## 06 — Today dashboard  *(tab 1)*

**The only question this screen answers: what do I do in the next five minutes.**

1. Greeting `Morning, Alex` (22px) + `Day 12 · 90 reps left today`; streak pill top-right (accent-900 bg, accent-200 text).
2. **Progress block — two variants:**
   - *Rings* (default): three equal cards, 74px SVG ring (r 34, stroke 7, round cap, rotate -90°, dash 213.6), count over `/ target` inside, exercise name below.
   - *Fuel bars*: one card, three labelled 9px bars with the reps fraction right-aligned; denser, better for small phones.
3. **Up Next card** — gradient panel with accent bloom, kicker `UP NEXT · 12:30`, 21px title (`12 push-ups`), sub-line with ladder + duration, and the screen's **only** accent-outlined button, `Start`.
4. **Today's windows** — timeline: 42px right-aligned time gutter · 2px rail with an 11px dot · content card. Dot states: done (accent fill) / now (text-white fill + 5px accent halo) / later (14% white). Later rows at 0.6 opacity. Only the `now` row carries a `Start` button.
5. **Nudge strip** — accent-900, one playful line, copy swaps under/over 60 reps remaining.

Tab bar: Today · Progress · Squad · You. Active = accent-300, inactive = neutral-600. 84px tall with a top gradient scrim + blur.

## 07 — Live rep counter

**The working screen.** Assume the phone is on the floor, face-down or across the room: audio leads, the screen confirms.

Header: back · centered exercise name + `Set 3 of 5 · target 12` · voice toggle chip (36px, accent-800 tint when live).

**Three counter variants** (all share the same engine, all tappable to +1):
- *Cadence ring* (default) — 250px ring, r 112, stroke 10, dash 703.7, offset drives progress; a radial accent bloom pulses on the tempo (`animation: hpulse <tempo>s`); 82px count, `OF 12`, and a 17px `DOWN`/`UP` cue.
- *Big numeral* — 132px count, `REPS` overline, 22px cue below. Most legible at distance.
- *Ladder lane* — 16 stacked pips fill bottom-up as reps land, count and cue beside. Best for ladder sets.

Cue colors: `DOWN` accent, `UP` text-white, `PAUSED`/`READY` neutral-600.

**Tempo:** labelled range input, 1.00–4.00 s/rep, step 0.25, default 2.00. Marks: `1.0 explosive` · `2.0 standard` · `4.0 grind`. Changing tempo re-times the running cadence immediately.

**Controls:** − (52px) · play/pause (78px, accent outline) · + (52px), all circular. Manual ± is always available — never trap a rep the sensor missed.

**Mode chips:** Voice-led · Camera auto · Tap to count, switchable mid-set (see `04-counter-audio.md`).

**Footer:** ghost `End set — bank 8 reps` (label carries the live count).

## 08 — Set complete

Centered: 104px accent-900 disc with a 42px accent check and a 12px `rgba(145,132,217,.08)` outer glow — **no confetti**; the glow is the reward on a dark ground. Then `12 reps banked` (28px) and a line that states what's left today and across how many windows.

Three mini cards, one per exercise: name, `done / target`, 5px fill bar. Buttons: primary `Back to today`, secondary `One more set` (starts the next task immediately).

Reps bank into today's totals at set end, before this screen paints. Entry animation: 300ms rise + fade.

## 09 — Progress & streaks  *(tab 2)*

Two stat cards: **streak** (lit gradient card — the only lit surface on the screen; 34px value, `days · best 28`) and **total reps** (`--color-surface`, `9,412`, `since May 12`). Total reps sits beside the streak deliberately, so a broken streak doesn't erase the work.

**This week:** grouped bar chart, 7 days × 3 bars (push `#9184d9`, pull `#b5abfc`, squat `#5d5294`), 112px tall, legend top-right, day initials below.

**Last 4 weeks:** 7-column grid of 28 square cells, radius 7. Fill strength encodes completion, not pass/fail: none `rgba(233,233,237,.05)` / low `#2b2741` / mid `#5d5294` / full `#9184d9`.

**Personal bests:** three rows with icon chip, label, tabular value, accent delta (`+3`).

## 10 — Settings & profile  *(tab 4)*

Profile row: 52px accent-800 monogram tile, name, `Day 12 · this phone only`.

**Sync panel** (accent-900): `Accounts & sync — coming soon` + "Everything lives on your device today… When sync lands, your history merges into the account — nothing to re-enter." with a `Ping me when it's ready` toggle.

Three grouped lists (radius 14, hairline `rgba(233,233,237,.08)` separators, first row none):
- **Training** — Plan & progression · Pull-up path · Windows & reflow (all disclosure `›`)
- **Counter** — Voice count · Camera auto-count · Metronome ticks · Haptics (all toggles)
- **Reminders** — Window reminders (toggle) · Motivational nudges · Data & privacy · About Hundred

Footer, centered, neutral-600: "Hundred is free forever. No ads, no paywall, no locked exercises." — stated where paywalls usually sit.

## 11 — Squad (preview)  *(tab 3)*

Sets expectations, collects intent, fakes nothing. `Preview` outline tag, three dimmed (0.55 opacity) feed rows with monogram avatars, and a rule-separated note: **nudges are capped at two per friend per day.** CTA toggles to `You're on the list ✓`.

Ships after sync — a friend graph needs accounts.

---

## Navigation map

```
welcome → baseline → bar → schedule → plan → today
welcome ─(skip)────────────────────────────→ today
today ──Start──→ session ──complete/end──→ done ──→ today
                                          └─"one more set"→ session
tabs: today ⇄ progress ⇄ squad ⇄ settings
baseline row → session(mode: baseline) → baseline
```

Transitions: forward pushes slide left 240ms ease-out; tab switches cross-fade 140ms; `session` presents modally (cover vertical) and dismisses down; `done` fades in over `session`.
