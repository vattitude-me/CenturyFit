import GradientIcon from './GradientIcon';
import type { IconProps } from './types';

const GREEN = [
  { offset: '0%', color: '#86EFAC' },
  { offset: '100%', color: '#16A34A' },
];
const RED = [
  { offset: '0%', color: '#FCA5A5' },
  { offset: '100%', color: '#DC2626' },
];
const PURPLE = [
  { offset: '0%', color: '#C4B5FD' },
  { offset: '100%', color: '#7C3AED' },
];
const SLATE = [
  { offset: '0%', color: '#CBD5E1' },
  { offset: '100%', color: '#64748B' },
];

export function PlayIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={GREEN} x1={6} y1={4} x2={18} y2={20}>
      {(id) => <path d="M7 4.5v15l13-7.5-13-7.5Z" fill={`url(#${id})`} />}
    </GradientIcon>
  );
}

export function PauseIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={PURPLE} x1={6} y1={4} x2={18} y2={20}>
      {(id) => (
        <>
          <rect x="6" y="4.5" width="4.5" height="15" rx="1.5" fill={`url(#${id})`} />
          <rect x="13.5" y="4.5" width="4.5" height="15" rx="1.5" fill={`url(#${id})`} />
        </>
      )}
    </GradientIcon>
  );
}

export function StopIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={RED} x1={5} y1={5} x2={19} y2={19}>
      {(id) => <rect x="5" y="5" width="14" height="14" rx="3" fill={`url(#${id})`} />}
    </GradientIcon>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={GREEN} x1={4} y1={4} x2={20} y2={20}>
      {(id) => (
        <>
          <circle cx="12" cy="12" r="9.5" fill={`url(#${id})`} />
          <path d="M7.5 12.5l3 3 6-6.5" stroke="#F0FDF4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </>
      )}
    </GradientIcon>
  );
}

export function CancelIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={RED} x1={4} y1={4} x2={20} y2={20}>
      {(id) => (
        <>
          <circle cx="12" cy="12" r="9.5" fill={`url(#${id})`} />
          <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" stroke="#FEF2F2" strokeWidth="2.2" strokeLinecap="round" />
        </>
      )}
    </GradientIcon>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={SLATE} x1={4} y1={4} x2={20} y2={20}>
      {(id) => <path d="M12 5v14M5 12h14" stroke={`url(#${id})`} strokeWidth="2.2" strokeLinecap="round" />}
    </GradientIcon>
  );
}

export function MinusIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={SLATE} x1={4} y1={11} x2={20} y2={13}>
      {(id) => <path d="M5 12h14" stroke={`url(#${id})`} strokeWidth="2.2" strokeLinecap="round" />}
    </GradientIcon>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={SLATE} x1={7} y1={5} x2={17} y2={19}>
      {(id) => <path d="M15 5l-7 7 7 7" stroke={`url(#${id})`} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />}
    </GradientIcon>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={SLATE} x1={7} y1={5} x2={17} y2={19}>
      {(id) => <path d="M9 5l7 7-7 7" stroke={`url(#${id})`} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />}
    </GradientIcon>
  );
}

export function SettingsIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={SLATE} x1={4} y1={4} x2={20} y2={20}>
      {(id) => (
        <>
          <path
            d="M12 3.5l1.4 2 2.4-.6 1.2 2.1-1.5 1.9v2.2l1.5 1.9-1.2 2.1-2.4-.6-1.4 2-1.4-2-2.4.6-1.2-2.1 1.5-1.9V8.9L6.4 7l1.2-2.1 2.4.6 1.4-2Z"
            fill={`url(#${id})`}
          />
          <circle cx="12" cy="12" r="2.6" fill="#1A1128" />
        </>
      )}
    </GradientIcon>
  );
}

export function TimerIcon(props: IconProps) {
  const BLUE = [
    { offset: '0%', color: '#7DD3FC' },
    { offset: '100%', color: '#2563EB' },
  ];
  return (
    <GradientIcon {...props} stops={BLUE} x1={4} y1={4} x2={20} y2={21}>
      {(id) => (
        <>
          <path d="M9.5 2h5" stroke={`url(#${id})`} strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="12" cy="13" r="8.5" fill={`url(#${id})`} />
          <path d="M12 8.5V13l3 2" stroke="#EFF6FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </>
      )}
    </GradientIcon>
  );
}
