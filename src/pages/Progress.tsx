import { useEffect, useState } from 'react';
import { getAllDayRecords, getStreak, getSetLogs, getDailyPlans } from '../db';
import { EXERCISE_LABELS } from '../engine/progression';
import type { DayRecord, StreakData, Exercise } from '../types';
import { Flame, Target, TrendingUp } from 'lucide-react';

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

export default function Progress() {
  const [streak, setStreak] = useState<StreakData>({ current: 0, longest: 0, freezesRemaining: 3, lastActiveDate: '' });
  const [dayRecords, setDayRecords] = useState<DayRecord[]>([]);
  const [weekStats, setWeekStats] = useState<{ totalReps: number; completionRate: number; personalBests: number }>({ totalReps: 0, completionRate: 0, personalBests: 0 });
  const [todayReps, setTodayReps] = useState<Record<Exercise, number>>({ pushups: 0, pullups: 0, squats: 0 });

  useEffect(() => {
    async function load() {
      const s = await getStreak();
      setStreak(s);
      const records = await getAllDayRecords();
      setDayRecords(records);

      const today = getToday();
      const plans = await getDailyPlans(today);
      const reps: Record<Exercise, number> = { pushups: 0, pullups: 0, squats: 0 };
      plans.forEach(p => { reps[p.exercise] = p.completedReps; });
      setTodayReps(reps);

      const weekDates = getWeekDates();
      let totalReps = 0;
      let daysWithGoals = 0;
      let daysComplete = 0;
      for (const date of weekDates) {
        const logs = await getSetLogs(date);
        totalReps += logs.reduce((s, l) => s + l.reps, 0);
        const dayPlans = await getDailyPlans(date);
        if (dayPlans.length > 0) {
          daysWithGoals++;
          if (dayPlans.every(p => p.completedReps >= p.targetReps)) daysComplete++;
        }
      }
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

  return (
    <div className="px-5 py-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Progress</h1>

      {/* Streak Card */}
      <div className="p-6 rounded-2xl bg-bg-card border-2 border-border mb-6 text-center">
        <Flame size={32} className="text-orange-accent mx-auto mb-2" />
        <div className="text-4xl font-bold mb-1">{streak.current}</div>
        <div className="text-text-secondary text-sm">Day Streak</div>
        <div className="text-text-muted text-xs mt-1">Best: {streak.longest} days</div>
      </div>

      {/* Week Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-4 rounded-xl bg-bg-card text-center">
          <Target size={18} className="text-green-accent mx-auto mb-1" />
          <div className="text-lg font-bold">{weekStats.completionRate}%</div>
          <div className="text-text-muted text-[10px]">Completion</div>
        </div>
        <div className="p-4 rounded-xl bg-bg-card text-center">
          <Flame size={18} className="text-orange-accent mx-auto mb-1" />
          <div className="text-lg font-bold">{streak.current}</div>
          <div className="text-text-muted text-[10px]">Day Streak</div>
        </div>
        <div className="p-4 rounded-xl bg-bg-card text-center">
          <TrendingUp size={18} className="text-purple-light mx-auto mb-1" />
          <div className="text-lg font-bold">{weekStats.totalReps}</div>
          <div className="text-text-muted text-[10px]">Total Reps</div>
        </div>
      </div>

      {/* Today's Breakdown */}
      <h2 className="text-lg font-semibold mb-3">Today's Breakdown</h2>
      <div className="flex flex-col gap-2 mb-6">
        {(Object.keys(todayReps) as Exercise[]).map(ex => (
          <div key={ex} className="flex items-center gap-3 p-3 rounded-xl bg-bg-card">
            <span className="text-sm font-medium w-20">{EXERCISE_LABELS[ex]}</span>
            <div className="flex-1 h-2 bg-bg-primary rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (todayReps[ex] / 100) * 100)}%`,
                  backgroundColor: ex === 'pushups' ? '#F97316' : ex === 'pullups' ? '#22C55E' : '#A78BFA',
                }}
              />
            </div>
            <span className="text-xs text-text-muted w-16 text-right">{todayReps[ex]} / 100</span>
          </div>
        ))}
      </div>

      {/* Calendar Heatmap */}
      <h2 className="text-lg font-semibold mb-3">{currentMonth} {currentYear}</h2>
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
        <p className="text-center text-text-muted text-xs mt-4">
          Don't break the chain! You've got this! 💪
        </p>
      </div>
    </div>
  );
}
