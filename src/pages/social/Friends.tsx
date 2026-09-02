import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFriends } from '../../db';
import { ChevronLeftIcon, LeaderboardIcon, InviteIcon } from '../../components/icons';
import type { Friend } from '../../types';

function timeAgo(ts: number): string {
  const diffMs = Date.now() - ts;
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return 'now';
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h`;
  return `${Math.floor(hr / 24)}d`;
}

const AVATAR_COLORS = ['#7C3AED', '#22C55E', '#3B82F6', '#F97316', '#EC4899'];

function avatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export default function Friends() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'feed' | 'following'>('feed');
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    getFriends().then(setFriends);
  }, []);

  return (
    <div className="flex flex-col min-h-full bg-bg-primary animate-fade-in">
      <div className="flex items-center justify-between px-5 pt-6 pb-2">
        <button onClick={() => navigate(-1)} className="text-text-secondary">
          <ChevronLeftIcon size={24} />
        </button>
        <h1 className="text-lg font-bold">Friends</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/leaderboard')} className="text-text-secondary">
            <LeaderboardIcon size={22} />
          </button>
          <button onClick={() => navigate('/friends/add')} className="text-text-secondary">
            <InviteIcon size={22} />
          </button>
        </div>
      </div>

      <div className="px-5 mt-4">
        <div className="flex gap-1 p-1 rounded-2xl bg-bg-card">
          {(['feed', 'following'] as const).map(t => (
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

      <div className="flex flex-col gap-2 px-5 mt-5 pb-8">
        {friends.map(friend => (
          <button
            key={friend.id}
            onClick={() => navigate(`/friends/${friend.id}/nudge`)}
            className="flex items-center gap-3 p-3 rounded-2xl bg-bg-card text-left"
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold shrink-0"
              style={{ backgroundColor: avatarColor(friend.id) }}
            >
              {friend.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold">{friend.name}</div>
              <div className="text-text-secondary text-xs truncate">{friend.lastActivityText}</div>
            </div>
            <span className="text-text-muted text-xs shrink-0">{timeAgo(friend.lastActivityAt)}</span>
          </button>
        ))}
        {friends.length === 0 && (
          <p className="text-text-muted text-sm text-center mt-8">No activity yet — add some friends!</p>
        )}
      </div>
    </div>
  );
}
