import { useEffect, useState, type ReactNode } from 'react';

function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 501px)').matches
  );

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 501px)');
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return isDesktop;
}

function useClock(): string {
  const format = (d: Date) => d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const [time, setTime] = useState(() => format(new Date()));

  useEffect(() => {
    const id = setInterval(() => setTime(format(new Date())), 15_000);
    return () => clearInterval(id);
  }, []);

  return time;
}

function StatusBar() {
  const time = useClock();
  return (
    <div className="flex-none flex items-center justify-between px-6 pt-3.5 pb-1.5 text-[12.5px] font-semibold text-text">
      <span>{time}</span>
      <div className="flex items-center gap-1">
        <span className="block w-4 h-2.5 rounded-sm border border-text/60" />
        <span className="block w-5.5 h-2.5 rounded-[3px] border border-text/60 relative">
          <i className="absolute inset-[1.5px] right-1.5 bg-text rounded-[1px] block" />
        </span>
      </div>
    </div>
  );
}

interface PhoneFrameProps {
  children: ReactNode;
}

export default function PhoneFrame({ children }: PhoneFrameProps) {
  const isDesktop = useIsDesktop();

  if (!isDesktop) {
    return (
      <div className="w-full h-[100dvh] bg-bg text-text flex flex-col overflow-hidden">
        <StatusBar />
        <div className="flex-1 overflow-hidden relative">{children}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0b0c14] p-8">
      <div
        className="relative flex-none overflow-hidden"
        style={{
          width: 412,
          height: 866,
          padding: 11,
          borderRadius: 46,
          background: 'linear-gradient(160deg, #2b2e3d, #15171f)',
          boxShadow: '0 26px 70px rgba(0,0,0,.7)',
        }}
      >
        <div className="w-full h-full rounded-[36px] overflow-hidden bg-bg text-text flex flex-col relative isolate">
          <StatusBar />
          <div className="flex-1 overflow-hidden relative">{children}</div>
        </div>
        <div
          className="absolute left-1/2 bottom-1.5 -translate-x-1/2 rounded-full"
          style={{ width: 120, height: 4, background: 'rgba(233,233,237,.35)' }}
        />
      </div>
    </div>
  );
}
