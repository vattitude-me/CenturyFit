import { useEffect, useState } from 'react';
import Tag from '../components/Tag';
import Button from '../components/Button';
import { getSettings, saveSettings } from '../db';
import type { AppSettings } from '../types';

const FEED = [
  { initial: 'M', name: 'Mike', line: 'Cleared all three hundreds', ago: '2m', chip: '#423a6a' },
  { initial: 'S', name: 'Sara', line: 'New best: 9 pull-ups', ago: '15m', chip: '#3f424d' },
  { initial: 'J', name: 'Jon', line: 'Day 40 streak', ago: '1h', chip: '#2b2741' },
];

export default function Squad() {
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useEffect(() => { getSettings().then(setSettings); }, []);

  const toggleWaitlist = async () => {
    if (!settings) return;
    const next = { ...settings, waitlistSquad: !settings.waitlistSquad };
    setSettings(next);
    await saveSettings(next);
  };

  if (!settings) return null;

  return (
    <div className="flex-1 h-full overflow-y-auto flex flex-col px-5 pt-4 pb-24 gap-3.75">
      <div className="flex flex-col gap-1.25">
        <div className="text-[22px] font-medium tracking-[-0.02em]">Squad</div>
        <div className="text-[13px] leading-[1.5] text-neutral-400">
          Ships after sync. Here's the shape of it: a quiet side tab, not the main event.
        </div>
      </div>

      <div
        className="p-[15px] rounded-[15px] shadow-sm flex flex-col gap-3"
        style={{ background: 'linear-gradient(150deg, #20233a, #181a28)' }}
      >
        <Tag variant="outline" className="self-start">Preview</Tag>
        {FEED.map((f) => (
          <div key={f.name} className="flex items-center gap-2.75 opacity-55">
            <span
              style={{ background: f.chip }}
              className="w-8.5 h-8.5 flex-none rounded-full grid place-items-center text-[13px] font-medium"
            >
              {f.initial}
            </span>
            <span className="flex-1 flex flex-col gap-px">
              <span className="text-[13px] font-medium">{f.name}</span>
              <span className="text-[11.5px] text-neutral-500">{f.line}</span>
            </span>
            <span className="text-[10.5px] text-neutral-600 flex-none">{f.ago}</span>
          </div>
        ))}
        <div className="text-[11.5px] leading-[1.5] text-neutral-500 border-t border-text/10 pt-2.75">
          Nudges are one tap and capped: a friend can poke you twice a day, never more.
        </div>
      </div>

      <Button variant="primary" block className="h-11.5" onClick={toggleWaitlist}>
        {settings.waitlistSquad ? "You're on the list ✓" : 'Tell me when Squad lands'}
      </Button>
    </div>
  );
}
