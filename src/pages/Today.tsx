import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import ProgressRing from '../components/ProgressRing';
import FillBar from '../components/FillBar';
import LitCard from '../components/LitCard';
import Button from '../components/Button';
import { TimelineRow, type TimelineDotState } from '../components/Timeline';
import { getProfile, getSettings, getSetLogs } from '../db';
import { generateDayPlan, reflowMissedWindows } from '../engine/planGenerator';
import type { Exercise, Profile, DayPlan, DashboardVariant } from '../types';
import { EXERCISE_LABELS, EXERCISE_COLOR } from '../types';

const DAILY_GOAL_CAP = 100;

function greeting(hour: number): string {
  if (hour < 5) return 'Still up';
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  if (hour < 21) return 'Evening';
  return 'Late one';
}

export default function Today() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [plan, setPlan] = useState<DayPlan | null>(null);
  const [dashboardVariant, setDashboardVariant] = useState<DashboardVariant>('rings');
  const [done, setDone] = useState<Record<Exercise, number>>({ push: 0, pull: 0, squat: 0 });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const p = await getProfile();
      if (!p || cancelled) return;
      setProfile(p);
      const settings = await getSettings();
      if (cancelled) return;
      setDashboardVariant(settings.dashboardVariant);

      const today = new Date().toISOString().slice(0, 10);
      const dayIndex = Math.floor((Date.now() - p.createdAt) / 86400000);
      let dp = await generateDayPlan(today, dayIndex, p);
      if (p.reflow) dp = await reflowMissedWindows(dp);
      if (cancelled) return;
      setPlan(dp);

      const logs = await getSetLogs(today);
      const completed: Record<Exercise, number> = { push: 0, pull: 0, squat: 0 };
      for (const log of logs) completed[log.exercise] += log.reps;
      if (!cancelled) setDone(completed);
    };

    load();
    const id = setInterval(load, 60_000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  if (!profile || !plan) return null;

  const rings = (['push', 'pull', 'squat'] as Exercise[]).map((ex) => {
    const target = plan.targets[ex] || 1;
    const d = done[ex];
    const pct = Math.round((100 * d) / target);
    return { key: ex, name: EXERCISE_LABELS[ex], done: d, target: plan.targets[ex], pct, color: EXERCISE_COLOR[ex] };
  });

  const totalDone = rings.reduce((a, r) => a + r.done, 0);
  const dailyGoal = Math.max(DAILY_GOAL_CAP, rings.reduce((a, r) => a + r.target, 0));
  const totalLeft = Math.max(0, dailyGoal - totalDone);
  const goalHit = totalDone >= dailyGoal;

  const nextWindow = plan.windows.find((w) => w.status === 'pending' || w.status === 'reflowed');
  const nextItem = nextWindow?.items[0];
  const nextExercise = nextItem?.exercise ?? 'push';
  const nextReps = nextItem?.reps ?? 12;

  const sessionUrl = (w: typeof plan.windows[number]) =>
    `/session?windowId=${w.id}&items=${encodeURIComponent(JSON.stringify(w.items))}`;

  const windowRows = plan.windows.map((w, i) => {
    const state: TimelineDotState = w.status === 'done' ? 'done' : (w === nextWindow ? 'now' : 'later');
    const item = w.items[0];
    return {
      id: w.id + i, time: w.at, state, window: w,
      name: item ? EXERCISE_LABELS[item.exercise] : '',
      sub: w.items.map((it) => `${it.reps} ${EXERCISE_LABELS[it.exercise].toLowerCase()}`).join(' + '),
      actionable: state === 'now',
    };
  });

  return (
    <div className="flex-1 h-full flex flex-col px-5 pt-3.5 pb-24 gap-3.75">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <div className="text-[22px] font-medium tracking-[-0.02em]">{greeting(new Date().getHours())}, {profile.name}</div>
          <div className="text-[12.5px] text-neutral-500">
            Day {plan.dayIndex + 1} · {totalDone} of {dailyGoal} reps today{goalHit ? ' · goal hit' : ''}
          </div>
        </div>
        <button
          onClick={() => navigate('/session/log')}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent-900 text-accent-200 text-xs font-medium flex-none cursor-pointer"
        >
          <Plus size={13} strokeWidth={2.5} /><span>Log reps</span>
        </button>
      </div>

      <div className="flex flex-col gap-1.5 px-1">
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] tracking-[0.1em] text-neutral-500">TODAY'S GOAL</span>
          <span className="text-xs tabular-nums" style={{ color: goalHit ? '#d2cefd' : '#75798c' }}>
            {totalDone} / {dailyGoal}
          </span>
        </div>
        <FillBar pct={Math.round((100 * totalDone) / dailyGoal)} color={goalHit ? '#9184d9' : '#5d5294'} height={11} />
      </div>

      {dashboardVariant === 'rings' ? (
        <div className="flex gap-2.5">
          {rings.map((r) => (
            <div key={r.key} className="flex-1 flex flex-col items-center gap-1.75 px-1.5 py-3.25 rounded-[14px] bg-surface shadow-sm">
              <ProgressRing size={74} strokeWidth={7} progress={r.pct / 100} color={r.color}>
                <div className="flex flex-col items-center">
                  <span className="text-[19px] font-medium tabular-nums leading-none">{r.done}</span>
                  <span className="text-[9.5px] text-neutral-600">/ {r.target}</span>
                </div>
              </ProgressRing>
              <span className="text-[11px] text-neutral-400">{r.name}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2.75 p-3.75 rounded-2xl bg-surface shadow-sm">
          {rings.map((r) => (
            <div key={r.key} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between">
                <span className="text-[12.5px] text-neutral-300">{r.name}</span>
                <span className="text-xs tabular-nums text-neutral-500">{r.done} / {r.target}</span>
              </div>
              <FillBar pct={r.pct} color={r.color} />
            </div>
          ))}
          <div className="text-[11.5px] text-neutral-500 mt-0.5">
            {goalHit ? "Today's goal is done" : `${totalLeft} reps left to hit ${dailyGoal}`}
          </div>
        </div>
      )}

      <LitCard className="flex flex-col gap-2.75 p-4">
        <div className="text-[10px] tracking-[0.12em] text-accent">
          {nextWindow ? `UP NEXT · ${nextWindow.at}` : 'ALL WINDOWS DONE'}
        </div>
        <div className="flex items-end justify-between gap-3">
          <div className="flex flex-col gap-0.75">
            {nextWindow ? (
              <>
                <div className="text-[21px] font-medium tracking-[-0.02em]">{nextReps} {EXERCISE_LABELS[nextExercise].toLowerCase()}</div>
                <div className="text-[12.5px] text-neutral-400">Ladder 1–4 · about 4 min</div>
              </>
            ) : (
              <div className="text-[15px] text-neutral-400">Nothing left scheduled today. Nice work.</div>
            )}
          </div>
          {nextWindow && (
            <Button
              variant="primary" className="h-11 px-5 text-[14.5px] flex-none"
              onClick={() => navigate(sessionUrl(nextWindow))}
            >
              Start
            </Button>
          )}
        </div>
      </LitCard>

      <div className="flex flex-col gap-2.25">
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] tracking-[0.1em] text-neutral-500">TODAY'S WINDOWS</span>
          <span className="text-[11.5px] text-accent">Reflow</span>
        </div>
        {windowRows.map((w) => (
          <TimelineRow key={w.id} time={w.time} state={w.state}>
            <span className="flex-1 flex flex-col gap-px">
              <span className="text-[13.5px] font-medium">{w.name}</span>
              <span className="text-[11px] text-neutral-500">{w.sub}</span>
            </span>
            {w.actionable && (
              <Button
                variant="secondary" className="h-7.5 px-3 text-xs flex-none"
                onClick={() => navigate(sessionUrl(w.window))}
              >
                Start
              </Button>
            )}
          </TimelineRow>
        ))}
      </div>

      <div className="flex gap-2.5 items-center px-3.5 py-3.25 rounded-[13px] bg-accent-900">
        <span className="text-[15px]">✦</span>
        <span className="text-[12.5px] leading-[1.5] text-accent-200">
          {goalHit
            ? "Today's 100 is banked. Anything extra is a bonus."
            : !nextWindow
              ? `No windows left today, but you're ${totalLeft} short of 100. Tap "Log reps" to finish it off.`
              : totalLeft > 60
                ? 'Big day still ahead. Twelve reps now is worth more than fifty tonight.'
                : "You're past the hump, the rest is downhill from here."}
        </span>
      </div>
    </div>
  );
}
