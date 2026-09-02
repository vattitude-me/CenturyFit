import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import type { Exercise } from '../../types';

function PushupIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="2" y1="18" x2="8" y2="18" /><line x1="16" y1="18" x2="22" y2="18" />
      <line x1="8" y1="18" x2="10" y2="14" /><line x1="16" y1="18" x2="14" y2="14" />
      <line x1="10" y1="14" x2="14" y2="14" />
      <circle cx="16" cy="12" r="2" />
    </svg>
  );
}

function PullupIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="2" y1="4" x2="22" y2="4" />
      <line x1="8" y1="4" x2="8" y2="8" /><line x1="16" y1="4" x2="16" y2="8" />
      <circle cx="12" cy="10" r="2" />
      <line x1="12" y1="12" x2="12" y2="18" />
      <line x1="12" y1="18" x2="9" y2="22" /><line x1="12" y1="18" x2="15" y2="22" />
    </svg>
  );
}

function SquatIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="4" r="2" />
      <path d="M12 6 L12 12 L8 18 L6 18" />
      <path d="M12 12 L16 18 L18 18" />
      <path d="M12 10 L8 8" /><path d="M12 10 L16 8" />
    </svg>
  );
}

const EXERCISES: { id: Exercise; label: string; desc: string; color: string; icon: () => React.ReactNode }[] = [
  { id: 'pushups', label: 'Pushups', desc: '100 every day', color: 'bg-orange-accent', icon: PushupIcon },
  { id: 'pullups', label: 'Pullups', desc: '100 every day', color: 'bg-green-accent', icon: PullupIcon },
  { id: 'squats', label: 'Squats', desc: '100 every day', color: 'bg-purple-accent', icon: SquatIcon },
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
        {EXERCISES.map(({ id, label, desc, color, icon: ExIcon }) => {
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
              <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white`}>
                <ExIcon />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-lg">{label}</div>
                <div className="text-text-secondary text-sm">{desc}</div>
              </div>
              {active && (
                <div className="w-6 h-6 rounded-full bg-purple-accent flex items-center justify-center">
                  <Check size={14} className="text-white" />
                </div>
              )}
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
