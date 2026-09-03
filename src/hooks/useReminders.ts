import { useEffect } from 'react';
import { getProfile, getSettings } from '../db';
import { generateDayPlan } from '../engine/planGenerator';
import { localDate, dayIndexFor, timeToMinutes, nowMinutes } from '../engine/dates';
import { EXERCISE_LABELS } from '../types';

const CHECK_INTERVAL_MS = 30_000;
const LEAD_MINUTES = 5;

/** Polls the day's plan while the app is open and fires a Notification
 * ~5 minutes before each pending window, once per window. */
export function useReminders() {
  useEffect(() => {
    const fired = new Set<string>();

    const check = async () => {
      const settings = await getSettings();
      if (!settings.reminders) return;
      if (!('Notification' in window) || Notification.permission !== 'granted') return;

      const profile = await getProfile();
      if (!profile) return;

      const today = localDate();
      const dayIndex = dayIndexFor(profile.createdAt, today);
      const plan = await generateDayPlan(today, dayIndex, profile);

      const nowMin = nowMinutes();

      for (const w of plan.windows) {
        if (w.status !== 'pending' && w.status !== 'reflowed') continue;
        const key = `${today}-${w.id}`;
        if (fired.has(key)) continue;

        const minutesUntil = timeToMinutes(w.at) - nowMin;
        if (minutesUntil <= LEAD_MINUTES && minutesUntil >= 0) {
          const item = w.items[0];
          const body = item ? `${item.reps} ${EXERCISE_LABELS[item.exercise].toLowerCase()} at ${w.at}` : `Window at ${w.at}`;
          new Notification('Coming up', { body, tag: key });
          fired.add(key);
        }
      }
    };

    check();
    const id = setInterval(check, CHECK_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);
}
