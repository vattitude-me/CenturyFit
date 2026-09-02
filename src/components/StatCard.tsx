import type { ReactNode } from 'react';

interface StatCardProps {
  kicker: string;
  kickerAccent?: boolean;
  value: ReactNode;
  caption: string;
}

export default function StatCard({ kicker, kickerAccent = true, value, caption }: StatCardProps) {
  return (
    <div className="flex-1 p-[15px] rounded-[15px] bg-surface shadow-sm flex flex-col gap-0.5">
      <span className={['text-[10px] tracking-[0.12em]', kickerAccent ? 'text-accent' : 'text-neutral-500'].join(' ')}>
        {kicker}
      </span>
      <span className="text-[34px] font-medium leading-[1.1] tabular-nums">{value}</span>
      <span className="text-[11.5px] text-neutral-500">{caption}</span>
    </div>
  );
}
