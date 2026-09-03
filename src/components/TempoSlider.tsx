interface TempoSliderProps {
  tempo: number;
  onChange: (tempo: number) => void;
  min?: number;
  max?: number;
}

export default function TempoSlider({ tempo, onChange, min = 1, max = 4 }: TempoSliderProps) {
  const mid = (min + max) / 2;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] tracking-[0.1em] text-neutral-500">TEMPO</span>
        <span className="text-xs tabular-nums text-neutral-300">{tempo.toFixed(2)} s / rep</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={0.25}
        value={tempo}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full min-h-[26px] p-0 bg-transparent border-0 accent-accent"
      />
      <div className="flex justify-between text-[10px] text-neutral-600">
        <span>{min.toFixed(1)} explosive</span>
        <span>{mid.toFixed(1)} standard</span>
        <span>{max.toFixed(1)} grind</span>
      </div>
    </div>
  );
}
