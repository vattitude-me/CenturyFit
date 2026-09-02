import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getProfile, saveBaseline, saveProfile } from '../../db';
import { getTierFromMaxReps, EXERCISE_LABELS } from '../../engine/progression';
import type { Exercise, UserProfile, Baseline } from '../../types';

export default function BaselineTest() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const skip = searchParams.get('skip') === 'true';

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reps, setReps] = useState(0);
  const [testing, setTesting] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    getProfile().then(p => {
      if (p) setProfile(p);
    });
  }, []);

  const exercises = profile?.goals ?? [];
  const currentExercise = exercises[currentIndex];

  const handleSkip = useCallback(async () => {
    if (!profile) return;
    const defaults: Record<Exercise, number> = { pushups: 10, pullups: 3, squats: 15 };
    for (const exercise of exercises) {
      const maxReps = defaults[exercise];
      const { tier, variant } = getTierFromMaxReps(exercise, maxReps);
      const baseline: Baseline = { exercise, maxReps, tier, variant, testedAt: Date.now() };
      await saveBaseline(baseline);
    }
    await saveProfile({ ...profile, baselineComplete: true });
    navigate('/onboarding/plan-summary');
  }, [profile, exercises, navigate]);

  useEffect(() => {
    if (skip && profile) handleSkip();
  }, [skip, profile, handleSkip]);

  async function handleSaveAndNext() {
    if (!profile || !currentExercise) return;

    const maxReps = Math.max(1, reps);
    const { tier, variant } = getTierFromMaxReps(currentExercise, maxReps);
    const baseline: Baseline = { exercise: currentExercise, maxReps, tier, variant, testedAt: Date.now() };
    await saveBaseline(baseline);

    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setReps(0);
      setTesting(false);
      setFinished(false);
    } else {
      await saveProfile({ ...profile, baselineComplete: true });
      navigate('/onboarding/plan-summary');
    }
  }

  if (!profile || !currentExercise) {
    return <div className="flex items-center justify-center h-full bg-bg-primary">
      <div className="w-8 h-8 border-2 border-purple-accent border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  if (testing && !finished) {
    return (
      <div className="flex flex-col items-center justify-between min-h-full px-6 py-12 bg-bg-primary">
        <div className="text-text-secondary text-sm">
          {EXERCISE_LABELS[currentExercise]} Test
        </div>
        <div className="flex flex-col items-center gap-4">
          <p className="text-text-secondary text-sm">Do as many pushups as you can in 1 set.</p>
          <div className="text-8xl font-bold text-purple-accent tabular-nums">{reps}</div>
          <p className="text-2xl text-text-secondary">REPS</p>
          <p className="text-text-muted text-sm">Keep going!</p>
        </div>
        <div className="w-full max-w-sm flex flex-col gap-3">
          <button
            onClick={() => setReps(prev => prev + 1)}
            className="w-full py-6 bg-bg-card border-2 border-border rounded-2xl text-4xl font-bold active:bg-purple-accent/20 transition-colors"
          >
            +1 Rep
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => setReps(prev => Math.max(0, prev - 1))}
              className="flex-1 py-3 bg-bg-card border-2 border-border rounded-xl text-text-secondary"
            >
              -1
            </button>
            <button
              onClick={() => setFinished(true)}
              className="flex-1 py-3 bg-orange-accent text-white font-semibold rounded-xl"
            >
              End Set
            </button>
          </div>
          <div className="flex items-center gap-2 text-text-muted text-xs justify-center mt-2">
            <span>💡</span>
            <span>Full range of motion. Quality over speed.</span>
          </div>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full px-6 py-12 bg-bg-primary gap-6">
        <div className="text-6xl">🎉</div>
        <h2 className="text-2xl font-bold">{reps} {EXERCISE_LABELS[currentExercise]}!</h2>
        <p className="text-text-secondary">Great effort! We'll build your plan from here.</p>
        <button
          onClick={handleSaveAndNext}
          className="w-full max-w-sm py-4 bg-purple-accent hover:bg-purple-dark text-white font-semibold rounded-2xl transition-colors text-lg"
        >
          {currentIndex < exercises.length - 1 ? 'Next Exercise' : 'See My Plan'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-full px-6 py-12 bg-bg-primary">
      <div className="text-text-secondary text-sm">
        Test {currentIndex + 1} of {exercises.length}
      </div>
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold">{EXERCISE_LABELS[currentExercise]} Test</h1>
        <p className="text-text-secondary text-center max-w-xs">
          Do as many {EXERCISE_LABELS[currentExercise].toLowerCase()} as you can in 1 set.
          Tap the button for each rep.
        </p>
      </div>
      <button
        onClick={() => setTesting(true)}
        className="w-full max-w-sm py-4 bg-purple-accent hover:bg-purple-dark text-white font-semibold rounded-2xl transition-colors text-lg animate-pulse-glow"
      >
        Start Test
      </button>
    </div>
  );
}
