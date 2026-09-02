import GradientIcon from './GradientIcon';
import type { IconProps } from './types';

const YELLOW = [
  { offset: '0%', color: '#FDE68A' },
  { offset: '100%', color: '#D97706' },
];
const INDIGO = [
  { offset: '0%', color: '#A5B4FC' },
  { offset: '100%', color: '#4338CA' },
];
const ORANGE = [
  { offset: '0%', color: '#FDBA74' },
  { offset: '100%', color: '#EA580C' },
];
const BLUE = [
  { offset: '0%', color: '#7DD3FC' },
  { offset: '100%', color: '#2563EB' },
];
const GREEN = [
  { offset: '0%', color: '#86EFAC' },
  { offset: '100%', color: '#16A34A' },
];
const SLATE = [
  { offset: '0%', color: '#CBD5E1' },
  { offset: '100%', color: '#64748B' },
];
const RED = [
  { offset: '0%', color: '#FCA5A5' },
  { offset: '100%', color: '#DC2626' },
];

export function SunIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={YELLOW} x1={4} y1={4} x2={20} y2={20}>
      {(id) => (
        <>
          <circle cx="12" cy="12" r="5" fill={`url(#${id})`} />
          <path d="M12 2v2.5M12 19.5V22M22 12h-2.5M4.5 12H2M19 5l-1.8 1.8M6.8 17.2 5 19M19 19l-1.8-1.8M6.8 6.8 5 5" stroke={`url(#${id})`} strokeWidth="1.8" strokeLinecap="round" />
        </>
      )}
    </GradientIcon>
  );
}

export function SunsetIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={ORANGE} x1={3} y1={4} x2={21} y2={20}>
      {(id) => (
        <>
          <path d="M12 4v6" stroke={`url(#${id})`} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M8.5 8.5 12 10l3.5-1.5" stroke={`url(#${id})`} strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M6.5 16a5.5 5.5 0 0 1 11 0" fill={`url(#${id})`} />
          <path d="M3 16h18M3 19.5h18" stroke="#7C2D12" strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
        </>
      )}
    </GradientIcon>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={INDIGO} x1={4} y1={3} x2={20} y2={20}>
      {(id) => <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" fill={`url(#${id})`} />}
    </GradientIcon>
  );
}

export function DropletIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={BLUE} x1={5} y1={2} x2={19} y2={22}>
      {(id) => <path d="M12 2.5s7 8 7 12.5a7 7 0 1 1-14 0c0-4.5 7-12.5 7-12.5Z" fill={`url(#${id})`} />}
    </GradientIcon>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={GREEN} x1={4} y1={2} x2={20} y2={22}>
      {(id) => (
        <>
          <path d="M12 2.5 19.5 5.5V11c0 5-3.2 8.7-7.5 10.5C7.7 19.7 4.5 16 4.5 11V5.5L12 2.5Z" fill={`url(#${id})`} />
          <path d="M8.5 12l2.3 2.3L15.5 9.5" stroke="#F0FDF4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </>
      )}
    </GradientIcon>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={BLUE} x1={4} y1={4} x2={20} y2={20}>
      {(id) => (
        <>
          <circle cx="12" cy="12" r="9.5" fill={`url(#${id})`} />
          <circle cx="12" cy="8" r="1.3" fill="#EFF6FF" />
          <path d="M12 11v6" stroke="#EFF6FF" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </GradientIcon>
  );
}

export function LogOutIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={RED} x1={3} y1={3} x2={21} y2={21}>
      {(id) => (
        <>
          <path d="M10 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H10" stroke={`url(#${id})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M15 8l4 4-4 4M9 12h10" stroke={`url(#${id})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </>
      )}
    </GradientIcon>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={BLUE} x1={3} y1={3} x2={21} y2={21}>
      {(id) => (
        <>
          <circle cx="12" cy="12" r="9.5" fill={`url(#${id})`} />
          <ellipse cx="12" cy="12" rx="4" ry="9.5" fill="none" stroke="#0F172A" strokeOpacity="0.35" strokeWidth="1.3" />
          <path d="M2.5 12h19M4 7h16M4 17h16" stroke="#0F172A" strokeOpacity="0.35" strokeWidth="1.3" />
        </>
      )}
    </GradientIcon>
  );
}

export function HelpIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={SLATE} x1={4} y1={4} x2={20} y2={20}>
      {(id) => (
        <>
          <circle cx="12" cy="12" r="9.5" fill={`url(#${id})`} />
          <path d="M9.8 9.3a2.3 2.3 0 1 1 3.4 2c-.8.5-1.2 1-1.2 2" stroke="#F8FAFC" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <circle cx="12" cy="17" r="1.1" fill="#F8FAFC" />
        </>
      )}
    </GradientIcon>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={BLUE} x1={4} y1={3} x2={20} y2={21}>
      {(id) => (
        <path d="M12 3v11m0 0 4-4m-4 4-4-4M4 17v2.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V17" stroke={`url(#${id})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      )}
    </GradientIcon>
  );
}

export function SyncIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={GREEN} x1={3} y1={3} x2={21} y2={21}>
      {(id) => (
        <path
          d="M4 12a8 8 0 0 1 13.7-5.7M20 12a8 8 0 0 1-13.7 5.7M17 3.5V7h-3.5M7 20.5V17h3.5"
          stroke={`url(#${id})`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      )}
    </GradientIcon>
  );
}
