// Module-level AudioContext to ensure it's initialized on first user gesture
let audioContext: AudioContext | null = null

/**
 * Initialize the AudioContext on user gesture
 */
export function getAudioContext(): AudioContext {
  if (!audioContext) {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    audioContext = new AudioCtx()
  }

  // Resume context if suspended (common in mobile browsers)
  if (audioContext.state === 'suspended') {
    audioContext.resume()
  }

  return audioContext
}

/**
 * Play a high-precision beep using Web Audio API
 */
export function playBeep(frequency = 880, duration = 0.05, type: OscillatorType = 'sine') {
  try {
    const ctx = getAudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = type
    osc.frequency.setValueAtTime(frequency, ctx.currentTime)

    // Quick attack and exponential decay to prevent audio pops
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + duration)
  } catch (err) {
    console.warn('Web Audio error:', err)
  }
}

/**
 * Play a distinctive completion chime (major chord sequence)
 */
export function playCompletionChime() {
  try {
    const ctx = getAudioContext()
    const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6

    notes.forEach((freq, index) => {
      const startTime = ctx.currentTime + index * 0.08
      const duration = 0.25

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, startTime)

      gain.gain.setValueAtTime(0.25, startTime)
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(startTime)
      osc.stop(startTime + duration)
    })
  } catch (err) {
    console.warn('Chime audio error:', err)
  }
}

/**
 * Play a subtle rest interval tick
 */
export function playRestTick() {
  playBeep(440, 0.03, 'sine')
}