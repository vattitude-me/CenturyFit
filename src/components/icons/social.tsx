import { useId } from 'react';
import GradientIcon from './GradientIcon';
import type { IconProps } from './types';

const BLUE = [
  { offset: '0%', color: '#7DD3FC' },
  { offset: '100%', color: '#2563EB' },
];
const GREEN = [
  { offset: '0%', color: '#86EFAC' },
  { offset: '100%', color: '#16A34A' },
];
const PURPLE = [
  { offset: '0%', color: '#C4B5FD' },
  { offset: '100%', color: '#7C3AED' },
];
const PINK = [
  { offset: '0%', color: '#F9A8D4' },
  { offset: '100%', color: '#DB2777' },
];
const ORANGE = [
  { offset: '0%', color: '#FDBA74' },
  { offset: '100%', color: '#EA580C' },
];

export function UsersIcon(props: IconProps) {
  const us1Id = `us1${useId().replace(/[:]/g, '')}`;
  return (
    <GradientIcon {...props} stops={BLUE} x1={2} y1={4} x2={22} y2={20}>
      {(id) => (
        <>
          <circle cx="9" cy="8" r="3.4" fill={`url(#${id})`} />
          <path d="M2.5 20c0-3.4 3-5.4 6.5-5.4S15.5 16.6 15.5 20v.5h-13V20Z" fill={`url(#${us1Id})`} />
          <circle cx="17" cy="9" r="2.6" fill="#93C5FD" />
          <path d="M15 20v-.5c0-2-.9-3.6-2.4-4.6 1-.5 2.2-.7 3.4-.7 2.8 0 5 1.6 5 4.3v1.5h-6Z" fill="#60A5FA" />
          <defs>
            <linearGradient id={us1Id} x1="2.5" y1="14.6" x2="15.5" y2="20.5" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
          </defs>
        </>
      )}
    </GradientIcon>
  );
}

export function MessageIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={PURPLE} x1={3} y1={4} x2={21} y2={19}>
      {(id) => (
        <>
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4H6.5A2.5 2.5 0 0 1 4 13.5v-8Z" fill={`url(#${id})`} />
          <circle cx="8.5" cy="9.3" r="1.1" fill="#EDE9FE" />
          <circle cx="12" cy="9.3" r="1.1" fill="#EDE9FE" />
          <circle cx="15.5" cy="9.3" r="1.1" fill="#EDE9FE" />
        </>
      )}
    </GradientIcon>
  );
}

export function SendIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={PURPLE} x1={3} y1={3} x2={21} y2={21}>
      {(id) => <path d="M3 11.5 20.5 3l-6 17.5-4-7-7.5-2Z" fill={`url(#${id})`} />}
    </GradientIcon>
  );
}

export function MegaphoneIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={PINK} x1={2} y1={4} x2={22} y2={20}>
      {(id) => (
        <>
          <path d="M3 10v3.5a1.5 1.5 0 0 0 1.5 1.5H6l1 5h2l-.8-5h1.3l8-3.5V6l-8 3.5H4.5A1.5 1.5 0 0 0 3 10Z" fill={`url(#${id})`} />
          <path d="M18.5 6a5 5 0 0 1 0 8.5" stroke={`url(#${id})`} strokeWidth="1.6" strokeLinecap="round" fill="none" />
        </>
      )}
    </GradientIcon>
  );
}

export function GiftIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={PINK} x1={3} y1={2} x2={21} y2={22}>
      {(id) => (
        <>
          <rect x="4" y="10" width="16" height="10" rx="1.5" fill={`url(#${id})`} />
          <rect x="3" y="7" width="18" height="4" rx="1.2" fill="#BE185D" />
          <rect x="11" y="7" width="2" height="13" fill="#831843" />
          <path d="M12 7c-1-3-3.5-4-5-2.8-1.3 1-.6 2.8 1.3 2.8H12ZM12 7c1-3 3.5-4 5-2.8 1.3 1 .6 2.8-1.3 2.8H12Z" fill={`url(#${id})`} />
        </>
      )}
    </GradientIcon>
  );
}

