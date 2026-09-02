import { useId } from 'react';
import GradientIcon from './GradientIcon';
import type { IconProps } from './types';

const PURPLE = [
  { offset: '0%', color: '#C4B5FD' },
  { offset: '100%', color: '#7C3AED' },
];
const SLATE = [
  { offset: '0%', color: '#CBD5E1' },
  { offset: '100%', color: '#64748B' },
];

export function VolumeIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={PURPLE} x1={3} y1={6} x2={20} y2={18}>
      {(id) => (
        <>
          <path d="M4 9.5h3.2L11 6v12l-3.8-3.5H4v-5Z" fill={`url(#${id})`} />
          <path d="M14.5 9a4 4 0 0 1 0 6M17 6.5a7.5 7.5 0 0 1 0 11" stroke={`url(#${id})`} strokeWidth="1.6" strokeLinecap="round" fill="none" />
        </>
      )}
    </GradientIcon>
  );
}

export function MuteIcon(props: IconProps) {
  const mrId = `mr${useId().replace(/[:]/g, '')}`;
  return (
    <GradientIcon {...props} stops={SLATE} x1={3} y1={6} x2={20} y2={18}>
      {(id) => (
        <>
          <path d="M4 9.5h3.2L11 6v12l-3.8-3.5H4v-5Z" fill={`url(#${id})`} />
          <path d="M15 9l4.5 6M19.5 9L15 15" stroke={`url(#${mrId})`} strokeWidth="1.8" strokeLinecap="round" />
          <defs>
            <linearGradient id={mrId} x1="15" y1="9" x2="19.5" y2="15" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FCA5A5" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
          </defs>
        </>
      )}
    </GradientIcon>
  );
}

export function VibrationIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={PURPLE} x1={2} y1={4} x2={22} y2={20}>
      {(id) => (
        <>
          <rect x="8.5" y="4" width="7" height="16" rx="2" fill={`url(#${id})`} />
          <path d="M4 9v6M2 10.5v3M20 9v6M22 10.5v3" stroke={`url(#${id})`} strokeWidth="1.6" strokeLinecap="round" />
        </>
      )}
    </GradientIcon>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={PURPLE} x1={4} y1={2} x2={20} y2={22}>
      {(id) => (
        <>
          <path
            d="M12 2.5a5.5 5.5 0 0 0-5.5 5.5v3.2c0 1-.4 2-1.1 2.7L4 15.5h16l-1.4-1.6a3.8 3.8 0 0 1-1.1-2.7V8a5.5 5.5 0 0 0-5.5-5.5Z"
            fill={`url(#${id})`}
          />
          <path d="M9.5 18a2.5 2.5 0 0 0 5 0" stroke="#4C1D95" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </>
      )}
    </GradientIcon>
  );
}

export function BellDotIcon(props: IconProps) {
  const ndId = `nd${useId().replace(/[:]/g, '')}`;
  return (
    <GradientIcon {...props} stops={PURPLE} x1={4} y1={2} x2={20} y2={22}>
      {(id) => (
        <>
          <path
            d="M12 2.5a5.5 5.5 0 0 0-5.5 5.5v3.2c0 1-.4 2-1.1 2.7L4 15.5h16l-1.4-1.6a3.8 3.8 0 0 1-1.1-2.7V8a5.5 5.5 0 0 0-5.5-5.5Z"
            fill={`url(#${id})`}
          />
          <path d="M9.5 18a2.5 2.5 0 0 0 5 0" stroke="#4C1D95" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <circle cx="18" cy="5" r="3.4" fill={`url(#${ndId})`} stroke="#0F0A1A" strokeWidth="1.2" />
          <defs>
            <linearGradient id={ndId} x1="14.6" y1="1.6" x2="21.4" y2="8.4" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FCA5A5" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
          </defs>
        </>
      )}
    </GradientIcon>
  );
}
