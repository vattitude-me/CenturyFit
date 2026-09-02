import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFriends } from '../../db';
import { ChevronLeftIcon, MegaphoneIcon, CheckIcon } from '../../components/icons';
import type { Friend } from '../../types';

const QUICK_MESSAGES = [
  'You got this!',
  "Don't break the streak!",
  "Let's crush today!",
  'Consistency > Motivation',
];

export default function NudgeFriend() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [friend, setFriend] = useState<Friend | null>(null);
  const [message, setMessage] = useState(QUICK_MESSAGES[0]);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    getFriends().then(friends => {
      setFriend(friends.find(f => f.id === id) ?? null);
    });
  }, [id]);

  function handleSend() {
    setSent(true);
    setTimeout(() => navigate(-1), 900);
  }

  if (!friend) return null;

  return (
    <div className="flex flex-col min-h-full bg-bg-primary px-6 py-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate(-1)} className="text-text-secondary">
          <ChevronLeftIcon size={24} />
        </button>
        <h1 className="text-lg font-bold">Nudge {friend.name}</h1>
      </div>

      <div className="flex flex-col items-center gap-3 mb-8">
        <div className="w-20 h-20 rounded-full bg-purple-accent/30 flex items-center justify-center text-3xl font-bold text-purple-light">
          {friend.name[0]}
        </div>
        <div className="text-center">
          <div className="font-semibold text-lg">{friend.name}</div>
          <div className="text-text-secondary text-sm">{friend.username}</div>
        </div>
        <p className="text-text-secondary text-sm text-center max-w-xs mt-2">
          Send a nudge to help them stay consistent!
        </p>
      </div>

      <div className="flex flex-col gap-3 flex-1">
        {QUICK_MESSAGES.map(msg => (
          <button
            key={msg}
            onClick={() => setMessage(msg)}
            className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${
              message === msg ? 'border-purple-accent bg-purple-accent/10' : 'border-border bg-bg-card'
            }`}
          >
            <MegaphoneIcon size={20} />
            <span className="flex-1 text-sm font-medium">{msg}</span>
            {message === msg && <CheckIcon size={18} />}
          </button>
        ))}
      </div>

      <button
        onClick={handleSend}
        disabled={sent}
        className="w-full py-4 bg-purple-accent hover:bg-purple-dark text-white font-semibold rounded-2xl transition-colors text-lg mt-8"
      >
        {sent ? 'Nudge Sent!' : 'Send Nudge'}
      </button>
    </div>
  );
}
