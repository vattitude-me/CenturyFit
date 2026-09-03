import Dexie, { type Table } from 'dexie';
import type {
  Profile, BaselineLog, DayPlan, SetLog, DayRecord, AppSettings, StreakData,
} from '../types';

class HundredDB extends Dexie {
  profile!: Table<Profile, string>;
  baselineLogs!: Table<BaselineLog, string>;
  dayPlans!: Table<DayPlan, string>;
  setLogs!: Table<SetLog, string>;
  dayRecords!: Table<DayRecord, string>;
  settings!: Table<AppSettings, string>;
  streaks!: Table<StreakData, string>;

  constructor() {
    super('hundred');
    this.version(1).stores({
      profile: 'id',
      baselineLogs: 'id, exercise, testedAt',
      dayPlans: 'id, date',
      setLogs: 'id, date, exercise, completedAt',
      dayRecords: 'date',
      settings: 'defaultTempo',
      streaks: 'current',
    });
  }
}

export const db = new HundredDB();

const DEFAULT_SETTINGS: AppSettings = {
  counterVariant: 'cadenceRing',
  dashboardVariant: 'rings',
  voice: true,
  ticks: true,
  haptics: true,
  reminders: false,
  nudges: false,
  waitlistSquad: false,
  defaultTempo: 2.5,
};

const DEFAULT_STREAK: StreakData = {
  current: 0,
  longest: 0,
  lastActiveDate: '',
  graceDaysUsedInWindow: 0,
  windowStartDate: '',
};

/** Fills in fields added after a profile was first written, so an install from
 * before the tier model doesn't come back with an undefined tier and render a
 * NaN goal. */
function migrateProfile(profile: Profile): Profile {
  if (profile.tier && profile.tierStartedAt) return profile;
  const createdDate = new Date(profile.createdAt || Date.now());
  const iso = createdDate.toISOString().slice(0, 10);
  return {
    ...profile,
    tier: profile.tier ?? 100,
    tierStartedAt: profile.tierStartedAt || iso,
  };
}

export async function getProfile(): Promise<Profile | undefined> {
  const profile = await db.profile.toCollection().first();
  return profile ? migrateProfile(profile) : undefined;
}

export async function saveProfile(profile: Profile): Promise<void> {
  await db.profile.put(profile);
}

export async function getBaselineLogs(): Promise<BaselineLog[]> {
  return db.baselineLogs.orderBy('testedAt').toArray();
}

export async function saveBaselineLog(log: BaselineLog): Promise<void> {
  await db.baselineLogs.put(log);
}

export async function getDayPlan(date: string): Promise<DayPlan | undefined> {
  return db.dayPlans.where('date').equals(date).first();
}

export async function saveDayPlan(plan: DayPlan): Promise<void> {
  await db.dayPlans.put(plan);
}

export async function getSetLogs(date: string): Promise<SetLog[]> {
  return db.setLogs.where('date').equals(date).toArray();
}

export async function getAllSetLogs(): Promise<SetLog[]> {
  return db.setLogs.toArray();
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

export async function getAllDayRecords(): Promise<DayRecord[]> {
  return db.dayRecords.toArray();
}

export async function getSettings(): Promise<AppSettings> {
  const s = await db.settings.toCollection().first();
  return s ? { ...DEFAULT_SETTINGS, ...s } : DEFAULT_SETTINGS;
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await db.settings.put(settings);
}

export async function getStreak(): Promise<StreakData> {
  const s = await db.streaks.toCollection().first();
  return s ?? DEFAULT_STREAK;
}

export async function saveStreak(streak: StreakData): Promise<void> {
  await db.streaks.put(streak);
}

export async function resetAllData(): Promise<void> {
  await db.delete();
}
