import Dexie, { type Table } from 'dexie';
import type {
  UserProfile, Baseline, DailyPlan, SetLog, DayRecord, AppSettings, StreakData,
  Friend, Challenge, NotificationItem,
} from '../types';

class CenturyFitDB extends Dexie {
  profile!: Table<UserProfile, string>;
  baselines!: Table<Baseline, string>;
  dailyPlans!: Table<DailyPlan, string>;
  setLogs!: Table<SetLog, string>;
  dayRecords!: Table<DayRecord, string>;
  settings!: Table<AppSettings, string>;
  streaks!: Table<StreakData, string>;
  friends!: Table<Friend, string>;
  challenges!: Table<Challenge, string>;
  notifications!: Table<NotificationItem, string>;

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
    this.version(2).stores({
      friends: 'id, points, status',
      challenges: 'id, status',
      notifications: 'id, createdAt, read',
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

export async function getFriends(): Promise<Friend[]> {
  return db.friends.orderBy('points').reverse().toArray();
}

export async function saveFriend(friend: Friend): Promise<void> {
  await db.friends.put(friend);
}

export async function getChallenges(): Promise<Challenge[]> {
  return db.challenges.toArray();
}

export async function saveChallenge(challenge: Challenge): Promise<void> {
  await db.challenges.put(challenge);
}

export async function getNotifications(): Promise<NotificationItem[]> {
  return db.notifications.orderBy('createdAt').reverse().toArray();
}

export async function markNotificationRead(id: string): Promise<void> {
  await db.notifications.update(id, { read: true });
}

export async function markAllNotificationsRead(): Promise<void> {
  const all = await db.notifications.toArray();
  await Promise.all(all.map(n => db.notifications.update(n.id, { read: true })));
}

const SAMPLE_FRIENDS: Friend[] = [
  { id: 'f_mike', name: 'Mike', username: '@mikefit', points: 1250, streak: 14, status: 'accepted', lastActivityText: 'Just completed 100 Pushups', lastActivityAt: Date.now() - 2 * 60 * 1000 },
  { id: 'f_sarah', name: 'Sarah', username: '@sarahstrong', points: 1180, streak: 9, status: 'accepted', lastActivityText: 'Completed daily goals — 100 Pullups', lastActivityAt: Date.now() - 15 * 60 * 1000 },
  { id: 'f_john', name: 'John', username: '@johnathlete', points: 1050, streak: 21, status: 'accepted', lastActivityText: 'Hit a new record — 120 Squats', lastActivityAt: Date.now() - 60 * 60 * 1000 },
  { id: 'f_emma', name: 'Emma', username: '@emma.lifts', points: 870, streak: 5, status: 'accepted', lastActivityText: 'Joined the 7 Day Consistency challenge', lastActivityAt: Date.now() - 3 * 60 * 60 * 1000 },
  { id: 'f_david', name: 'David', username: '@davidbuilds', points: 720, streak: 3, status: 'accepted', lastActivityText: 'Completed daily goals', lastActivityAt: Date.now() - 5 * 60 * 60 * 1000 },
];

const SAMPLE_CHALLENGES: Challenge[] = [
  { id: 'c_consistency', name: '7 Day Consistency', description: 'Complete all daily goals for 7 days', exercise: 'all', goal: 7, progress: 5, unit: 'days', status: 'active' },
  { id: 'c_pushup_master', name: 'Pushup Master', description: 'Do 1,000 pushups this week', exercise: 'pushups', goal: 1000, progress: 672, unit: 'reps', status: 'active' },
];

const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  { id: 'n_nudge', type: 'nudge', title: 'Nudge', body: 'Sarah nudged you — you got this!', createdAt: Date.now() - 2 * 60 * 1000, read: false },
  { id: 'n_reminder', type: 'reminder', title: 'Reminder', body: 'You have a workout scheduled at 5:30 PM', createdAt: Date.now() - 60 * 60 * 1000, read: false },
  { id: 'n_milestone', type: 'milestone', title: 'Milestone', body: 'You reached a 10 day streak!', createdAt: Date.now() - 3 * 60 * 60 * 1000, read: true },
  { id: 'n_challenge', type: 'challenge', title: 'Challenge', body: 'Mike completed 7 Day Consistency', createdAt: Date.now() - 5 * 60 * 60 * 1000, read: true },
];

export async function seedSocialDataIfEmpty(): Promise<void> {
  const [friendCount, challengeCount, notifCount] = await Promise.all([
    db.friends.count(),
    db.challenges.count(),
    db.notifications.count(),
  ]);
  if (friendCount === 0) await db.friends.bulkPut(SAMPLE_FRIENDS);
  if (challengeCount === 0) await db.challenges.bulkPut(SAMPLE_CHALLENGES);
  if (notifCount === 0) await db.notifications.bulkPut(SAMPLE_NOTIFICATIONS);
}
