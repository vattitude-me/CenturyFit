import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, LineChart, Users, CircleUser } from 'lucide-react';

const TABS = [
  { path: '/today', label: 'Today', Icon: Home },
  { path: '/progress', label: 'Progress', Icon: LineChart },
  { path: '/squad', label: 'Squad', Icon: Users },
  { path: '/settings', label: 'You', Icon: CircleUser },
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
        {TABS.map(({ path, label, Icon }) => {
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
        })}
      </nav>
    </div>
  );
}
