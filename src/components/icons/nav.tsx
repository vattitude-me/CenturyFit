import { useId } from 'react';
import GradientIcon from './GradientIcon';
import type { IconProps } from './types';

const PURPLE = [
  { offset: '0%', color: '#A78BFA' },
  { offset: '100%', color: '#6D28D9' },
];
const PURPLE_DARK = [
  { offset: '0%', color: '#8B5CF6' },
  { offset: '100%', color: '#5B21B6' },
];

export function HomeIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={PURPLE} x1={4} y1={2} x2={20} y2={21}>
      {(id) => (
        <>
          <path d="M12 2.5L21 10v9.5a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 19.5V10l9-7.5Z" fill={`url(#${id})`} />
          <path d="M9.5 21v-6a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v6h-5Z" fill="#4C1D95" />
        </>
      )}
    </GradientIcon>
  );
}

export function PlanIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={PURPLE} x1={3} y1={3} x2={21} y2={21}>
      {(id) => (
        <>
          <rect x="3" y="4.5" width="18" height="16" rx="3" fill={`url(#${id})`} />
          <rect x="3" y="4.5" width="18" height="5" rx="2.5" fill="#4C1D95" />
          <rect x="7" y="12" width="3.2" height="3.2" rx="0.8" fill="#EDE9FE" />
          <rect x="13.4" y="12" width="3.2" height="3.2" rx="0.8" fill="#EDE9FE" opacity="0.6" />
        </>
      )}
    </GradientIcon>
  );
}

export function ProgressIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={PURPLE} x1={3} y1={4} x2={21} y2={20}>
      {(id) => (
        <>
          <rect x="4" y="13" width="3.6" height="7" rx="1" fill={`url(#${id})`} />
          <rect x="10.2" y="8" width="3.6" height="12" rx="1" fill={`url(#${id})`} />
          <rect x="16.4" y="4" width="3.6" height="16" rx="1" fill="#4C1D95" />
        </>
      )}
    </GradientIcon>
  );
}

export function ProfileIcon(props: IconProps) {
  const pdId = `pd${useId().replace(/[:]/g, '')}`;
  return (
    <GradientIcon {...props} stops={PURPLE} x1={5} y1={2} x2={19} y2={22}>
      {(id) => (
        <>
          <circle cx="12" cy="8" r="4.2" fill={`url(#${id})`} />
          <path d="M4 20.5c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5v1H4v-1Z" fill={`url(#${pdId})`} />
          <defs>
            <linearGradient id={pdId} x1="4" y1="14" x2="20" y2="21.5" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#5B21B6" />
            </linearGradient>
          </defs>
        </>
      )}
    </GradientIcon>
  );
}

export function AddIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={PURPLE_DARK} x1={4} y1={4} x2={20} y2={20}>
      {(id) => (
        <>
          <circle cx="12" cy="12" r="9.5" fill={`url(#${id})`} />
          <path d="M12 7.5v9M7.5 12h9" stroke="#EDE9FE" strokeWidth="2.2" strokeLinecap="round" />
        </>
      )}
    </GradientIcon>
  );
}
