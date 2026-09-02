import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { HomeIcon, PlanIcon, AddIcon, ProgressIcon, ProfileIcon } from './icons';

const NAV_ITEMS = [
  { path: '/today', label: 'Today', icon: HomeIcon },
  { path: '/plan', label: 'Plan', icon: PlanIcon },
  { path: '__quick__', label: '', icon: AddIcon },
  { path: '/progress', label: 'Progress', icon: ProgressIcon },
  { path: '/settings', label: 'Profile', icon: ProfileIcon },
] as const;

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-bg-secondary/90 backdrop-blur-xl border-t border-border/60 safe-bottom z-50">
        <div className="flex items-center justify-around max-w-lg mx-auto h-[68px]">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
            if (path === '__quick__') {
              return (
                <button
                  key={path}
                  onClick={() => navigate('/today')}
                  className="w-14 h-14 -mt-7 rounded-full flex items-center justify-center shadow-lg shadow-purple-accent/40 active:scale-95 transition-transform"
                >
                  <Icon size={56} />
                </button>
              );
            }
            const active = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="flex flex-col items-center gap-1 px-4 py-2"
              >
                <span className={active ? 'opacity-100' : 'opacity-45'}>
                  <Icon size={22} />
                </span>
                <span className={`text-[10px] font-medium ${active ? 'text-text-primary' : 'text-text-muted'}`}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
