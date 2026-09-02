import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import type { TimeWindow } from '../../types';

const TIME_WINDOWS: { id: TimeWindow; label: string; time: string }[] = [
  { id: 'morning', label: 'Morning', time: '6:00 AM - 9:00 AM' },
  { id: 'midday', label: 'Midday', time: '12:00 PM - 2:00 PM' },
  { id: 'evening', label: 'Evening', time: '5:00 PM - 8:00 PM' },
  { id: 'night', label: 'Night', time: '9:00 PM - 11:00 PM' },
];

export default function Availability() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Set<TimeWindow>>(new Set(['morning', 'evening']));

  function toggle(id: TimeWindow) {
    const next = new Set(selected);
    if (next.has(id)) {
      if (next.size > 1) next.delete(id);
    } else {
      next.add(id);
    }
    setSelected(next);
  }

  function handleNext() {
    sessionStorage.setItem('onboarding_windows', JSON.stringify([...selected]));
    navigate('/onboarding/equipment');
  }

  return (
    <div className="flex flex-col min-h-full px-6 py-8 bg-bg-primary">
      <div className="flex items-center gap-2 mb-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i <= 2 ? 'bg-purple-accent' : 'bg-border'}`} />
        ))}
      </div>
      <h1 className="text-2xl font-bold mt-6 mb-2">When can you work out?</h1>
      <p className="text-text-secondary text-sm mb-8">Select your available time windows. You can add multiple.</p>

      <div className="flex flex-col gap-3 flex-1">
        {TIME_WINDOWS.map(({ id, label, time }) => {
          const active = selected.has(id);
          return (
            <button
              key={id}
              onClick={() => toggle(id)}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                active
                  ? 'border-purple-accent bg-purple-accent/10'
                  : 'border-border bg-bg-card hover:bg-bg-card-hover'
              }`}
            >
              <div className="flex-1 text-left">
                <div className="font-semibold">{label}</div>
                <div className="text-text-secondary text-sm">{time}</div>
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
