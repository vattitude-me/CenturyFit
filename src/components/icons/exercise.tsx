import GradientIcon from './GradientIcon';
import type { IconProps } from './types';

const ORANGE = [
  { offset: '0%', color: '#FDBA74' },
  { offset: '100%', color: '#EA580C' },
];
const GREEN = [
  { offset: '0%', color: '#86EFAC' },
  { offset: '100%', color: '#16A34A' },
];
const PURPLE = [
  { offset: '0%', color: '#C4B5FD' },
  { offset: '100%', color: '#7C3AED' },
];

export function PushupIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={ORANGE} x1={2} y1={6} x2={22} y2={19}>
      {(id) => (
        <>
          <circle cx="17.5" cy="7.5" r="2.2" fill={`url(#${id})`} />
          <path
            d="M15.7 9.3 12 12l-3 1.2M12 12l3 6M2.5 19l4-1.5 2-3M22 19l-4-1.5"
            stroke={`url(#${id})`}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </>
      )}
    </GradientIcon>
  );
}

export function PullupIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={GREEN} x1={4} y1={2} x2={20} y2={22}>
      {(id) => (
        <>
          <path d="M4 4h16" stroke={`url(#${id})`} strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="8" r="2.1" fill={`url(#${id})`} />
          <path
            d="M8 4.5v3.5M16 4.5v3.5M12 10v5.5M12 15.5l-3 5M12 15.5l3 5"
            stroke={`url(#${id})`}
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
        </>
      )}
    </GradientIcon>
  );
}

export function SquatIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={PURPLE} x1={4} y1={2} x2={20} y2={22}>
      {(id) => (
        <>
          <circle cx="12" cy="4.3" r="2.1" fill={`url(#${id})`} />
          <path
            d="M12 6.5v5.5l-3.5 5.5-1.7.5M12 12l3.5 5.5 1.7.5M9 10l3 1.8 3-1.8"
            stroke={`url(#${id})`}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </>
      )}
    </GradientIcon>
  );
}
