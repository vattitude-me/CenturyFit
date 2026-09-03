import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Button from '../../components/Button';
import Toggle from '../../components/Toggle';

interface ProposedWindow {
  time: string;
  body: string;
  len: string;
}

const INITIAL_PROPOSAL: ProposedWindow[] = [
  { time: '07:10', body: '12 push-ups · ladder 1–4', len: 'about 4 min' },
  { time: '09:40', body: '20 squats', len: 'about 3 min' },
  { time: '12:30', body: '6 band-assisted pull-ups', len: 'about 5 min' },
  { time: '17:45', body: '14 push-ups + 22 squats', len: 'about 6 min' },
];

export default function Schedule() {
  const navigate = useNavigate();
  const [reflow, setReflow] = useState(true);
  const [proposal, setProposal] = useState(INITIAL_PROPOSAL);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draftTime, setDraftTime] = useState('');

  const openEditor = (i: number) => {
    setEditingIndex(i);
    setDraftTime(proposal[i].time);
  };

  const saveTime = () => {
    if (editingIndex === null || !draftTime) { setEditingIndex(null); return; }
    const next = [...proposal];
    next[editingIndex] = { ...next[editingIndex], time: draftTime };
    next.sort((a, b) => a.time.localeCompare(b.time));
    setProposal(next);
    setEditingIndex(null);
  };

  const handleBuildPlan = () => {
    navigate('/onboarding/plan', {
      state: { windows: proposal.map((w) => w.time), reflow },
    });
  };

  return (
    <div className="route-forward h-full overflow-y-auto flex flex-col px-5.5 pt-4 pb-6 gap-3.75">
      <div className="flex items-center gap-3">
        <Button variant="icon" onClick={() => navigate('/onboarding/bar')}><ChevronLeft size={18} /></Button>
        <div className="flex-1 h-[3px] rounded-full bg-text/12 overflow-hidden">
          <i className="block h-full bg-accent" style={{ width: '100%' }} />
        </div>
        <span className="text-[11px] text-neutral-500 flex-none">3 of 3</span>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="text-[27px] font-medium tracking-[-0.02em]">Here's the day we'd build</div>
        <div className="text-[13.5px] leading-[1.5] text-neutral-400">
          Four short windows, none longer than six minutes. Tap a time to change it and the coach reflows the rest.
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {proposal.map((w, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div
              onClick={() => openEditor(i)}
              className="flex items-center gap-3 px-3.25 py-3 rounded-[13px] bg-surface shadow-sm cursor-pointer"
            >
              <span className="text-[13px] tabular-nums font-medium w-13 flex-none text-accent-300">{w.time}</span>
              <span className="flex-1 flex flex-col gap-0.5">
                <span className="text-[13px]">{w.body}</span>
                <span className="text-[11px] text-neutral-500">{w.len}</span>
              </span>
              <span className="w-5.5 h-5.5 flex-none grid place-items-center text-neutral-600 text-[13px]">⠿</span>
            </div>
            {editingIndex === i && (
              <div className="flex items-center gap-2.5 px-3.25 py-3 rounded-[13px] bg-accent-900">
                <span className="text-[12px] text-accent-200 flex-1">Set time for this window</span>
                <input
                  type="time"
                  value={draftTime}
                  onChange={(e) => setDraftTime(e.target.value)}
                  className="h-9 px-2.5 rounded-lg bg-surface border border-neutral-800 text-sm text-text outline-none focus-visible:border-accent"
                />
                <Button variant="secondary" className="h-9 px-3 text-xs flex-none" onClick={() => setEditingIndex(null)}>Cancel</Button>
                <Button variant="primary" className="h-9 px-3 text-xs flex-none" onClick={saveTime}>Save</Button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 p-3.25 rounded-[13px] bg-surface shadow-sm">
        <span className="flex-1 flex flex-col gap-0.5">
          <span className="text-[13.5px] font-medium">Let the coach re-shuffle</span>
          <span className="text-[11.5px] text-neutral-500">Miss a window and the reps move, not vanish.</span>
        </span>
        <Toggle on={reflow} onToggle={() => setReflow((r) => !r)} />
      </div>

      <div className="mt-auto">
        <Button variant="primary" block className="h-12 text-[15px]" onClick={handleBuildPlan}>
          Build my plan
        </Button>
      </div>
    </div>
  );
}
