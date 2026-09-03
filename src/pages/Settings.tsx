import { useEffect, useState } from 'react';
import { Mic, Timer, Vibrate, Bell, Sparkles, Lock, Info } from 'lucide-react';
import Button from '../components/Button';
import Toggle from '../components/Toggle';
import ListRow from '../components/ListRow';
import { getProfile, saveProfile, getSettings, saveSettings, resetAllData } from '../db';
import type { Profile, AppSettings } from '../types';

export default function Settings() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [notifPermission, setNotifPermission] = useState<NotificationPermission | 'unsupported'>(
    'Notification' in window ? Notification.permission : 'unsupported'
  );

  useEffect(() => {
    getProfile().then((p) => setProfile(p ?? null));
    getSettings().then(setSettings);
  }, []);

  if (!profile || !settings) return null;

  const initial = (profile.name.trim()[0] || 'A').toUpperCase();

  const saveName = async () => {
    const n = nameDraft.trim().slice(0, 24);
    const next = { ...profile, name: n || profile.name };
    setProfile(next);
    await saveProfile(next);
    setEditingName(false);
  };

  const updateSetting = async (patch: Partial<AppSettings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    await saveSettings(next);
  };

  const toggleReminders = async () => {
    if (!settings.reminders) {
      if (notifPermission === 'unsupported') return;
      if (notifPermission !== 'granted') {
        const result = await Notification.requestPermission();
        setNotifPermission(result);
        if (result !== 'granted') return;
      }
    }
    await updateSetting({ reminders: !settings.reminders });
  };

  const handleReset = async () => {
    await resetAllData();
    window.location.reload();
  };

  return (
    <div className="flex-1 h-full overflow-y-auto flex flex-col px-5 pt-4 pb-24 gap-3.75">
      <div className="flex items-center gap-3.25">
        <span className="w-13 h-13 flex-none rounded-2xl bg-accent-800 grid place-items-center text-[19px] font-medium text-accent-100">
          {initial}
        </span>
        {!editingName ? (
          <span className="flex-1 flex items-center gap-2.5">
            <span className="flex-1 flex flex-col gap-px">
              <span className="text-[17px] font-medium">{profile.name}</span>
              <span className="text-[11.5px] text-neutral-500">This phone only</span>
            </span>
            <Button
              variant="secondary" className="h-8.5 px-3.5 text-xs flex-none"
              onClick={() => { setNameDraft(profile.name); setEditingName(true); }}
            >
              Edit
            </Button>
          </span>
        ) : (
          <span className="flex-1 flex flex-col gap-1.75">
            <span className="flex items-center gap-2">
              <input
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditingName(false); }}
                placeholder="Your name"
                maxLength={24}
                className="flex-1 h-9.5 px-2.5 rounded-lg bg-surface border border-neutral-800 text-sm text-text outline-none focus-visible:border-accent"
              />
              <Button variant="primary" className="h-9.5 px-3.5 flex-none" onClick={saveName}>Save</Button>
            </span>
            <span className="text-[11px] text-neutral-600">Stays on this phone. Used in greetings and, later, in Squad.</span>
          </span>
        )}
      </div>

      <div className="p-3.5 rounded-2xl bg-accent-900 flex flex-col gap-2.25">
        <div className="flex items-center gap-2.25">
          <span className="text-sm text-accent">☁</span>
          <span className="text-[13.5px] font-medium text-accent-100">Accounts &amp; sync: coming soon</span>
        </div>
        <div className="text-xs leading-[1.5] text-accent-200">
          Everything lives on your device today, no sign-up, no upload. When sync lands, your history merges into the account. Nothing to re-enter.
        </div>
      </div>

      <div className="flex flex-col gap-1.75">
        <span className="text-[11px] tracking-[0.1em] text-neutral-500">COUNTER</span>
        <div className="rounded-[14px] bg-surface shadow-sm overflow-hidden">
          <ListRow
            isFirst icon={<Mic size={14} />} title="Voice count" subtitle="Says every rep out loud"
            trailing={<Toggle size="dense" on={settings.voice} onToggle={() => updateSetting({ voice: !settings.voice })} />}
          />
          <ListRow
            icon={<Timer size={14} />} title="Metronome ticks" subtitle="Down / up cue tones"
            trailing={<Toggle size="dense" on={settings.ticks} onToggle={() => updateSetting({ ticks: !settings.ticks })} />}
          />
          <ListRow
            icon={<Vibrate size={14} />} title="Haptics" subtitle="A pulse per rep"
            trailing={<Toggle size="dense" on={settings.haptics} onToggle={() => updateSetting({ haptics: !settings.haptics })} />}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.75">
        <span className="text-[11px] tracking-[0.1em] text-neutral-500">REMINDERS</span>
        <div className="rounded-[14px] bg-surface shadow-sm overflow-hidden">
          <ListRow
            isFirst icon={<Bell size={14} />} title="Window reminders"
            subtitle={
              notifPermission === 'unsupported'
                ? 'Not supported in this browser'
                : notifPermission === 'denied'
                  ? 'Blocked — enable in browser settings'
                  : '5 minutes before each window, while the app is open'
            }
            trailing={
              <Toggle
                size="dense"
                on={settings.reminders && notifPermission === 'granted'}
                onToggle={toggleReminders}
              />
            }
          />
          <ListRow icon={<Sparkles size={14} />} title="Motivational nudges" subtitle="Playful, max two a day" trailing={<span className="text-[13px] text-neutral-600">›</span>} />
          <ListRow icon={<Lock size={14} />} title="Data & privacy" subtitle="On-device, export any time" trailing={<span className="text-[13px] text-neutral-600">›</span>} />
          <ListRow icon={<Info size={14} />} title="About Hundred" subtitle={`v${__APP_VERSION__} · free forever`} trailing={<span className="text-[13px] text-neutral-600">›</span>} />
        </div>
      </div>

      <Button variant="ghost" block className="h-10 text-neutral-500" onClick={handleReset}>Reset all data</Button>

      <div className="text-[11.5px] leading-[1.5] text-neutral-600 text-center pt-1">
        Hundred is free forever. No ads, no paywall,<br />no locked exercises.
      </div>
    </div>
  );
}
