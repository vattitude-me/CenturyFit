import Dexie, { type Table } from 'dexie';
import type { UserProfile, Baseline, DailyPlan, SetLog, DayRecord, AppSettings, StreakData } from '../types';

class CenturyFitDB extends Dexie {
  profile!: Table<UserProfile, string>;
  baselines!: Table<Baseline, string>;
  dailyPlans!: Table<DailyPlan, string>;
  setLogs!: Table<SetLog, string>;
  dayRecords!: Table<DayRecord, string>;
  settings!: Table<AppSettings, string>;
  streaks!: Table<StreakData, string>;

  constructor() {
    super('centuryfit');
    this.version(1).stores({
      profile: 'id',
      baselines: 'exercise, testedAt',
      dailyPlans: 'id, date, exercise, [date+exercise]',
      setLogs: 'id, date, exercise, completedAt',
      dayRecords: 'date',
      settings: 'theme',
      streaks: 'current',
    });
  }
}

export const db = new CenturyFitDB();

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  soundEnabled: true,
  voiceCuesEnabled: true,
  vibrationEnabled: true,
  defaultTempo: 1.0,
  defaultCountMode: 'metronome',
  defaultRestTime: 60,
};

export async function getProfile(): Promise<UserProfile | undefined> {
  return db.profile.toCollection().first();
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  await db.profile.put(profile);
}

export async function getBaselines(): Promise<Baseline[]> {
  return db.baselines.toArray();
}

export async function saveBaseline(baseline: Baseline): Promise<void> {
  await db.baselines.put(baseline);
}

export async function getDailyPlans(date: string): Promise<DailyPlan[]> {
  return db.dailyPlans.where('date').equals(date).toArray();
}

export async function saveDailyPlan(plan: DailyPlan): Promise<void> {
  await db.dailyPlans.put(plan);
}

export async function getSetLogs(date: string): Promise<SetLog[]> {
  return db.setLogs.where('date').equals(date).toArray();
}

export async function saveSetLog(log: SetLog): Promise<void> {
  await db.setLogs.put(log);
}

export async function getDayRecord(date: string): Promise<DayRecord | undefined> {
  return db.dayRecords.get(date);
}

export async function saveDayRecord(record: DayRecord): Promise<void> {
  await db.dayRecords.put(record);
}

export async function getSettings(): Promise<AppSettings> {
  const s = await db.settings.toCollection().first();
  return s ?? DEFAULT_SETTINGS;
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await db.settings.put(settings);
}

export async function getStreak(): Promise<StreakData> {
  const s = await db.streaks.toCollection().first();
  return s ?? { current: 0, longest: 0, freezesRemaining: 3, lastActiveDate: '' };
}

export async function saveStreak(streak: StreakData): Promise<void> {
  await db.streaks.put(streak);
}

export async function getAllDayRecords(): Promise<DayRecord[]> {
  return db.dayRecords.toArray();
}
