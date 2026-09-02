import { useId } from 'react';
import type { IconProps } from './types';

export interface GradientStop {
  offset: string;
  color: string;
}

interface GradientIconProps extends IconProps {
  stops: GradientStop[];
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  children: (gradientId: string) => React.ReactNode;
}

export default function GradientIcon({
  size = 24,
  className = '',
  stops,
  x1 = 4,
  y1 = 2,
  x2 = 20,
  y2 = 22,
  children,
}: GradientIconProps) {
  const rawId = useId();
  const gradientId = `g${rawId.replace(/[:]/g, '')}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1={x1} y1={y1} x2={x2} y2={y2} gradientUnits="userSpaceOnUse">
          {stops.map((s, i) => (
            <stop key={i} offset={s.offset} stopColor={s.color} />
          ))}
        </linearGradient>
      </defs>
      {children(gradientId)}
    </svg>
  );
}
