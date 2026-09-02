import { useId } from 'react';
import GradientIcon from './GradientIcon';
import type { IconProps } from './types';

const GOLD = [
  { offset: '0%', color: '#FDE68A' },
  { offset: '100%', color: '#D97706' },
];
const RED = [
  { offset: '0%', color: '#FCA5A5' },
  { offset: '100%', color: '#DC2626' },
];
const GREEN = [
  { offset: '0%', color: '#86EFAC' },
  { offset: '100%', color: '#16A34A' },
];
const PURPLE = [
  { offset: '0%', color: '#C4B5FD' },
  { offset: '100%', color: '#7C3AED' },
];

export function FlameIcon(props: IconProps) {
  const ORANGE = [
    { offset: '0%', color: '#FDBA74' },
    { offset: '45%', color: '#F97316' },
    { offset: '100%', color: '#DC2626' },
  ];
  const fiId = `fi${useId().replace(/[:]/g, '')}`;
  return (
    <GradientIcon {...props} stops={ORANGE} x1={6} y1={1.5} x2={13.7} y2={18.1}>
      {(id) => (
        <>
          <path
            d="M12 1.5s4.5 4.5 4.5 9c0 1.5-.75 2.8-1.5 3.6.75-2 0-4-1.5-5.5.2 2.25-1.1 3.4-2.6 4.9-1.5 1.5-2.9 2.9-2.9 5.2 0 2.5 2 4.3 4.5 4.3-2.25.9-6.1-.6-6.4-4.3-.3-3.3 2.1-5.4 2.1-5.4-.6 1.2-.3 2.4.3 3.3-.6-2.2-.15-5.6 3.5-15.1Z"
            fill={`url(#${id})`}
          />
          <path d="M12 10.5s1.6 1.6 1.6 3.6a2.4 2.4 0 0 1-2.4 2.4c-1.1 0-2-.8-2-2 0-1.4 1.3-2.4 2.8-4Z" fill={`url(#${fiId})`} />
          <defs>
            <linearGradient id={fiId} x1="9.2" y1="10.5" x2="13.6" y2="16.5" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FEF3C7" />
              <stop offset="100%" stopColor="#FDBA74" />
            </linearGradient>
          </defs>
        </>
      )}
    </GradientIcon>
  );
}

export function TrophyIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={GOLD} x1={5} y1={2} x2={19} y2={21}>
      {(id) => (
        <>
          <path d="M7 3h10v5.5a5 5 0 0 1-10 0V3Z" fill={`url(#${id})`} />
          <path d="M7 4.5H4v1.5a3.5 3.5 0 0 0 3.5 3.5M17 4.5h3v1.5a3.5 3.5 0 0 1-3.5 3.5" stroke={`url(#${id})`} strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <rect x="10.5" y="13.5" width="3" height="3.5" fill="#B45309" />
          <path d="M8 20.5c0-1.6 1.8-2.5 4-2.5s4 .9 4 2.5v.5H8v-.5Z" fill="#B45309" />
        </>
      )}
    </GradientIcon>
  );
}

export function TargetIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={RED} x1={3} y1={3} x2={21} y2={21}>
      {(id) => (
        <>
          <circle cx="12" cy="12" r="9.5" fill={`url(#${id})`} />
          <circle cx="12" cy="12" r="6" fill="#0F0A1A" />
          <circle cx="12" cy="12" r="3.2" fill={`url(#${id})`} />
        </>
      )}
    </GradientIcon>
  );
}

export function TrendingUpIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={GREEN} x1={3} y1={4} x2={21} y2={18}>
      {(id) => (
        <path
          d="M3 17l6-6.5 4 3.5L21 5.5M21 5.5h-5M21 5.5v5"
          stroke={`url(#${id})`}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      )}
    </GradientIcon>
  );
}

export function MedalIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={GOLD} x1={5} y1={9} x2={19} y2={22}>
      {(id) => (
        <>
          <path d="M8 2h8l-3 8h-2L8 2Z" fill="#94A3B8" />
          <circle cx="12" cy="15" r="7" fill={`url(#${id})`} />
          <circle cx="12" cy="15" r="4.2" fill="#0F0A1A" opacity="0.18" />
        </>
      )}
    </GradientIcon>
  );
}

export function LeaderboardIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={PURPLE} x1={3} y1={4} x2={21} y2={20}>
      {(id) => (
        <>
          <rect x="3.5" y="13" width="5" height="7" rx="1.2" fill={`url(#${id})`} />
          <rect x="9.5" y="8" width="5" height="12" rx="1.2" fill={`url(#${id})`} />
          <rect x="15.5" y="4" width="5" height="16" rx="1.2" fill="#4C1D95" />
        </>
      )}
    </GradientIcon>
  );
}

export function LineChartIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={PURPLE} x1={3} y1={4} x2={21} y2={20}>
      {(id) => (
        <>
          <path d="M3 20V4M3 20h18" stroke="#64748B" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M4.5 16l4-5 3.5 3 6-8" stroke={`url(#${id})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </>
      )}
    </GradientIcon>
  );
}
