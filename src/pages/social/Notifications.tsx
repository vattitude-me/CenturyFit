import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotifications, markAllNotificationsRead } from '../../db';
import { ChevronLeftIcon, MegaphoneIcon, BellIcon, TrophyIcon, HandshakeIcon } from '../../components/icons';
import type { NotificationItem, NotificationType } from '../../types';

const TYPE_ICON: Record<NotificationType, (props: { size?: number }) => React.ReactNode> = {
  nudge: MegaphoneIcon,
  reminder: BellIcon,
  milestone: TrophyIcon,
  challenge: HandshakeIcon,
};

function timeAgo(ts: number): string {
  const diffMs = Date.now() - ts;
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return 'now';
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h`;
  return `${Math.floor(hr / 24)}d`;
}

export default function Notifications() {
  const navigate = useNavigate();
  const [items, setItems] = useState<NotificationItem[]>([]);

  useEffect(() => {
    getNotifications().then(setItems);
  }, []);

  async function handleMarkAllRead() {
    await markAllNotificationsRead();
    setItems(prev => prev.map(n => ({ ...n, read: true })));
  }

  return (
    <div className="flex flex-col min-h-full bg-bg-primary animate-fade-in">
      <div className="flex items-center justify-between px-5 pt-6 pb-2">
        <button onClick={() => navigate(-1)} className="text-text-secondary">
          <ChevronLeftIcon size={24} />
        </button>
        <h1 className="text-lg font-bold">Notifications</h1>
        <span className="w-6" />
      </div>

      <div className="flex flex-col gap-2 px-5 mt-5 pb-4">
        {items.map(n => {
          const Icon = TYPE_ICON[n.type];
          return (
            <div
              key={n.id}
              className={`flex items-start gap-3 p-4 rounded-2xl ${n.read ? 'bg-bg-card/60' : 'bg-bg-card'}`}
            >
              <Icon size={22} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{n.title}</div>
                <div className="text-text-secondary text-xs mt-0.5">{n.body}</div>
              </div>
              <span className="text-text-muted text-xs shrink-0">{timeAgo(n.createdAt)}</span>
            </div>
          );
        })}
        {items.length === 0 && (
          <p className="text-text-muted text-sm text-center mt-8">You're all caught up.</p>
        )}
      </div>

      <button onClick={handleMarkAllRead} className="text-center text-purple-light text-sm py-4">
        Mark all as read
      </button>
    </div>
  );
}
