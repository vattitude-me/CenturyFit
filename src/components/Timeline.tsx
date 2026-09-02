import type { ReactNode } from 'react';

export type TimelineDotState = 'done' | 'now' | 'later';

interface TimelineRowProps {
  time: string;
  state: TimelineDotState;
  children: ReactNode;
}

const DOT_BG: Record<TimelineDotState, string> = {
  done: '#9184d9',
  now: '#e9e9ed',
  later: 'rgba(233,233,237,.20)',
};

export function TimelineRow({ time, state, children }: TimelineRowProps) {
  return (
    <div className="flex items-stretch gap-3">
      <div className="w-[42px] flex-none text-right text-[11px] tabular-nums text-neutral-500 pt-3.5">
        {time}
      </div>
      <div className="w-3.5 flex-none flex flex-col items-center">
        <span className="w-0.5 flex-1 block bg-text/10" />
        <span
          style={{
            background: DOT_BG[state],
            boxShadow: state === 'now' ? '0 0 0 5px rgba(145,132,217,.22)' : 'none',
          }}
          className="w-[11px] h-[11px] rounded-full flex-none block"
        />
        <span className="w-0.5 flex-1 block bg-text/10" />
      </div>
      <div
        style={{ opacity: state === 'later' ? 0.6 : 1 }}
        className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 my-1 rounded-xl bg-surface"
      >
        {children}
      </div>
    </div>
  );
}
