import type { Exercise } from '../types';

const RAW_BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises';

export interface ExerciseReference {
  name: string;
  instructions: string[];
  video: string;
  images: string[];
  source: string;
  sourceLabel: string;
}

/** Video demos are our own footage in public/videos/. Instructions/fallback
 * images are public-domain data from yuhonas/free-exercise-db, linked
 * directly rather than embedded. */
export const EXERCISE_REFERENCE: Record<Exercise, ExerciseReference> = {
  push: {
    name: 'Push-ups',
    instructions: [
      'Lie face down and place your hands about shoulder-width apart, holding your torso up at arm’s length.',
      'Lower yourself until your chest nearly touches the floor while inhaling.',
      'Press back up to the start while exhaling, squeezing your chest at the top.',
    ],
    video: '/videos/push.mp4',
    images: [`${RAW_BASE}/Pushups/0.jpg`, `${RAW_BASE}/Pushups/1.jpg`],
    source: 'https://github.com/yuhonas/free-exercise-db',
    sourceLabel: 'Free Exercise DB (public domain)',
  },
  pull: {
    name: 'Pull-ups',
    instructions: [
      'Grab the bar with palms facing forward, hands a little wider than shoulder-width.',
      'Pull your torso up until the bar reaches your upper chest, squeezing your back at the top.',
      'Lower back down under control until your arms are fully extended.',
    ],
    video: '/videos/pull.mp4',
    images: [`${RAW_BASE}/Pullups/0.jpg`, `${RAW_BASE}/Pullups/1.jpg`],
    source: 'https://github.com/yuhonas/free-exercise-db',
    sourceLabel: 'Free Exercise DB (public domain)',
  },
  squat: {
    name: 'Squats',
    instructions: [
      'Stand with feet shoulder-width apart. This is your starting position.',
      'Flex your knees and hips, sitting back as if into a chair, keeping your chest up.',
      'Go as deep as you comfortably can, then reverse the motion back to standing.',
    ],
    video: '/videos/squat.mp4',
    images: [`${RAW_BASE}/Bodyweight_Squat/0.jpg`, `${RAW_BASE}/Bodyweight_Squat/1.jpg`],
    source: 'https://github.com/yuhonas/free-exercise-db',
    sourceLabel: 'Free Exercise DB (public domain)',
  },
};
