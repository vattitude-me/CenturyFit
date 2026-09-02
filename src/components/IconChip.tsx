import type { ReactNode } from 'react';
import type { Exercise } from '../types';

const EXERCISE_CHIP_BG: Record<Exercise, string> = {
  push: '#423a6a',
  pull: '#3f424d',
  squat: '#2b2741',
};

interface IconChipProps {
  children: ReactNode;
  exercise?: Exercise;
  bg?: string;
  size?: number;
}

export default function IconChip({ children, exercise, bg, size = 38 }: IconChipProps) {
  const background = bg ?? (exercise ? EXERCISE_CHIP_BG[exercise] : '#3f424d');
  return (
    <span
      style={{ width: size, height: size, background }}
      className="flex-none rounded-[11px] grid place-items-center text-accent-100"
    >
      {children}
    </span>
  );
}
