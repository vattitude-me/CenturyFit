import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, LineChart, Plus } from 'lucide-react';

const TABS = [
  { path: '/today', label: 'Home', Icon: Home },
  { path: '/progress', label: 'Progress', Icon: LineChart },
] as const;

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col h-full">
      <main key={location.pathname} className="route-tab flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <nav
        className="absolute left-0 right-0 bottom-0 h-[84px] px-3.5 pb-5 flex items-center justify-between safe-bottom"
        style={{
          background: 'linear-gradient(to top, rgba(22,24,38,.98) 55%, rgba(22,24,38,0))',
          backdropFilter: 'blur(8px)',
        }}
      >
        {(() => {
          const { path, label, Icon } = TABS[0];
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex-1 flex flex-col items-center gap-[3px] cursor-pointer"
              style={{ color: active ? '#d2cefd' : '#75798c' }}
            >
              <Icon size={18} strokeWidth={2} />
              <span className="text-[9.5px] tracking-[0.02em]">{label}</span>
            </button>
          );
        })()}

        <button
          onClick={() => navigate('/session/log')}
          aria-label="Log reps"
          className="flex-none w-15 h-15 -mt-6 rounded-full bg-accent grid place-items-center cursor-pointer shadow-lg"
          style={{ boxShadow: '0 6px 20px rgba(145,132,217,.45)' }}
        >
          <Plus size={26} strokeWidth={2.5} color="#161826" />
        </button>

        {(() => {
          const { path, label, Icon } = TABS[1];
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex-1 flex flex-col items-center gap-[3px] cursor-pointer"
              style={{ color: active ? '#d2cefd' : '#75798c' }}
            >
              <Icon size={18} strokeWidth={2} />
              <span className="text-[9.5px] tracking-[0.02em]">{label}</span>
            </button>
          );
        })()}
      </nav>
    </div>
  );
}
