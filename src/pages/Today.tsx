import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, getBaselines, getDailyPlans, getStreak } from '../db';
import { generatePlansForDate } from '../engine/planGenerator';
import { EXERCISE_LABELS } from '../engine/progression';
import ProgressRing from '../components/ProgressRing';
import type { DailyPlan, Exercise, StreakData } from '../types';
import { Play, Clock } from 'lucide-react';

const EXERCISE_COLORS: Record<Exercise, string> = {
  pushups: '#F97316',
  pullups: '#22C55E',
  squats: '#A78BFA',
};

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

export default function Today() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<DailyPlan[]>([]);
  const [streak, setStreak] = useState<StreakData>({ current: 0, longest: 0, freezesRemaining: 3, lastActiveDate: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const p = await getProfile();
      if (!p) return;

      const baselines = await getBaselines();
      const today = getToday();
      const existing = await getDailyPlans(today);

      let dailyPlans: DailyPlan[];
      if (existing.length > 0) {
        dailyPlans = existing;
      } else {
        dailyPlans = await generatePlansForDate(today, p, baselines);
      }

      setPlans(dailyPlans);
      setStreak(await getStreak());
      setLoading(false);
    }
    load();
  }, []);

  function getTotalProgress(): number {
    if (plans.length === 0) return 0;
    const completed = plans.reduce((s, p) => s + p.completedReps, 0);
    const target = plans.reduce((s, p) => s + p.targetReps, 0);
    return target > 0 ? completed / target : 0;
  }

  function getNextBlock(): { plan: DailyPlan; blockIndex: number } | null {
    for (const plan of plans) {
      const idx = plan.blocks.findIndex(b => b.status === 'pending' || b.status === 'active');
      if (idx !== -1) return { plan, blockIndex: idx };
    }
    return null;
  }

  function handleStartBlock(plan: DailyPlan, blockId: string) {
    navigate(`/counter/${plan.exercise}/${blockId}`);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-purple-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const nextBlock = getNextBlock();
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="px-5 py-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-bold">{greeting}! 💪</h1>
        <p className="text-text-secondary text-sm">Let's get stronger today.</p>
      </div>

      {/* Progress Rings */}
      <div className="flex items-center justify-center gap-6 mb-6">
        {plans.map(plan => {
          const progress = plan.targetReps > 0 ? plan.completedReps / plan.targetReps : 0;
          return (
            <div key={plan.exercise} className="flex flex-col items-center gap-2">
              <ProgressRing
                size={80}
                strokeWidth={6}
                progress={progress}
                color={EXERCISE_COLORS[plan.exercise]}
              >
                <div className="text-center">
                  <div className="text-sm font-bold">{Math.round(progress * 100)}</div>
                </div>
              </ProgressRing>
              <span className="text-xs text-text-secondary">
                {plan.completedReps} / {plan.targetReps}
              </span>
              <span className="text-xs text-text-muted">{EXERCISE_LABELS[plan.exercise]}</span>
            </div>
          );
        })}
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-text-secondary mb-2">
          <span>Today's Progress</span>
          <span>{Math.round(getTotalProgress() * 100)}%</span>
        </div>
        <div className="h-2 bg-bg-card rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-accent rounded-full transition-all duration-500"
            style={{ width: `${Math.round(getTotalProgress() * 100)}%` }}
          />
        </div>
      </div>

      {/* Streak */}
      {streak.current > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-bg-card mb-6">
          <span className="text-2xl">🔥</span>
          <div>
            <span className="font-semibold">{streak.current} day streak</span>
            <span className="text-text-muted text-xs ml-2">Best: {streak.longest}</span>
          </div>
        </div>
      )}

      {/* Quick Start */}
      {nextBlock && (
        <button
          onClick={() => handleStartBlock(nextBlock.plan, nextBlock.plan.blocks[nextBlock.blockIndex].id)}
          className="w-full flex items-center gap-4 p-4 rounded-2xl bg-purple-accent/20 border-2 border-purple-accent mb-6 transition-all hover:bg-purple-accent/30"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-accent flex items-center justify-center">
            <Play size={24} className="text-white ml-0.5" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-semibold">Start Next Block</div>
            <div className="text-text-secondary text-sm">
              {EXERCISE_LABELS[nextBlock.plan.exercise]} — {nextBlock.plan.blocks[nextBlock.blockIndex].targetReps} reps
            </div>
          </div>
        </button>
      )}

      {/* Timeline */}
      <h2 className="text-lg font-semibold mb-4">Today's Plan</h2>
      <div className="flex flex-col gap-3">
        {plans.map(plan =>
          plan.blocks.map((block) => {
            const isDone = block.status === 'completed';
            const isActive = block.status === 'active' || block.status === 'pending';
            return (
              <div
                key={block.id}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                  isDone ? 'bg-bg-card/50 opacity-60' : 'bg-bg-card'
                }`}
              >
                <div className="flex flex-col items-center w-12">
                  <Clock size={14} className="text-text-muted mb-1" />
                  <span className="text-xs text-text-muted">{formatTime(block.time)}</span>
                </div>
                <div className="flex-1">
                  <div className={`font-medium text-sm ${isDone ? 'line-through text-text-muted' : ''}`}>
                    {EXERCISE_LABELS[plan.exercise]}
                  </div>
                  <div className="text-text-muted text-xs">
                    {isDone ? `${block.completedReps} reps done` : `${block.targetReps} reps`}
                  </div>
                </div>
                {isActive && !isDone && (
                  <button
                    onClick={() => handleStartBlock(plan, block.id)}
                    className="px-4 py-2 bg-green-accent text-white text-sm font-semibold rounded-xl"
                  >
                    Start
                  </button>
                )}
                {isDone && (
                  <div className="w-6 h-6 rounded-full bg-green-accent/20 flex items-center justify-center">
                    <span className="text-green-accent text-xs">✓</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Daily Goals Footer */}
      <div className="mt-6 p-3 rounded-xl bg-bg-card">
        <div className="text-xs text-text-muted text-center">
          Daily Goals: {plans.map(p => `${EXERCISE_LABELS[p.exercise]} ${p.targetReps}`).join(' | ')}
        </div>
      </div>
    </div>
  );
}
