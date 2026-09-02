import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Button from '../../components/Button';
import IconChip from '../../components/IconChip';
import { getBaselineLogs, saveBaselineLog } from '../../db';
import type { Exercise } from '../../types';

const TESTS: { key: Exercise; name: string; sub: string; icon: string }[] = [
  { key: 'push', name: 'Max push-ups', sub: 'One clean set to failure', icon: '⌃' },
  { key: 'pull', name: 'Max pull-ups', sub: 'Zero is a fine answer', icon: '⌄' },
  { key: 'squat', name: 'Max squats', sub: 'Full depth, no bouncing', icon: '◍' },
];

export default function Baseline() {
  const navigate = useNavigate();
  const [tested, setTested] = useState<Record<Exercise, number | null>>({ push: null, pull: null, squat: null });

  useEffect(() => {
    getBaselineLogs().then((logs) => {
      const latest: Record<Exercise, number | null> = { push: null, pull: null, squat: null };
      for (const log of logs) latest[log.exercise] = log.maxReps;
      setTested(latest);
    });
  }, []);

  const allTested = TESTS.every((t) => tested[t.key] !== null);

  const handleSkip = async () => {
    const defaults: Record<Exercise, number> = { push: 5, pull: 0, squat: 15 };
    for (const ex of Object.keys(defaults) as Exercise[]) {
      await saveBaselineLog({ id: `${ex}-skip`, exercise: ex, maxReps: defaults[ex], testedAt: Date.now() });
    }
    navigate('/onboarding/bar');
  };

  return (
    <div className="route-forward h-full overflow-y-auto flex flex-col px-5.5 pt-4 pb-6 gap-4">
      <div className="flex items-center gap-3">
        <Button variant="icon" onClick={() => navigate('/onboarding/welcome')}><ChevronLeft size={18} /></Button>
        <div className="flex-1 h-[3px] rounded-full bg-text/12 overflow-hidden">
          <i className="block h-full bg-accent" style={{ width: '33%' }} />
        </div>
        <span className="text-[11px] text-neutral-500 flex-none">1 of 3</span>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="text-[27px] font-medium tracking-[-0.02em]">Let's find your floor</div>
        <div className="text-[13.5px] leading-[1.5] text-neutral-400">
          One honest max set each. Three push-ups is a completely fine answer. The plan is built from wherever you actually are.
        </div>
      </div>

      <div className="flex flex-col gap-2.25">
        {TESTS.map((t) => {
          const val = tested[t.key];
          return (
            <div
              key={t.key}
              onClick={() => navigate(`/session?exercise=${t.key}&mode=baseline`)}
              className="flex items-center gap-3.5 p-3.5 rounded-[14px] bg-surface shadow-sm cursor-pointer"
            >
              <IconChip exercise={t.key}>{t.icon}</IconChip>
              <span className="flex-1 flex flex-col gap-px">
                <span className="text-[15px] font-medium">{t.name}</span>
                <span className="text-[11.5px] text-neutral-500">{t.sub}</span>
              </span>
              <span
                className="text-xs tabular-nums"
                style={{ color: val !== null ? '#d2cefd' : '#75798c' }}
              >
                {val !== null ? `${val} reps` : 'Test →'}
              </span>
            </div>
          );
        })}
      </div>

      <div className="p-3.5 rounded-xl bg-accent-900 flex gap-2.5 items-start">
        <span className="text-sm leading-tight">◎</span>
        <span className="text-xs leading-[1.5] text-accent-200">
          Can't do a pull-up yet? Say zero. You'll start on rows and negatives and we'll ladder you up to the bar.
        </span>
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <Button
          variant="primary" block className="h-12 text-[15px]"
          disabled={!allTested}
          onClick={() => navigate('/onboarding/bar')}
        >
          {allTested ? 'Build my plan' : 'Next: equipment'}
        </Button>
        <Button variant="ghost" block onClick={handleSkip}>I'll type my numbers instead</Button>
      </div>
    </div>
  );
}
