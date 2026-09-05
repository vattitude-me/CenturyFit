import { useNavigate } from 'react-router-dom';
import { ChevronLeft, HardDrive, WifiOff, Share2, Trash2 } from 'lucide-react';
import Button from '../components/Button';
import ListRow from '../components/ListRow';
import { resetAllData } from '../db';

export default function DataPrivacy() {
  const navigate = useNavigate();

  const handleReset = async () => {
    await resetAllData();
    // A full reload (not client-side navigate) so every in-memory copy of
    // the now-deleted profile/settings is dropped, not just this page's.
    window.location.href = window.location.origin + window.location.pathname;
  };

  return (
    <div className="route-forward h-full overflow-y-auto flex flex-col px-5.5 pt-4 pb-6 gap-4">
      <div className="flex items-center gap-3">
        <Button variant="icon" onClick={() => navigate(-1)}><ChevronLeft size={18} /></Button>
        <div className="text-[15px] font-medium">Data &amp; privacy</div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="text-[22px] font-medium tracking-[-0.02em]">Your data stays on this phone</div>
        <div className="text-[13.5px] leading-[1.5] text-neutral-400">
          Rungs has no server and no account. Everything you see here is the whole story.
        </div>
      </div>

      <div className="rounded-[14px] bg-surface shadow-sm overflow-hidden">
        <ListRow
          isFirst icon={<HardDrive size={14} />} title="Stored on-device only"
          subtitle="Profile, baseline tests, set logs, streaks: all in this browser's local storage"
        />
        <ListRow
          icon={<WifiOff size={14} />} title="Nothing sent anywhere"
          subtitle="No analytics, no tracking, no network requests for your workout data"
        />
        <ListRow
          icon={<Share2 size={14} />} title="Nothing shared with third parties"
          subtitle="There is no one to share it with: no accounts, no ads, no backend"
        />
      </div>

      <div className="text-[11.5px] leading-[1.5] text-neutral-500">
        Uninstalling the app or clearing this browser's site data deletes it permanently. There's no cloud copy to restore from yet: accounts and sync are planned for a future update.
      </div>

      <div className="flex flex-col gap-1.75 mt-2">
        <span className="text-[11px] tracking-[0.1em] text-neutral-500">DANGER ZONE</span>
        <div className="rounded-[14px] bg-surface shadow-sm overflow-hidden">
          <ListRow
            isFirst icon={<Trash2 size={14} />} title="Delete all data"
            subtitle="Erases your profile and every logged rep, right now"
            trailing={
              <Button variant="secondary" className="h-8 px-3 text-xs flex-none" onClick={handleReset}>
                Delete
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
}
