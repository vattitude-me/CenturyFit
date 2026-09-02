import type { ReactNode } from 'react';

interface ListRowProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
  isFirst?: boolean;
  onClick?: () => void;
}

export default function ListRow({ icon, title, subtitle, trailing, isFirst, onClick }: ListRowProps) {
  return (
    <div
      onClick={onClick}
      className={[
        'flex items-center gap-2.5 px-3.5 py-3',
        isFirst ? '' : 'border-t border-neutral-800/60',
        onClick ? 'cursor-pointer' : '',
      ].join(' ')}
    >
      {icon && <span className="w-5.5 flex-none text-center text-[13px] text-neutral-400">{icon}</span>}
      <span className="flex-1 flex flex-col gap-px">
        <span className="text-[13.5px]">{title}</span>
        {subtitle && <span className="text-[11px] text-neutral-600">{subtitle}</span>}
      </span>
      {trailing}
    </div>
  );
}
