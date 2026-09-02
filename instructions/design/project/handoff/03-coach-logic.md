# Coach logic — baseline, plan, split, progression

Numbers below are the ones the prototype shows. Tune freely; keep the shape.

## 1. Baseline

Three max sets: `push_max`, `pull_max`, `squat_max`. Skipped tests default to 5 / 0 / 15.

Pull-ups are measured on the user's **current rung**, not on full pull-ups.

## 2. Daily target ramp

Day-1 daily volume per exercise:

```
day1_target = clamp(round(max * 3), 12, 40)
```

(8 push-ups max → 24; the prototype shows day 12 at 46.)

Weekly increase **+8%**, compounding, capped at 100:

```
target(week w) = min(100, round(day1_target * 1.08^w))
```

24 → 100 lands at ~week 19 for a very low base; the plan is presented as **84 days** because the ramp is re-baselined every 3 weeks (see §5) and most users accelerate. Never present a date the math can't hit — recompute the projection after each re-baseline and update the plan curve.

## 3. Splitting the day into windows

Auto-scheduled: the coach proposes, the user edits.

- Window count = 4 by default (3 if the user's waking span < 12h, 5 if daily volume > 70/exercise).
- Reps per window per exercise: `ceil(remaining / windows_left)`, then rounded to the nearest ladder-friendly number.
- No window is designed to exceed **6 minutes**.
- Windows never mix more than 2 exercises.
- Placement avoids the first 30 min after waking and the last 60 min before sleep.

**Reflow (default on).** When a window is missed, its reps redistribute across the remaining windows, capped at +40% of any window's original volume. Overflow past that cap is dropped, not carried to tomorrow — and the coach says so in one non-judgmental line.

## 4. Set structure

Two models, both visible in the UI:

**Ladder / pyramid** — 2 days a week (Tue/Fri). A window's reps run `1-2-3-4-3-2-1`-style up to the window volume, with the rest interval equal to the tempo of the previous rung. Shown to the user as `Set 3 of 5 · 12 reps`.

**Percentage of max** — all other days. Each set is `round(current_max * 0.55)` reps, repeated until the window volume is met.

## 5. Re-baseline

Every 21 days, one window becomes a max test per exercise. New maxes reset `current_max` and the ramp continues from there. A max that drops triggers a **deload week** at 80% volume, framed as "planned, not a setback."

## 6. Pull-up path

Five rungs: `rows → negatives → band → partials → full`.

Promotion: **8 clean reps in a single set** on the current rung → next rung, and daily volume resets to `clamp(round(new_rung_max * 3), 12, 40)` for pull-ups only.
Demotion: two consecutive windows where the user logs < 40% of target → drop a rung, with a one-line explanation.

No-bar users train `rows → incline rows → door-frame negatives` and keep the same 100-rep goal, measured in rows.

## 7. Streak rule

A day counts toward the streak at **≥ 70% of the day's total volume** — not 100%. One "grace day" per 14 days preserves the streak. Total reps are always shown next to the streak so a break doesn't erase progress.

## 8. Data model (minimum)

```ts
type Exercise = 'push' | 'pull' | 'squat';

type Profile = {
  createdAt: string;
  maxes: Record<Exercise, number>;      // current max set
  pullRung: 0|1|2|3|4;
  barAccess: 'doorway' | 'park' | 'none';
  wake: string; sleep: string;          // "06:30"
  windowCount: number;
  reflow: boolean;
};

type DayPlan = {
  date: string;                          // ISO
  dayIndex: number;
  targets: Record<Exercise, number>;
  windows: Window[];
  model: 'ladder' | 'percent';
};

type Window = {
  id: string; at: string;                // "12:30"
  items: { exercise: Exercise; reps: number; ladder?: number[] }[];
  status: 'pending' | 'done' | 'missed' | 'reflowed';
};

type SetLog = {
  id: string; at: string; exercise: Exercise;
  reps: number; targetReps: number;
  tempo: number;                         // s/rep
  mode: 'voice' | 'camera' | 'tap';
  windowId?: string;
  source: 'session' | 'manual' | 'baseline';
};
```

Everything is local-first (SQLite / IndexedDB). `SetLog` is append-only with client-generated ids so the future account merge is a union, never a conflict.
