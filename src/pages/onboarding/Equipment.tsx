import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Button from '../../components/Button';
import Radio from '../../components/Radio';
import type { BarAccess } from '../../types';

const BAR_OPTIONS: { key: BarAccess; name: string; sub: string }[] = [
  { key: 'doorway', name: 'Doorway or wall bar', sub: 'Full pull-up path available' },
  { key: 'park', name: 'Park or gym bar', sub: 'Full path, plus dips later' },
  { key: 'none', name: 'No bar yet', sub: "Rows under a table, we'll adapt" },
];

const RUNGS = ['Rows', 'Negatives', 'Band', 'Partials', 'Full'];

export default function Equipment() {
  const navigate = useNavigate();
  const [bar, setBar] = useState<BarAccess>('doorway');

  return (
    <div className="route-forward h-full overflow-y-auto flex flex-col px-5.5 pt-4 pb-6 gap-4">
      <div className="flex items-center gap-3">
        <Button variant="icon" onClick={() => navigate('/onboarding/baseline')}><ChevronLeft size={18} /></Button>
        <div className="flex-1 h-[3px] rounded-full bg-text/12 overflow-hidden">
          <i className="block h-full bg-accent" style={{ width: '66%' }} />
        </div>
        <span className="text-[11px] text-neutral-500 flex-none">2 of 3</span>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="text-[27px] font-medium tracking-[-0.02em]">Do you have a bar?</div>
        <div className="text-[13.5px] leading-[1.5] text-neutral-400">
          This only changes the pull-up half. Everything else is floor and gravity.
        </div>
      </div>

      <div className="flex flex-col gap-2.25">
        {BAR_OPTIONS.map((opt) => (
          <Radio key={opt.key} selected={bar === opt.key} onSelect={() => setBar(opt.key)} title={opt.name} subtitle={opt.sub} />
        ))}
      </div>

      <div
        className="p-4 rounded-[14px] shadow-sm flex flex-col gap-2.75"
        style={{ background: 'linear-gradient(150deg, #1d2033, #161826)' }}
      >
        <div className="text-[10px] tracking-[0.12em] text-accent">YOUR PULL-UP PATH</div>
        <div className="flex items-center gap-1.5">
          {RUNGS.map((name, i) => (
            <span key={name} className="flex-1 flex flex-col gap-1.25">
              <span
                className="h-1 rounded-full block"
                style={{ background: i <= 2 ? '#9184d9' : 'rgba(233,233,237,.14)' }}
              />
              <span className="text-[9.5px] leading-[1.25]" style={{ color: i === 2 ? '#d2cefd' : '#75798c' }}>
                {name}
              </span>
            </span>
          ))}
        </div>
        <div className="text-xs leading-[1.5] text-neutral-400">
          You're on <strong className="text-text font-medium">band-assisted</strong>. Clear 8 clean reps in a set and the coach moves you up a rung.
        </div>
      </div>

      <div className="mt-auto">
        <Button variant="primary" block className="h-12 text-[15px]" onClick={() => navigate('/onboarding/schedule')}>
          Next: pick my windows
        </Button>
      </div>
    </div>
  );
}
