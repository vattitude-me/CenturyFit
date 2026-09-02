import { useNavigate } from 'react-router-dom';
import { EXERCISE_LABELS } from '../../engine/progression';
import { getProfile } from '../../db';
import { useEffect, useState } from 'react';
import { PushupIcon, PullupIcon, SquatIcon } from '../../components/icons';
import type { IconProps } from '../../components/icons';
import type { Exercise } from '../../types';

const EXERCISE_ICONS: Record<Exercise, (props: IconProps) => React.ReactNode> = {
  pushups: PushupIcon,
  pullups: PullupIcon,
  squats: SquatIcon,
};

export default function BaselineIntro() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Exercise[]>([]);

  useEffect(() => {
    getProfile().then(p => {
      if (p) setGoals(p.goals);
    });
  }, []);

  return (
    <div className="flex flex-col min-h-full px-6 py-8 bg-bg-primary">
      <div className="flex items-center gap-2 mb-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i <= 4 ? 'bg-purple-accent' : 'bg-border'}`} />
        ))}
      </div>

      <h1 className="text-2xl font-bold mt-6 mb-2">Let's find your baseline</h1>
      <p className="text-text-secondary text-sm mb-8">
        We'll test your max reps for each exercise to create your personalized plan.
      </p>

      <div className="flex flex-col gap-4 flex-1">
        {goals.map(exercise => {
          const ExIcon = EXERCISE_ICONS[exercise];
          return (
            <div
              key={exercise}
              className="flex items-center gap-4 p-5 rounded-2xl bg-bg-card border-2 border-border"
            >
              <div className="w-12 h-12 rounded-xl bg-bg-card-elevated flex items-center justify-center">
                <ExIcon size={28} />
              </div>
              <div>
                <div className="font-semibold">{EXERCISE_LABELS[exercise]} Test</div>
                <div className="text-text-secondary text-sm">Max in 1 set</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 mt-8">
        <button
          onClick={() => navigate('/onboarding/baseline-test')}
          className="w-full py-4 bg-purple-accent hover:bg-purple-dark text-white font-semibold rounded-2xl transition-colors text-lg"
        >
          Start Tests
        </button>
        <button
          onClick={() => navigate('/onboarding/baseline-test?skip=true')}
          className="w-full py-3 text-text-secondary hover:text-text-primary transition-colors text-sm"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
