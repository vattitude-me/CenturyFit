import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveProfile } from '../../db';
import type { UserProfile, Exercise, TimeWindow } from '../../types';

export default function Equipment() {
  const navigate = useNavigate();
  const [pullupBar, setPullupBar] = useState(false);
  const [resistanceBand, setResistanceBand] = useState(false);
  const [injuries, setInjuries] = useState({ shoulder: false, knee: false, wrist: false, back: false });

  async function handleNext() {
    const goals: Exercise[] = JSON.parse(sessionStorage.getItem('onboarding_goals') || '["pushups","pullups","squats"]');
    const timeWindows: TimeWindow[] = JSON.parse(sessionStorage.getItem('onboarding_windows') || '["morning","evening"]');

    const profile: UserProfile = {
      id: 'user_1',
      name: '',
      createdAt: Date.now(),
      goals,
      timeWindows,
      wakeTime: '07:00',
      sleepTime: '22:00',
      equipment: { pullupBar, resistanceBand },
      injuries,
      onboardingComplete: true,
      baselineComplete: false,
    };

    await saveProfile(profile);
    sessionStorage.removeItem('onboarding_goals');
    sessionStorage.removeItem('onboarding_windows');
    navigate('/onboarding/baseline-intro');
  }

  const injuryOptions = [
    { key: 'shoulder' as const, label: 'Shoulder' },
    { key: 'knee' as const, label: 'Knee' },
    { key: 'wrist' as const, label: 'Wrist' },
    { key: 'back' as const, label: 'Back' },
  ];

  return (
    <div className="flex flex-col min-h-full px-6 py-8 bg-bg-primary">
      <div className="flex items-center gap-2 mb-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i <= 3 ? 'bg-purple-accent' : 'bg-border'}`} />
        ))}
      </div>

      <h1 className="text-2xl font-bold mt-6 mb-2">Equipment & Health</h1>
      <p className="text-text-secondary text-sm mb-8">This helps us personalize your plan.</p>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Available Equipment</h2>
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

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Any injuries or limitations?</h2>
        <div className="flex flex-wrap gap-3">
          {injuryOptions.map(({ key, label }) => (
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

      <div className="flex-1" />

      <button
        onClick={handleNext}
        className="w-full py-4 bg-purple-accent hover:bg-purple-dark text-white font-semibold rounded-2xl transition-colors text-lg"
      >
        Next
      </button>
    </div>
  );
}
