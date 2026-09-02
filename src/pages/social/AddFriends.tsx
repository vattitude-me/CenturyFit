import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFriends, saveFriend } from '../../db';
import { ChevronLeftIcon, CheckIcon } from '../../components/icons';
import type { Friend } from '../../types';

const SUGGESTED: { id: string; name: string; username: string }[] = [
  { id: 'f_chris', name: 'Chris', username: '@chrispowerlifts' },
  { id: 'f_priya', name: 'Priya', username: '@priya.moves' },
  { id: 'f_jordan', name: 'Jordan', username: '@jordanruns' },
  { id: 'f_alexT', name: 'Alex T.', username: '@alext_fit' },
];

export default function AddFriends() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [existing, setExisting] = useState<Friend[]>([]);
  const [justAdded, setJustAdded] = useState<Set<string>>(new Set());

  useEffect(() => {
    getFriends().then(setExisting);
  }, []);

  const existingIds = new Set(existing.map(f => f.id));
  const filtered = SUGGESTED.filter(
    s => s.name.toLowerCase().includes(query.toLowerCase()) || s.username.toLowerCase().includes(query.toLowerCase())
  );

  async function handleAdd(s: { id: string; name: string; username: string }) {
    const friend: Friend = {
      id: s.id,
      name: s.name,
      username: s.username,
      points: 0,
      streak: 0,
      status: 'accepted',
      lastActivityText: 'Just joined CenturyFit',
      lastActivityAt: Date.now(),
    };
    await saveFriend(friend);
    setJustAdded(prev => new Set(prev).add(s.id));
  }

  return (
    <div className="flex flex-col min-h-full bg-bg-primary animate-fade-in">
      <div className="flex items-center gap-3 px-5 pt-6 pb-2">
        <button onClick={() => navigate(-1)} className="text-text-secondary">
          <ChevronLeftIcon size={24} />
        </button>
        <h1 className="text-lg font-bold">Add Friends</h1>
      </div>

      <div className="px-5 mt-4">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by username"
          className="w-full px-4 py-3 rounded-2xl bg-bg-card border-2 border-border text-sm outline-none focus:border-purple-accent"
        />
      </div>

      <div className="flex flex-col gap-2 px-5 mt-5 pb-8">
        {filtered.map(s => {
          const added = existingIds.has(s.id) || justAdded.has(s.id);
          return (
            <div key={s.id} className="flex items-center gap-3 p-3 rounded-2xl bg-bg-card">
              <div className="w-11 h-11 rounded-full bg-purple-accent/30 flex items-center justify-center font-bold text-purple-light shrink-0">
                {s.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{s.name}</div>
                <div className="text-text-secondary text-xs truncate">{s.username}</div>
              </div>
              <button
                onClick={() => handleAdd(s)}
                disabled={added}
                className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 shrink-0 ${
                  added ? 'bg-bg-card-elevated text-text-muted' : 'bg-purple-accent text-white'
                }`}
              >
                {added && <CheckIcon size={14} />}
                {added ? 'Added' : 'Add'}
              </button>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-text-muted text-sm text-center mt-8">No users found.</p>
        )}
      </div>

      <div className="px-5 pb-8 mt-auto">
        <button className="w-full py-4 bg-bg-card text-text-secondary font-semibold rounded-2xl">
          Invite via Link
        </button>
      </div>
    </div>
  );
}