export function HandshakeIcon(props: IconProps) {
  const hhId = `hh${useId().replace(/[:]/g, '')}`;
  return (
    <GradientIcon {...props} stops={GREEN} x1={2} y1={8} x2={22} y2={17}>
      {(id) => (
        <>
          <path d="M2 12.5 8 7h3.2l2.3 2.2L10 13.7 6.3 16 2 12.5Z" fill={`url(#${id})`} />
          <path d="M22 12.5 16 7h-3.2l-2.3 2.2L14 13.7l3.7 2.3 4.3-3.5Z" fill={`url(#${hhId})`} />
          <path
            d="M9.8 11.2l2.9 2.9c.6.6 1.6.6 2.2 0 .5-.5.6-1.3.2-1.9M12.7 14.1l-1 1c-.6.6-1.6.6-2.2 0-.6-.6-.6-1.6 0-2.2l.2-.2"
            stroke="#F0FDF4"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <defs>
            <linearGradient id={hhId} x1="12" y1="7" x2="22" y2="16" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6EE7B7" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
        </>
      )}
    </GradientIcon>
  );
}

export function CommunityIcon(props: IconProps) {
  const rawId = useId().replace(/[:]/g, '');
  const c2Id = `c2${rawId}`;
  const c3Id = `c3${rawId}`;
  const c4Id = `c4${rawId}`;
  return (
    <GradientIcon {...props} stops={GREEN} x1={2} y1={4} x2={22} y2={20}>
      {(id) => (
        <>
          <circle cx="7" cy="8" r="3" fill={`url(#${id})`} />
          <circle cx="17" cy="8" r="3" fill={`url(#${c2Id})`} />
          <circle cx="12" cy="9.5" r="3.2" fill={`url(#${c3Id})`} />
          <path d="M2.5 20c0-3 2.4-5 5.5-5 1 0 1.9.2 2.7.6-1.4 1-2.2 2.6-2.2 4.4H2.5ZM21.5 20c0-3-2.4-5-5.5-5-1 0-1.9.2-2.7.6 1.4 1 2.2 2.6 2.2 4.4h6Z" fill={`url(#${c4Id})`} />
          <path d="M6.7 20a5.3 5.3 0 0 1 10.6 0H6.7Z" fill={`url(#${id})`} />
          <defs>
            <linearGradient id={c2Id} x1="14" y1="5" x2="20" y2="11" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#6EE7B7" /><stop offset="100%" stopColor="#059669" /></linearGradient>
            <linearGradient id={c3Id} x1="8.8" y1="6.3" x2="15.2" y2="12.7" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#BBF7D0" /><stop offset="100%" stopColor="#15803D" /></linearGradient>
            <linearGradient id={c4Id} x1="2.5" y1="15" x2="21.5" y2="20" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#4ADE80" /><stop offset="100%" stopColor="#166534" /></linearGradient>
          </defs>
        </>
      )}
    </GradientIcon>
  );
}

export function InviteIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={ORANGE} x1={2} y1={3} x2={22} y2={21}>
      {(id) => (
        <>
          <rect x="2" y="5" width="20" height="14" rx="2.5" fill={`url(#${id})`} />
          <path d="M3 6.5l9 6.5 9-6.5" stroke="#0F0A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.35" />
        </>
      )}
    </GradientIcon>
  );
}

export function DumbbellIcon(props: IconProps) {
  return (
    <GradientIcon {...props} stops={PURPLE} x1={2} y1={8} x2={22} y2={16}>
      {(id) => (
        <>
          <rect x="10" y="10.5" width="4" height="3" fill={`url(#${id})`} />
          <rect x="2" y="9" width="3" height="6" rx="1" fill="#4C1D95" />
          <rect x="19" y="9" width="3" height="6" rx="1" fill="#4C1D95" />
          <rect x="5" y="7" width="2.4" height="10" rx="1" fill={`url(#${id})`} />
          <rect x="16.6" y="7" width="2.4" height="10" rx="1" fill={`url(#${id})`} />
        </>
      )}
    </GradientIcon>
  );
}
