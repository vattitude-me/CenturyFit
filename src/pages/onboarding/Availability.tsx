import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveProfile } from '../../db';
import { CheckIcon, ChevronRightIcon } from '../../components/icons';
import type { TimeWindow, Exercise, UserProfile } from '../../types';

const TIME_WINDOWS: { id: TimeWindow; label: string; time: string }[] = [
  { id: 'morning', label: 'Morning', time: '6:00 AM - 9:00 AM' },
  { id: 'midday', label: 'Midday', time: '12:00 PM - 2:00 PM' },
  { id: 'evening', label: 'Evening', time: '5:00 PM - 8:00 PM' },
  { id: 'night', label: 'Night', time: '9:00 PM - 11:00 PM' },
];

const INJURY_OPTIONS = [
  { key: 'shoulder' as const, label: 'Shoulder' },
  { key: 'knee' as const, label: 'Knee' },
  { key: 'wrist' as const, label: 'Wrist' },
  { key: 'back' as const, label: 'Back' },
];

export default function Availability() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Set<TimeWindow>>(new Set(['morning', 'evening']));
  const [showEquipment, setShowEquipment] = useState(false);
  const [pullupBar, setPullupBar] = useState(false);
  const [resistanceBand, setResistanceBand] = useState(false);
  const [injuries, setInjuries] = useState({ shoulder: false, knee: false, wrist: false, back: false });

  function toggle(id: TimeWindow) {
    const next = new Set(selected);
    if (next.has(id)) {
      if (next.size > 1) next.delete(id);
    } else {
      next.add(id);
    }
    setSelected(next);
  }

  async function handleNext() {
    const goals: Exercise[] = JSON.parse(sessionStorage.getItem('onboarding_goals') || '["pushups","pullups","squats"]');

    const profile: UserProfile = {
      id: 'user_1',
      name: '',
      createdAt: Date.now(),
      goals,
      timeWindows: [...selected],
      wakeTime: '07:00',
      sleepTime: '22:00',
      equipment: { pullupBar, resistanceBand },
      injuries,
      onboardingComplete: true,
      baselineComplete: false,
    };

    await saveProfile(profile);
    sessionStorage.removeItem('onboarding_goals');
    navigate('/onboarding/baseline-intro');
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

      <div className="flex flex-col gap-3">
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
              {active && <CheckIcon size={22} />}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <button
          onClick={() => setShowEquipment(v => !v)}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-bg-card"
        >
          <span className="text-sm font-medium text-text-secondary">Equipment &amp; Health (optional)</span>
          <span className={`transition-transform ${showEquipment ? 'rotate-90' : ''}`}>
            <ChevronRightIcon size={18} />
          </span>
        </button>

        {showEquipment && (
          <div className="mt-4 flex flex-col gap-6 animate-fade-in">
            <div>
              <h2 className="text-sm text-text-muted mb-3 uppercase tracking-wider">Available Equipment</h2>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-4 p-4 rounded-2xl bg-bg-card border-2 border-border cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pullupBar}
                    onChange={e => setPullupBar(e.target.checked)}
                    className="w-5 h-5 rounded accent-purple-accent"
                  />
                  <span>Pull-up Bar</span>
                </label>
                <label className="flex items-center gap-4 p-4 rounded-2xl bg-bg-card border-2 border-border cursor-pointer">
                  <input
                    type="checkbox"
                    checked={resistanceBand}
                    onChange={e => setResistanceBand(e.target.checked)}
                    className="w-5 h-5 rounded accent-purple-accent"
                  />
                  <span>Resistance Band</span>
                </label>
              </div>
            </div>

            <div>
              <h2 className="text-sm text-text-muted mb-3 uppercase tracking-wider">Any injuries or limitations?</h2>
              <div className="flex flex-wrap gap-3">
                {INJURY_OPTIONS.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setInjuries(prev => ({ ...prev, [key]: !prev[key] }))}
                    className={`px-4 py-2 rounded-full border-2 transition-all ${
                      injuries[key]
                        ? 'border-red-accent bg-red-accent/10 text-red-accent'
                        : 'border-border bg-bg-card text-text-secondary'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1" />

      <button
        onClick={handleNext}
        className="w-full py-4 bg-purple-accent hover:bg-purple-dark text-white font-semibold rounded-2xl transition-colors text-lg mt-8"
      >
        Next
      </button>
    </div>
  );
}
