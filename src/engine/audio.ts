let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function tone(frequency: number, duration: number, gainLevel = 0.25): void {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = frequency;
  osc.type = 'sine';
  gain.gain.setValueAtTime(gainLevel, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

/** Metronome tick: lower tone on the down phase, higher on up. ~40-60ms, -12dBFS. */
export function playTick(phase: 'down' | 'up'): void {
  tone(phase === 'down' ? 440 : 660, 0.05, 0.22);
}

export function playComplete(): void {
  const ctx = getAudioContext();
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = 'sine';
    const startTime = ctx.currentTime + i * 0.12;
    gain.gain.setValueAtTime(0.25, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
    osc.start(startTime);
    osc.stop(startTime + 0.3);
  });
}

let speaking = false;

/** Speaks the rep count. At tempo < 1.5s/rep, skips if the previous utterance
 * hasn't finished. Below 1.0s/rep, speaks only every other rep. */
export function speakCount(n: number, tempo: number): void {
  if (!('speechSynthesis' in window)) return;
  if (tempo < 1.5 && speaking) return;
  if (tempo < 1.0 && n % 2 !== 0) return;

  try {
    const u = new SpeechSynthesisUtterance(String(n));
    u.rate = 1.15;
    u.volume = 0.9;
    u.onstart = () => { speaking = true; };
    u.onend = () => { speaking = false; };
    u.onerror = () => { speaking = false; };
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  } catch {
    // speechSynthesis unavailable
  }
}

const MILESTONE_PHRASES = {
  halfway: 'Halfway',
  threeLeft: 'Three more',
  complete: 'Set complete',
} as const;

export function speakMilestone(kind: keyof typeof MILESTONE_PHRASES): void {
  if (!('speechSynthesis' in window)) return;
  try {
    const u = new SpeechSynthesisUtterance(MILESTONE_PHRASES[kind]);
    u.rate = 1.15;
    u.volume = 0.9;
    speechSynthesis.speak(u);
  } catch {
    // speechSynthesis unavailable
  }
}

export function vibrate(pattern: number | number[] = 50): void {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}

let wakeLock: WakeLockSentinel | null = null;

export async function requestWakeLock(): Promise<void> {
  try {
    if ('wakeLock' in navigator) {
      wakeLock = await navigator.wakeLock.request('screen');
    }
  } catch {
    // Wake lock request failed (e.g., tab not visible)
  }
}

export async function releaseWakeLock(): Promise<void> {
  if (wakeLock) {
    await wakeLock.release();
    wakeLock = null;
  }
}
