import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckIcon, PushupIcon, PullupIcon, SquatIcon } from '../../components/icons';
import type { IconProps } from '../../components/icons';
import type { Exercise } from '../../types';

const EXERCISES: { id: Exercise; label: string; desc: string; icon: (props: IconProps) => React.ReactNode }[] = [
  { id: 'pushups', label: 'Pushups', desc: '100 every day', icon: PushupIcon },
  { id: 'pullups', label: 'Pullups', desc: '100 every day', icon: PullupIcon },
  { id: 'squats', label: 'Squats', desc: '100 every day', icon: SquatIcon },
];

export default function GoalSelection() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Set<Exercise>>(new Set(['pushups', 'pullups', 'squats']));

  function toggle(id: Exercise) {
    const next = new Set(selected);
    if (next.has(id)) {
      if (next.size > 1) next.delete(id);
    } else {
      next.add(id);
    }
    setSelected(next);
  }

  function handleNext() {
    sessionStorage.setItem('onboarding_goals', JSON.stringify([...selected]));
    navigate('/onboarding/availability');
  }

  return (
    <div className="flex flex-col min-h-full px-6 py-8 bg-bg-primary">
      <div className="flex items-center gap-2 mb-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i <= 1 ? 'bg-purple-accent' : 'bg-border'}`} />
        ))}
      </div>
      <h1 className="text-2xl font-bold mt-6 mb-2">What's your goal?</h1>
      <p className="text-text-secondary text-sm mb-8">You can focus on one or all.</p>

      <div className="flex flex-col gap-4 flex-1">
        {EXERCISES.map(({ id, label, desc, icon: ExIcon }) => {
          const active = selected.has(id);
          return (
            <button
              key={id}
              onClick={() => toggle(id)}
              className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
                active
                  ? 'border-purple-accent bg-purple-accent/10'
                  : 'border-border bg-bg-card hover:bg-bg-card-hover'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-bg-card-elevated flex items-center justify-center">
                <ExIcon size={28} />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-lg">{label}</div>
                <div className="text-text-secondary text-sm">{desc}</div>
              </div>
              {active && <CheckIcon size={24} />}
            </button>
          );
        })}
      </div>

      <button
        onClick={handleNext}
        className="w-full py-4 bg-purple-accent hover:bg-purple-dark text-white font-semibold rounded-2xl transition-colors text-lg mt-8"
      >
        Next
      </button>
    </div>
  );
}
