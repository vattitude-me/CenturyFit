import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Tag from '../../components/Tag';

const BAR_HEIGHTS = [14, 20, 29, 36, 47, 58, 71, 86, 100];
const BAR_COLORS = [
  '#423a6a', '#423a6a', '#5d5294', '#5d5294', '#796cbf',
  '#796cbf', '#968ae0', '#b5abfc', '#9184d9',
];

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="route-forward h-full overflow-y-auto flex flex-col px-6.5 pt-8.5 pb-action">
      <div className="flex flex-col gap-2.5">
        <div className="text-[11px] tracking-[0.22em] text-accent font-semibold">RUNGS</div>
        <div className="text-[38px] leading-[1.04] font-medium tracking-[-0.03em]" style={{ textWrap: 'pretty' }}>
          Start at a hundred.<br />Finish at three.
        </div>
        <div className="text-sm leading-[1.55] text-neutral-400 max-w-[300px]">
          100 reps a day to begin — push-ups, pull-ups and squats mixed to your
          strength. Earn your way to 200, then 300: a hundred of each.
        </div>
      </div>

      <div
        className="flex-1 min-h-9 relative my-6.5 mb-1.5 rounded-2xl overflow-hidden flex items-end p-4 shadow-sm"
        style={{ background: 'linear-gradient(150deg, #1d2033, #161826 62%)' }}
      >
        <div
          className="absolute -top-10 -right-7.5 w-[200px] h-[200px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(145,132,217,.30), transparent 65%)' }}
        />
        <div className="flex items-end gap-1.25 h-full w-full">
          {BAR_HEIGHTS.map((h, i) => (
            <div key={i} style={{ height: `${h}%`, background: BAR_COLORS[i] }} className="flex-1 rounded-[3px]" />
          ))}
        </div>
        <div className="absolute left-4 top-3.5 text-[11px] tracking-[0.08em] text-neutral-500">
          100 &nbsp;→&nbsp; 200 &nbsp;→&nbsp; 300 REPS A DAY
        </div>
      </div>

      <div className="flex flex-col gap-2.25 mt-3.5">
        <Button
          variant="primary" block className="h-12 text-[15px]"
          onClick={() => navigate('/onboarding/name')}
        >
          Find my starting point
        </Button>
        <Button
          variant="secondary" block className="h-11"
          onClick={() => navigate('/onboarding/name', { state: { skipAhead: true } })}
        >
          I already train, skip ahead
        </Button>
        <div className="flex justify-center gap-2 mt-1.5">
          <Tag variant="neutral">Free forever</Tag>
          <Tag variant="neutral">Works offline</Tag>
          <Tag variant="neutral">No account needed</Tag>
        </div>
      </div>
    </div>
  );
}
