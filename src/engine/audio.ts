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

// ---------------------------------------------------------------------------
// Speech
//
// Android WebView is much fussier than desktop browsers here:
//   - getVoices() is empty until the TTS engine loads, and speaking before a
//     voice exists silently drops the utterance with no error.
//   - cancel() immediately followed by speak() in the same tick kills the new
//     utterance too, so we must never cancel-then-speak synchronously.
//   - The engine can wedge in a "speaking" state; onend doesn't always fire,
//     so the busy flag needs a timeout-based release rather than trusting it.
// ---------------------------------------------------------------------------

let voicesReady = false;
let preferredVoice: SpeechSynthesisVoice | null = null;

function pickVoice(): void {
  if (!('speechSynthesis' in window)) return;
  const voices = speechSynthesis.getVoices();
  if (voices.length === 0) return;
  voicesReady = true;
  preferredVoice =
    voices.find((v) => v.lang.startsWith('en') && v.localService) ??
    voices.find((v) => v.lang.startsWith('en')) ??
    voices[0];
}

/** Warms up the TTS engine. Must be called from a user gesture on Android -
 * the first utterance after a tap is what unblocks the engine. */
export function primeSpeech(): void {
  if (!('speechSynthesis' in window)) return;
  pickVoice();
  if (!voicesReady) {
    speechSynthesis.addEventListener('voiceschanged', pickVoice, { once: true });
  }
  try {
    // A near-silent utterance to unlock the engine within the gesture.
    const u = new SpeechSynthesisUtterance(' ');
    u.volume = 0.01;
    speechSynthesis.speak(u);
  } catch {
    // speechSynthesis unavailable
  }
}

let speaking = false;
let speakingTimer: ReturnType<typeof setTimeout> | null = null;

function markSpeaking(estimatedMs: number): void {
  speaking = true;
  if (speakingTimer) clearTimeout(speakingTimer);
  // Fallback release - Android's onend is unreliable, and a stuck flag would
  // silence every subsequent count for the rest of the set.
  speakingTimer = setTimeout(() => { speaking = false; }, estimatedMs);
}

function speak(text: string, estimatedMs: number): void {
  if (!('speechSynthesis' in window)) return;
  try {
    if (!voicesReady) pickVoice();
    const u = new SpeechSynthesisUtterance(text);
    if (preferredVoice) u.voice = preferredVoice;
    u.lang = preferredVoice?.lang ?? 'en-US';
    u.rate = 1.15;
    u.volume = 1;
    u.onend = () => { speaking = false; };
    u.onerror = () => { speaking = false; };
    markSpeaking(estimatedMs);
    speechSynthesis.speak(u);
  } catch {
    speaking = false;
  }
}

/** Speaks the rep count. Skips the count if the previous utterance is likely
 * still in flight; below 1.0s/rep, speaks only every other rep. */
export function speakCount(n: number, tempo: number): void {
  if (!('speechSynthesis' in window)) return;
  if (tempo < 1.0 && n % 2 !== 0) return;
  // Never cancel-then-speak on Android; just skip this count instead.
  if (speaking) return;
  speak(String(n), 700);
}

const MILESTONE_PHRASES = {
  halfway: 'Halfway',
  threeLeft: 'Three more',
  complete: 'Set complete',
} as const;

export function speakMilestone(kind: keyof typeof MILESTONE_PHRASES): void {
  speak(MILESTONE_PHRASES[kind], 1200);
}

/** Stops any queued speech - used when leaving a session. */
export function stopSpeech(): void {
  if (!('speechSynthesis' in window)) return;
  try {
    speechSynthesis.cancel();
  } catch {
    // no-op
  }
  speaking = false;
  if (speakingTimer) clearTimeout(speakingTimer);
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
