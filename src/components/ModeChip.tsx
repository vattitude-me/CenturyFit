interface ModeChipOption<T extends string> {
  key: T;
  label: string;
}

interface ModeChipProps<T extends string> {
  options: ModeChipOption<T>[];
  value: T;
  onChange: (key: T) => void;
}

export default function ModeChip<T extends string>({ options, value, onChange }: ModeChipProps<T>) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => {
        const active = opt.key === value;
        return (
          <span
            key={opt.key}
            onClick={() => onChange(opt.key)}
            className={[
              'flex-1 text-center px-1 py-2.5 rounded-[10px] text-[11.5px] cursor-pointer',
              active ? 'bg-accent/14 text-accent-300 shadow-[inset_0_0_0_1px_#9184d9]' : 'bg-text/5 text-neutral-500',
            ].join(' ')}
          >
            {opt.label}
          </span>
        );
      })}
    </div>
  );
}
