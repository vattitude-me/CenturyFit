import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, CalendarDays, Plus, TrendingUp, User } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/today', label: 'Today', icon: Home },
  { path: '/plan', label: 'Plan', icon: CalendarDays },
  { path: '__quick__', label: '', icon: Plus },
  { path: '/progress', label: 'Progress', icon: TrendingUp },
  { path: '/settings', label: 'Profile', icon: User },
] as const;

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-bg-secondary/95 backdrop-blur-md border-t border-border safe-bottom z-50">
        <div className="flex items-center justify-around max-w-lg mx-auto h-16">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
            if (path === '__quick__') {
              return (
                <button
                  key={path}
                  onClick={() => navigate('/today')}
                  className="w-14 h-14 -mt-6 rounded-full bg-purple-accent flex items-center justify-center shadow-lg shadow-purple-accent/30"
                >
                  <Plus size={28} className="text-white" strokeWidth={2.5} />
                </button>
              );
            }
            const active = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                  active ? 'text-purple-accent' : 'text-text-muted'
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 1.5} />
                <span className="text-[10px] font-medium">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
