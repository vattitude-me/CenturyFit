import { useId } from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export default function CenturyFitLogo({ size = 64, className = '' }: LogoProps) {
  const rawId = useId().replace(/[:]/g, '');
  const bgId = `logoBg${rawId}`;
  const orangeId = `logoOrange${rawId}`;
  const greenId = `logoGreen${rawId}`;
  const purpleId = `logoPurple${rawId}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1A1128" />
          <stop offset="100%" stopColor="#0F0A1A" />
        </linearGradient>
        <radialGradient id={orangeId} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#FDBA74" />
          <stop offset="100%" stopColor="#EA580C" />
        </radialGradient>
        <radialGradient id={greenId} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#86EFAC" />
          <stop offset="100%" stopColor="#16A34A" />
        </radialGradient>
        <radialGradient id={purpleId} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#C4B5FD" />
          <stop offset="100%" stopColor="#7C3AED" />
        </radialGradient>
      </defs>
      <rect width="512" height="512" rx="112" fill={`url(#${bgId})`} />
      <circle cx="164" cy="304" r="92" fill={`url(#${orangeId})`} />
      <circle cx="348" cy="304" r="92" fill={`url(#${greenId})`} />
      <circle cx="256" cy="176" r="92" fill={`url(#${purpleId})`} />
    </svg>
  );
}
