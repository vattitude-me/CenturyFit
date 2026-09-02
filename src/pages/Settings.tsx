import { useEffect, useState } from 'react';
import { getSettings, saveSettings, getProfile } from '../db';
import { db } from '../db';
import type { AppSettings, UserProfile } from '../types';
import {
  User, Dumbbell, Bell, Volume2, Moon,
  Shield, Info, LogOut, ChevronRight
} from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    Promise.all([getSettings(), getProfile()]).then(([s, p]) => {
      setSettings(s);
      if (p) setProfile(p);
    });
  }, []);

  async function updateSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    if (!settings) return;
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    await saveSettings(updated);
  }

  async function handleReset() {
    if (confirm('This will delete all your data. Are you sure?')) {
      await db.delete();
      window.location.hash = '#/onboarding/welcome';
      window.location.reload();
    }
  }

  if (!settings) return null;

  const items = [
    {
      section: 'Profile',
      rows: [
        {
          icon: User,
          label: profile?.name || 'User',
          sublabel: 'View Profile',
          action: 'chevron' as const,
        },
      ],
    },
    {
      section: 'Preferences',
      rows: [
        { icon: Dumbbell, label: 'Workout Preferences', action: 'chevron' as const },
        { icon: Bell, label: 'Reminders & Nudges', action: 'chevron' as const },
        {
          icon: Volume2,
          label: 'Sound & Haptics',
          action: 'toggle' as const,
          value: settings.soundEnabled,
          onChange: () => updateSetting('soundEnabled', !settings.soundEnabled),
        },
      ],
    },
    {
      section: 'Display',
      rows: [
        {
          icon: Moon,
          label: 'Dark Mode',
          action: 'toggle' as const,
          value: settings.theme === 'dark',
          onChange: () => updateSetting('theme', settings.theme === 'dark' ? 'light' : 'dark'),
        },
      ],
    },
    {
      section: 'About',
      rows: [
        { icon: Shield, label: 'Data & Privacy', action: 'chevron' as const },
        { icon: Info, label: 'About CenturyFit', action: 'chevron' as const },
      ],
    },
  ];

  return (
    <div className="px-5 py-6 animate-fade-in">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-full bg-purple-accent/30 flex items-center justify-center">
          <User size={28} className="text-purple-light" />
        </div>
        <div>
          <h1 className="text-xl font-bold">{profile?.name || 'Athlete'}</h1>
          <p className="text-text-secondary text-sm">View Profile</p>
        </div>
      </div>

      {/* Settings Sections */}
      {items.map(({ section, rows }) => (
        <div key={section} className="mb-6">
          <h2 className="text-xs text-text-muted uppercase tracking-wider mb-3 px-1">{section}</h2>
          <div className="bg-bg-card rounded-2xl overflow-hidden">
            {rows.map((row, i) => {
              const { icon: Icon, label, action } = row;
              const sublabel = 'sublabel' in row ? row.sublabel : undefined;
              const value = 'value' in row ? row.value : undefined;
              const onChange = 'onChange' in row ? row.onChange : undefined;
              return (
              <button
                key={label}
                onClick={action === 'toggle' ? onChange : undefined}
                className={`w-full flex items-center gap-4 px-4 py-4 text-left ${
                  i > 0 ? 'border-t border-border/50' : ''
                }`}
              >
                <Icon size={20} className="text-text-muted" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{label}</div>
                  {sublabel && <div className="text-xs text-text-muted">{sublabel}</div>}
                </div>
                {action === 'toggle' && (
                  <div className={`w-12 h-7 rounded-full transition-colors relative ${
                    value ? 'bg-purple-accent' : 'bg-border'
                  }`}>
                    <div className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </div>
                )}
                {action === 'chevron' && (
                  <ChevronRight size={18} className="text-text-muted" />
                )}
              </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Danger Zone */}
      <button
        onClick={handleReset}
        className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-bg-card text-red-accent"
      >
        <LogOut size={20} />
        <span className="text-sm font-medium">Reset All Data</span>
      </button>

      <p className="text-center text-text-muted text-xs mt-8">
        CenturyFit v1.0.0
      </p>
    </div>
  );
}
