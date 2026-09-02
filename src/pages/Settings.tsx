import { useEffect, useState } from 'react';
import { getSettings, saveSettings, getProfile, saveProfile } from '../db';
import { db } from '../db';
import type { AppSettings, UserProfile } from '../types';
import {
  ProfileIcon, DumbbellIcon, BellIcon, VolumeIcon, MoonIcon,
  ShieldIcon, InfoIcon, LogOutIcon, ChevronRightIcon, ChevronLeftIcon,
} from '../components/icons';

const INJURY_OPTIONS = [
  { key: 'shoulder' as const, label: 'Shoulder' },
  { key: 'knee' as const, label: 'Knee' },
  { key: 'wrist' as const, label: 'Wrist' },
  { key: 'back' as const, label: 'Back' },
];

function WorkoutPreferences({ profile, onClose, onSaved }: { profile: UserProfile; onClose: () => void; onSaved: (p: UserProfile) => void }) {
  const [pullupBar, setPullupBar] = useState(profile.equipment.pullupBar);
  const [resistanceBand, setResistanceBand] = useState(profile.equipment.resistanceBand);
  const [injuries, setInjuries] = useState(profile.injuries);

  async function handleDone() {
    const updated: UserProfile = { ...profile, equipment: { pullupBar, resistanceBand }, injuries };
    await saveProfile(updated);
    onSaved(updated);
    onClose();
  }

  return (
    <div className="flex flex-col min-h-full px-6 py-8 bg-bg-primary animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={onClose} className="text-text-secondary">
          <ChevronLeftIcon size={24} />
        </button>
        <h1 className="text-xl font-bold">Workout Preferences</h1>
      </div>

      <div className="mb-8">
        <h2 className="text-sm text-text-muted mb-4 uppercase tracking-wider">Available Equipment</h2>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-4 p-4 rounded-2xl bg-bg-card border-2 border-border cursor-pointer">
            <input type="checkbox" checked={pullupBar} onChange={e => setPullupBar(e.target.checked)} className="w-5 h-5 rounded accent-purple-accent" />
            <span>Pull-up Bar</span>
          </label>
          <label className="flex items-center gap-4 p-4 rounded-2xl bg-bg-card border-2 border-border cursor-pointer">
            <input type="checkbox" checked={resistanceBand} onChange={e => setResistanceBand(e.target.checked)} className="w-5 h-5 rounded accent-purple-accent" />
            <span>Resistance Band</span>
          </label>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-sm text-text-muted mb-4 uppercase tracking-wider">Any injuries or limitations?</h2>
        <div className="flex flex-wrap gap-3">
          {INJURY_OPTIONS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setInjuries(prev => ({ ...prev, [key]: !prev[key] }))}
              className={`px-4 py-2 rounded-full border-2 transition-all ${
                injuries[key] ? 'border-red-accent bg-red-accent/10 text-red-accent' : 'border-border bg-bg-card text-text-secondary'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1" />
      <button onClick={handleDone} className="w-full py-4 bg-purple-accent text-white font-semibold rounded-2xl text-lg">
        Done
      </button>
    </div>
  );
}

export default function Settings() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [view, setView] = useState<'main' | 'workout-prefs'>('main');

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

  if (view === 'workout-prefs' && profile) {
    return (
      <WorkoutPreferences
        profile={profile}
        onClose={() => setView('main')}
        onSaved={setProfile}
      />
    );
  }

  const items = [
    {
      section: 'Preferences',
      rows: [
        { icon: DumbbellIcon, label: 'Workout Preferences', action: 'chevron' as const, onClick: () => setView('workout-prefs') },
        { icon: BellIcon, label: 'Reminders & Nudges', action: 'chevron' as const },
        {
          icon: VolumeIcon,
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
          icon: MoonIcon,
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
        { icon: ShieldIcon, label: 'Data & Privacy', action: 'chevron' as const },
        { icon: InfoIcon, label: 'About CenturyFit', action: 'chevron' as const },
      ],
    },
  ];

  return (
    <div className="px-5 py-6 animate-fade-in">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-full bg-bg-card flex items-center justify-center">
          <ProfileIcon size={32} />
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
              const value = 'value' in row ? row.value : undefined;
              const onChange = 'onChange' in row ? row.onChange : undefined;
              const onClick = 'onClick' in row ? row.onClick : undefined;
              return (
              <button
                key={label}
                onClick={action === 'toggle' ? onChange : onClick}
                className={`w-full flex items-center gap-4 px-4 py-4 text-left ${
                  i > 0 ? 'border-t border-border/50' : ''
                }`}
              >
                <Icon size={20} />
                <div className="flex-1">
                  <div className="text-sm font-medium">{label}</div>
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
                {action === 'chevron' && <ChevronRightIcon size={18} />}
              </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Danger Zone */}
      <button
        onClick={handleReset}
        className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-bg-card"
      >
        <LogOutIcon size={20} />
        <span className="text-sm font-medium text-red-accent">Reset All Data</span>
      </button>

      <p className="text-center text-text-muted text-xs mt-8">
        CenturyFit v1.0.0
      </p>
    </div>
  );
}
