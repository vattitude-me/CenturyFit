import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFriends, getStreak } from '../../db';
import { ChevronLeftIcon, MedalIcon } from '../../components/icons';

const AVATAR_COLORS = ['#7C3AED', '#22C55E', '#3B82F6', '#F97316', '#EC4899'];

function avatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

interface Row {
  id: string;
  name: string;
  points: number;
  isYou: boolean;
}

export default function Leaderboard() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    async function load() {
      const friends = await getFriends();
      const streak = await getStreak();
      const you: Row = { id: 'you', name: 'Alex (You)', points: 500 + streak.current * 20, isYou: true };
      const all: Row[] = [...friends.map(f => ({ id: f.id, name: f.name, points: f.points, isYou: false })), you]
        .sort((a, b) => b.points - a.points);
      setRows(all);
    }
    load();
  }, []);

  const medalColors: Record<number, string> = { 0: '#FBBF24', 1: '#CBD5E1', 2: '#D97706' };

  return (
    <div className="flex flex-col min-h-full bg-bg-primary animate-fade-in">
      <div className="flex items-center justify-between px-5 pt-6 pb-2">
        <button onClick={() => navigate(-1)} className="text-text-secondary">
          <ChevronLeftIcon size={24} />
        </button>
        <h1 className="text-lg font-bold">Leaderboard</h1>
        <span className="text-xs text-text-secondary bg-bg-card px-3 py-1.5 rounded-full">This Week</span>
      </div>

      <div className="flex flex-col gap-2 px-5 mt-6 pb-8">
        {rows.map((row, i) => (
          <div
            key={row.id}
            className={`flex items-center gap-4 p-3 rounded-2xl ${
              row.isYou ? 'bg-purple-accent/15 border-2 border-purple-accent' : 'bg-bg-card'
            }`}
          >
            <div className="w-7 flex items-center justify-center shrink-0">
              {i < 3 ? (
                <MedalIcon size={24} />
              ) : (
                <span className="text-text-muted text-sm font-semibold">{i + 1}</span>
              )}
            </div>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0"
              style={{ backgroundColor: i < 3 ? medalColors[i] : avatarColor(row.id) }}
            >
              {row.name[0]}
            </div>
            <span className={`flex-1 text-sm ${row.isYou ? 'font-bold' : 'font-medium'}`}>{row.name}</span>
            <span className="text-sm font-semibold text-text-secondary">{row.points.toLocaleString()} pts</span>
          </div>
        ))}
      </div>

      <p className="text-center text-text-muted text-xs px-5 pb-8">How points work?</p>
    </div>
  );
}
