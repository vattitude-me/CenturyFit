import { useEffect, useState } from 'react';
import { getAllDayRecords, getStreak, getSetLogs, getDailyPlans } from '../db';
import { EXERCISE_LABELS } from '../engine/progression';
import { FlameIcon, TargetIcon, TrendingUpIcon, TrophyIcon, ChevronLeftIcon, ChevronRightIcon } from '../components/icons';
import type { DayRecord, StreakData, Exercise } from '../types';

const EXERCISE_COLORS: Record<Exercise, string> = {
  pushups: '#F97316',
  pullups: '#22C55E',
  squats: '#A78BFA',
};

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function getWeekDates(): string[] {
  const today = new Date();
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day + 6) % 7));
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

function getMonthCalendar(): { date: string; dayNum: number }[] {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dates: { date: string; dayNum: number }[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    dates.push({ date: dateStr, dayNum: d });
  }
  return dates;
}

interface DayBar {
  date: string;
  label: string;
  reps: Record<Exercise, number>;
}

export default function Progress() {
  const [streak, setStreak] = useState<StreakData>({ current: 0, longest: 0, freezesRemaining: 3, lastActiveDate: '' });
  const [dayRecords, setDayRecords] = useState<DayRecord[]>([]);
  const [weekStats, setWeekStats] = useState<{ totalReps: number; completionRate: number; personalBests: number }>({ totalReps: 0, completionRate: 0, personalBests: 0 });
  const [weekBars, setWeekBars] = useState<DayBar[]>([]);

  useEffect(() => {
    async function load() {
      const s = await getStreak();
      setStreak(s);
      const records = await getAllDayRecords();
      setDayRecords(records);

      const weekDates = getWeekDates();
      const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
      let totalReps = 0;
      let daysWithGoals = 0;
      let daysComplete = 0;
      const bars: DayBar[] = [];

      for (let i = 0; i < weekDates.length; i++) {
        const date = weekDates[i];
        const logs = await getSetLogs(date);
        const reps: Record<Exercise, number> = { pushups: 0, pullups: 0, squats: 0 };
        for (const log of logs) reps[log.exercise] += log.reps;
        totalReps += logs.reduce((sum, l) => sum + l.reps, 0);
        bars.push({ date, label: dayLabels[i], reps });

        const dayPlans = await getDailyPlans(date);
        if (dayPlans.length > 0) {
          daysWithGoals++;
          if (dayPlans.every(p => p.completedReps >= p.targetReps)) daysComplete++;
        }
      }
      setWeekBars(bars);
      setWeekStats({
        totalReps,
        completionRate: daysWithGoals > 0 ? Math.round((daysComplete / daysWithGoals) * 100) : 0,
        personalBests: 0,
      });
    }
    load();
  }, []);

  const today = getToday();
  const monthCalendar = getMonthCalendar();
  const completedDates = new Set(dayRecords.filter(r => r.allGoalsMet).map(r => r.date));
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentMonth = monthNames[new Date().getMonth()];
  const currentYear = new Date().getFullYear();
  const maxBarValue = Math.max(30, ...weekBars.map(b => Math.max(b.reps.pushups, b.reps.pullups, b.reps.squats)));

  return (
    <div className="px-5 py-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Progress</h1>
        <span className="text-xs text-text-secondary bg-bg-card px-3 py-1.5 rounded-full">This Week</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-4 rounded-xl bg-bg-card text-center">
          <TargetIcon size={20} className="mx-auto mb-1" />
          <div className="text-lg font-bold">{weekStats.completionRate}%</div>
          <div className="text-text-muted text-[10px]">Completion</div>
        </div>
        <div className="p-4 rounded-xl bg-bg-card text-center">
          <FlameIcon size={20} className="mx-auto mb-1" />
          <div className="text-lg font-bold">{streak.current}</div>
          <div className="text-text-muted text-[10px]">Day Streak</div>
        </div>
        <div className="p-4 rounded-xl bg-bg-card text-center">
          <TrendingUpIcon size={20} className="mx-auto mb-1" />
          <div className="text-lg font-bold">{weekStats.totalReps}</div>
          <div className="text-text-muted text-[10px]">Total Reps</div>
        </div>
      </div>

      {/* Weekly grouped bar chart */}
      <h2 className="text-lg font-semibold mb-3">Weekly Volume</h2>
      <div className="rounded-2xl bg-bg-card p-4 mb-6">
        <div className="flex items-end justify-between gap-2 h-32 mb-2">
          {weekBars.map(bar => (
            <div key={bar.date} className="flex-1 flex items-end justify-center gap-0.5 h-full">
              {(['pushups', 'pullups', 'squats'] as Exercise[]).map(ex => (
                <div
                  key={ex}
                  className="flex-1 rounded-t-sm transition-all duration-500"
                  style={{
                    height: `${Math.max(2, (bar.reps[ex] / maxBarValue) * 100)}%`,
                    backgroundColor: EXERCISE_COLORS[ex],
                    opacity: bar.date === today ? 1 : 0.75,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          {weekBars.map(bar => (
            <span key={bar.date} className={`flex-1 text-center text-[10px] ${bar.date === today ? 'text-purple-light font-semibold' : 'text-text-muted'}`}>
              {bar.label}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-center gap-4 mt-4">
          {(['pushups', 'pullups', 'squats'] as Exercise[]).map(ex => (
            <div key={ex} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: EXERCISE_COLORS[ex] }} />
              <span className="text-[10px] text-text-muted">{EXERCISE_LABELS[ex]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Streak card */}
      <div className="flex items-center gap-4 p-5 rounded-2xl bg-bg-card border-2 border-border mb-6">
        <FlameIcon size={40} />
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{streak.current}</span>
            <span className="text-text-secondary text-sm">Day Streak</span>
          </div>
          <div className="flex items-center gap-1.5 text-text-muted text-xs mt-1">
            <TrophyIcon size={14} />
            Best: {streak.longest} days
          </div>
        </div>
      </div>

      {/* Calendar Heatmap */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">{currentMonth} {currentYear}</h2>
        <div className="flex items-center gap-1 text-text-muted">
          <ChevronLeftIcon size={16} />
          <ChevronRightIcon size={16} />
        </div>
      </div>
      <div className="rounded-2xl bg-bg-card p-4 mb-6">
        <div className="grid grid-cols-7 gap-2 text-center text-xs text-text-muted mb-2">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {(() => {
            const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay();
            const offset = (firstDay + 6) % 7;
            const blanks = Array.from({ length: offset }, (_, i) => (
              <div key={`blank-${i}`} />
            ));
            const days = monthCalendar.map(({ date, dayNum }) => {
              const isComplete = completedDates.has(date);
              const isToday = date === today;
              return (
                <div
                  key={date}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium mx-auto ${
                    isComplete
                      ? 'bg-green-accent text-white'
                      : isToday
                        ? 'bg-purple-accent/30 text-purple-light border border-purple-accent'
                        : date < today
                          ? 'bg-bg-primary text-text-muted'
                          : 'text-text-muted'
                  }`}
                >
                  {dayNum}
                </div>
              );
            });
            return [...blanks, ...days];
          })()}
        </div>
        <div className="flex items-center justify-center gap-2 text-text-muted text-xs mt-4">
          <FlameIcon size={16} />
          <span>Don't break the chain! You've got this!</span>
        </div>
      </div>
    </div>
  );
}
