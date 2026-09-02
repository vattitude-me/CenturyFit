interface TempoSliderProps {
  tempo: number;
  onChange: (tempo: number) => void;
}

export default function TempoSlider({ tempo, onChange }: TempoSliderProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] tracking-[0.1em] text-neutral-500">TEMPO</span>
        <span className="text-xs tabular-nums text-neutral-300">{tempo.toFixed(2)} s / rep</span>
      </div>
      <input
        type="range"
        min={1}
        max={4}
        step={0.25}
        value={tempo}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full min-h-[26px] p-0 bg-transparent border-0 accent-accent"
      />
      <div className="flex justify-between text-[10px] text-neutral-600">
        <span>1.0 explosive</span>
        <span>2.0 standard</span>
        <span>4.0 grind</span>
      </div>
    </div>
  );
}
