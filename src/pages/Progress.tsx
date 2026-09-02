import { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import IconChip from '../components/IconChip';
import { getStreak, getAllDayRecords } from '../db';
import type { StreakData } from '../types';

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const WEEK_BARS = [
  [54, 32, 61], [68, 44, 72], [41, 25, 48], [79, 52, 83], [88, 60, 91], [36, 20, 40], [46, 29, 44],
];

const CAL_LEVELS = [0,3,3,2,3,1,0,3,3,3,2,3,3,0,1,3,3,3,3,2,0,3,3,2,3,3,3,3];
const CAL_BG = ['rgba(233,233,237,.05)', '#2b2741', '#5d5294', '#9184d9'];

const PBS = [
  { name: 'Best push-up set', val: 21, delta: '+3', icon: '⌃', chip: '#423a6a' },
  { name: 'Best pull-up set', val: 6, delta: '+2', icon: '⌄', chip: '#3f424d' },
  { name: 'Best squat set', val: 48, delta: '+5', icon: '◍', chip: '#2b2741' },
];

export default function Progress() {
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [totalReps, setTotalReps] = useState(0);

  useEffect(() => {
    getStreak().then(setStreak);
    getAllDayRecords().then((records) => {
      const total = records.reduce((sum, r) => {
        return sum + Object.values(r.exercises).reduce((s, e) => s + e.completed, 0);
      }, 0);
      setTotalReps(total);
    });
  }, []);

  return (
    <div className="flex-1 h-full overflow-y-auto flex flex-col px-5 pt-4 pb-24 gap-3.75">
      <div className="text-[22px] font-medium tracking-[-0.02em]">Progress</div>

      <div className="flex gap-2.5 items-stretch">
        <div
          className="flex-1 p-[15px] rounded-[15px] shadow-sm flex flex-col gap-0.5"
          style={{ background: 'linear-gradient(150deg, #20233a, #181a28)' }}
        >
          <span className="text-[10px] tracking-[0.12em] text-accent">STREAK</span>
          <span className="text-[34px] font-medium leading-[1.1] tabular-nums">{streak?.current ?? 0}</span>
          <span className="text-[11.5px] text-neutral-500">days · best {streak?.longest ?? 0}</span>
        </div>
        <StatCard kicker="TOTAL REPS" kickerAccent={false} value={totalReps.toLocaleString()} caption="since start" />
      </div>

      <div className="p-[15px] rounded-[15px] bg-surface shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium">This week</span>
          <div className="flex gap-2.5 text-[10.5px] text-neutral-500">
            <span className="flex items-center gap-1"><i className="w-1.75 h-1.75 rounded-sm bg-[#9184d9] block" />Push</span>
            <span className="flex items-center gap-1"><i className="w-1.75 h-1.75 rounded-sm bg-[#b5abfc] block" />Pull</span>
            <span className="flex items-center gap-1"><i className="w-1.75 h-1.75 rounded-sm bg-[#5d5294] block" />Squat</span>
          </div>
        </div>
        <div className="flex items-end justify-between gap-2 h-28">
          {WEEK_BARS.map((day, i) => (
            <div key={i} className="flex-1 flex items-end gap-0.5 h-full">
              <i style={{ height: `${day[0]}%`, background: '#9184d9' }} className="flex-1 rounded-sm block" />
              <i style={{ height: `${day[1]}%`, background: '#b5abfc' }} className="flex-1 rounded-sm block" />
              <i style={{ height: `${day[2]}%`, background: '#5d5294' }} className="flex-1 rounded-sm block" />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-neutral-600">
          {DAY_LABELS.map((d, i) => <span key={i}>{d}</span>)}
        </div>
      </div>

      <div className="p-[15px] rounded-[15px] bg-surface shadow-sm flex flex-col gap-2.75">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium">Last 4 weeks</span>
          <span className="text-[11px] text-neutral-500">86% complete</span>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {CAL_LEVELS.map((lvl, i) => (
            <span
              key={i}
              style={{ background: CAL_BG[lvl], color: lvl >= 2 ? '#f5f4ff' : '#75798c' }}
              className="aspect-square rounded-[7px] grid place-items-center text-[10px] tabular-nums"
            >
              {i + 1}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-[11px] tracking-[0.1em] text-neutral-500">PERSONAL BESTS</span>
        {PBS.map((p) => (
          <div key={p.name} className="flex items-center gap-2.75 px-3.25 py-3 rounded-xl bg-surface">
            <IconChip bg={p.chip} size={30}>{p.icon}</IconChip>
            <span className="flex-1 text-[13.5px]">{p.name}</span>
            <span className="text-sm font-medium tabular-nums">{p.val}</span>
            <span className="text-[10.5px] text-accent">{p.delta}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
