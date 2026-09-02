interface FillBarProps {
  pct: number;
  color: string;
  height?: number;
}

export default function FillBar({ pct, color, height = 9 }: FillBarProps) {
  return (
    <div
      style={{ height }}
      className="rounded-full bg-text/9 overflow-hidden flex"
    >
      <span
        style={{ width: `${Math.max(0, Math.min(100, pct))}%`, background: color }}
        className="block h-full rounded-full transition-[width] duration-500"
      />
    </div>
  );
}
