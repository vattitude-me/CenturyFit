import type { ReactNode } from 'react';

type Variant = 'accent' | 'neutral' | 'outline';

interface TagProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  accent: 'bg-accent-800 text-accent-100',
  neutral: 'bg-neutral-800 text-neutral-100',
  outline: 'border border-accent text-accent',
};

export default function Tag({ variant = 'neutral', children, className = '' }: TagProps) {
  return (
    <span
      className={[
        'inline-flex items-center text-[11px] tracking-wide px-2.5 py-1 rounded-md',
        VARIANT_CLASSES[variant],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
}
