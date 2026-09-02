import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChallenges } from '../../db';
import { ChevronLeftIcon, HandshakeIcon, TrophyIcon } from '../../components/icons';
import type { Challenge } from '../../types';

export default function Challenges() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'active' | 'completed'>('active');
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    getChallenges().then(setChallenges);
  }, []);

  const filtered = challenges.filter(c => c.status === tab);

  return (
    <div className="flex flex-col min-h-full bg-bg-primary animate-fade-in">
      <div className="flex items-center gap-3 px-5 pt-6 pb-2">
        <button onClick={() => navigate(-1)} className="text-text-secondary">
          <ChevronLeftIcon size={24} />
        </button>
        <h1 className="text-lg font-bold">Challenges</h1>
      </div>

      <div className="px-5 mt-4">
        <div className="flex gap-1 p-1 rounded-2xl bg-bg-card">
          {(['active', 'completed'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition-colors ${
                tab === t ? 'bg-purple-accent text-white' : 'text-text-secondary'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 px-5 mt-5 pb-8">
        {filtered.map(c => {
          const pct = Math.min(100, Math.round((c.progress / c.goal) * 100));
          return (
            <div key={c.id} className="p-5 rounded-2xl bg-bg-card">
              <div className="flex items-center gap-3 mb-3">
                <HandshakeIcon size={28} />
                <div className="flex-1">
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-text-secondary text-xs">{c.description}</div>
                </div>
              </div>
              <div className="h-2 bg-bg-primary rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-green-accent rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="text-xs text-text-muted">
                Progress: {c.progress.toLocaleString()} / {c.goal.toLocaleString()} {c.unit}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-text-muted text-sm text-center mt-8">No {tab} challenges.</p>
        )}
      </div>

      {tab === 'active' && (
        <div className="px-5 pb-8 mt-auto">
          <button className="w-full flex items-center justify-center gap-2 py-4 bg-purple-accent text-white font-semibold rounded-2xl">
            <TrophyIcon size={20} />
            Join a Challenge
          </button>
        </div>
      )}
    </div>
  );
}
