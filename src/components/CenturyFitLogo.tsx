interface LogoProps {
  size?: number;
  className?: string;
}

export default function CenturyFitLogo({ size = 64, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Running figure - matches CenturyFit brand icon from icon_set */}
      <g transform="translate(50, 50) scale(0.85)">
        {/* Head */}
        <circle cx="8" cy="-35" r="8" fill="#A78BFA" />
        {/* Body trunk */}
        <path
          d="M5 -26 L-2 0"
          stroke="#A78BFA"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* Left arm - reaching back */}
        <path
          d="M2 -20 L-22 -28 L-30 -18"
          stroke="#A78BFA"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Right arm - reaching forward */}
        <path
          d="M2 -20 L22 -32 L32 -24"
          stroke="#A78BFA"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Left leg - forward stride */}
        <path
          d="M-2 0 L-18 20 L-28 32"
          stroke="#A78BFA"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Right leg - back stride */}
        <path
          d="M-2 0 L14 18 L22 32"
          stroke="#A78BFA"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
    </svg>
  );
}
