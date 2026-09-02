import { useEffect, useState } from 'react';
import { getProfile, getBaselines } from '../../db';
import { computeStartingVolume, EXERCISE_LABELS, VARIANT_LABELS } from '../../engine/progression';
import { PushupIcon, PullupIcon, SquatIcon, TrendingUpIcon } from '../../components/icons';
import type { IconProps } from '../../components/icons';
import type { UserProfile, Baseline, Exercise } from '../../types';

const EXERCISE_ICONS: Record<Exercise, (props: IconProps) => React.ReactNode> = {
  pushups: PushupIcon,
  pullups: PullupIcon,
  squats: SquatIcon,
};

export default function PlanSummary() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [baselines, setBaselines] = useState<Baseline[]>([]);

  useEffect(() => {
    Promise.all([getProfile(), getBaselines()]).then(([p, b]) => {
      if (p) setProfile(p);
      setBaselines(b);
    });
  }, []);

  if (!profile) return null;

  const exerciseColors: Record<Exercise, string> = {
    pushups: 'text-orange-accent',
    pullups: 'text-green-accent',
    squats: 'text-purple-light',
  };

  return (
    <div className="flex flex-col min-h-full px-6 py-8 bg-bg-primary">
      <h1 className="text-2xl font-bold mb-2">Your Personalized Plan</h1>
      <p className="text-text-secondary text-sm mb-8">Based on your baseline</p>

      <div className="flex flex-col gap-4 flex-1">
        {profile.goals.map(exercise => {
          const baseline = baselines.find(b => b.exercise === exercise);
          if (!baseline) return null;
          const { dailyTarget } = computeStartingVolume(baseline.maxReps);
          const ExIcon = EXERCISE_ICONS[exercise];
          return (
            <div
              key={exercise}
              className="p-5 rounded-2xl bg-bg-card border-2 border-border"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-bg-card-elevated flex items-center justify-center">
                    <ExIcon size={22} />
                  </div>
                  <h3 className={`font-bold text-lg ${exerciseColors[exercise]}`}>
                    {EXERCISE_LABELS[exercise]}
                  </h3>
                </div>
                <span className="text-text-secondary text-sm">Daily Goal</span>
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-text-muted text-sm">{baseline.maxReps} max reps</span>
                <span className="text-text-muted text-sm mx-2">→</span>
                <span className="text-2xl font-bold">{dailyTarget}</span>
              </div>
              <div className="text-text-muted text-sm">{VARIANT_LABELS[baseline.variant]}</div>
            </div>
          );
        })}

        <div className="flex items-start gap-3 p-4 rounded-2xl bg-purple-accent/10 border-2 border-purple-accent/30 mt-4">
          <TrendingUpIcon size={20} />
          <p className="text-sm text-text-secondary">
            Your plan will start easy and progress every week. Consistency is the key!
          </p>
        </div>
      </div>

      <button
        onClick={() => {
          window.location.hash = '#/today';
          window.location.reload();
        }}
        className="w-full py-4 bg-purple-accent hover:bg-purple-dark text-white font-semibold rounded-2xl transition-colors text-lg mt-8"
      >
        Start My Plan
      </button>
    </div>
  );
}
