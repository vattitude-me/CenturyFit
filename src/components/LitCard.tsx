import type { ReactNode } from 'react';

interface LitCardProps {
  children: ReactNode;
  className?: string;
}

/** Gradient + accent-bloom panel. Nocturne rule: max one lit surface per screen. */
export default function LitCard({ children, className = '' }: LitCardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl shadow-sm"
      style={{ background: 'linear-gradient(150deg, #20233a, #181a28)', height: 'auto', minHeight: 'fit-content' }}
    >
      <div
        className="absolute -top-15 -right-10 w-[180px] h-[180px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(145,132,217,.22), transparent 68%)' }}
      />
      <div className={['relative', className].join(' ')}>{children}</div>
    </div>
  );
}
