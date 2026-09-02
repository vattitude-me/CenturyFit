import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import IconChip from '../../components/IconChip';
import { getBaselineLogs, saveProfile } from '../../db';
import { computeDay1Target } from '../../engine/coach';
import type { Exercise, Profile } from '../../types';
import { EXERCISE_LABELS } from '../../types';

const ICONS: Record<Exercise, string> = { push: '⌃', pull: '⌄', squat: '◍' };

export default function PlanPreview() {
  const navigate = useNavigate();
  const [maxes, setMaxes] = useState<Record<Exercise, number>>({ push: 8, pull: 1, squat: 22 });

  useEffect(() => {
    getBaselineLogs().then((logs) => {
      const m: Record<Exercise, number> = { push: 8, pull: 1, squat: 22 };
      for (const log of logs) m[log.exercise] = log.maxReps;
      setMaxes(m);
    });
  }, []);

  const day1 = {
    push: computeDay1Target(maxes.push),
    pull: computeDay1Target(maxes.pull),
    squat: computeDay1Target(maxes.squat),
  };

  const handleStart = async () => {
    const profile: Profile = {
      id: 'me',
      name: 'Alex',
      createdAt: Date.now(),
      maxes,
      pullRung: 2,
      barAccess: 'doorway',
      wake: '06:30',
      sleep: '23:00',
      windowCount: 4,
      reflow: true,
      onboardingComplete: true,
      baselineComplete: true,
    };
    await saveProfile(profile);
    navigate('/today', { replace: true });
  };

  const rows: { key: Exercise; sub: string }[] = [
    { key: 'push', sub: `Max ${maxes.push} · 6 sets of 4 · +8% a week` },
    { key: 'pull', sub: `Max ${maxes.pull} · band-assisted, 3 sets of 2` },
    { key: 'squat', sub: `Max ${maxes.squat} · 4 sets of 10 · ladders Tue/Fri` },
  ];

  return (
    <div className="route-forward h-full overflow-y-auto flex flex-col px-5.5 pt-5.5 pb-6 gap-4">
      <div className="flex flex-col gap-1.5">
        <div className="text-[10px] tracking-[0.14em] text-accent">YOUR PLAN · 84 DAYS</div>
        <div className="text-[27px] font-medium tracking-[-0.02em]">From {maxes.push} to 100</div>
        <div className="text-[13.5px] leading-[1.5] text-neutral-400">
          Ladders twice a week, everything else at a percentage of your max. It goes up about 8% a week, slow enough that you keep showing up.
        </div>
      </div>

      <div
        className="px-3.5 pt-4 pb-3 rounded-[14px] shadow-sm"
        style={{ background: 'linear-gradient(150deg, #1d2033, #161826)' }}
      >
        <svg viewBox="0 0 300 110" className="w-full h-[110px] block overflow-visible">
          <defs>
            <linearGradient id="hgrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#9184d9" stopOpacity="0" />
              <stop offset="1" stopColor="#9184d9" stopOpacity=".35" />
            </linearGradient>
          </defs>
          <path d="M4 100 L54 92 L104 78 L154 60 L204 40 L254 20 L296 6 L296 106 L4 106 Z" fill="url(#hgrad)" />
          <path d="M4 100 L54 92 L104 78 L154 60 L204 40 L254 20 L296 6" fill="none" stroke="#9184d9" strokeWidth="2" strokeLinecap="round" />
          <circle cx="4" cy="100" r="4" fill="#9184d9" />
          <circle cx="296" cy="6" r="4" fill="#e9e9ed" />
          <text x="4" y="112" fill="#75798c" fontSize="9" fontFamily="Inter">Day 1 · {day1.push} reps</text>
          <text x="296" y="112" fill="#75798c" fontSize="9" fontFamily="Inter" textAnchor="end">Day 84 · 100 reps</text>
        </svg>
      </div>

      <div className="flex flex-col gap-2">
        {rows.map((r) => (
          <div key={r.key} className="flex items-center gap-3.25 px-3.5 py-3.25 rounded-[13px] bg-surface shadow-sm">
            <IconChip exercise={r.key} size={34}>{ICONS[r.key]}</IconChip>
            <span className="flex-1 flex flex-col gap-px">
              <span className="text-[14.5px] font-medium">{EXERCISE_LABELS[r.key]}</span>
              <span className="text-[11.5px] text-neutral-500">{r.sub}</span>
            </span>
            <span className="text-right flex flex-col gap-px">
              <span className="text-base font-medium tabular-nums">{day1[r.key]}</span>
              <span className="text-[10px] text-neutral-600">day 1 total</span>
            </span>
          </div>
        ))}
      </div>

      <div className="mt-auto">
        <Button variant="primary" block className="h-12 text-[15px]" onClick={handleStart}>Start day 1</Button>
      </div>
    </div>
  );
}
