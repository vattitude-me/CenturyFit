# Rep counter — modes, cadence, audio, haptics

The counter is the app. Design assumption: **the phone is on the floor face-down, or across the room.** Audio leads; the screen confirms.

## Modes

| Mode | How it counts | Default |
| --- | --- | --- |
| **Voice-led cadence** | The app calls the tempo (`down` / `up`) and speaks each rep number; the user follows it. No sensing — the count is what the app called. | ✅ default |
| **Camera auto** | On-device pose detection counts real reps; the cadence still plays as a pacer. Falls back to voice-led if the camera is denied, occluded, or confidence drops for 3 reps. | opt-in |
| **Tap to count** | Tap anywhere on the counter, or a volume/headset button, to add a rep. Always available as a silent fallback. | always on |

Modes are switchable **mid-set** without losing the count. Manual `±` is present in every mode.

## Cadence engine

- `tempo` = seconds per full rep, 1.00–4.00, step 0.25, default **2.00**.
- Phase flips every `tempo / 2` seconds: `down → up → down …`
- A rep increments on the flip **into `down`** (the start of a new rep).
- Changing tempo mid-set re-times the next interval immediately; the count is untouched.
- Reaching `target` ends the set automatically and banks the reps.
- Pause freezes phase and count; resume restarts on the next `down`.

Prototype reference: `Component.tick()` / `run()` in `Hundred Reps Coach.dc.html`.

## Audio contract

Three layers, independently toggleable in Settings → Counter:

1. **Voice count** (default on) — speaks the rep number. Native: `AVSpeechSynthesizer` / Android `TextToSpeech`. PWA: `speechSynthesis`. Rate ~1.15, and **skip the utterance if the previous one hasn't finished** at fast tempos (below ~1.5 s/rep, speak every rep but truncate to the numeral; below 1.0 s/rep, speak every other rep).
2. **Metronome ticks** (default on) — two short tones, lower on `down`, higher on `up`. 40–60ms, sine, −12 dBFS.
3. **Milestone calls** — at halfway, 3 reps out, and completion ("halfway", "three more", "set complete").

Audio session rules:
- Duck other audio, don't stop it — the user is on a podcast or music. iOS: `.duckOthers`; Android: `AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK`.
- Keep playing with the screen locked and in the background: iOS background audio mode, Android foreground service. PWA cannot guarantee this — see `05-roadmap-flags.md`.
- Route to headphones/Bluetooth when connected; keep latency under ~120ms or the cadence feels wrong.

## Haptics

One pulse per rep (light impact), a double pulse at the halfway milestone, a success pattern at set end. Off by default on Android below API 29 (weak actuators). Never the *only* rep confirmation — always paired with audio or the numeral.

## Screen behaviour during a set

- Keep-awake on for the duration of the set; release on exit.
- The count area is one large tap target (the full counter block) — no small buttons needed mid-set.
- Accessibility: the live count is an `aria-live="polite"` region announcing only the numeral; the cadence cue is decorative and `aria-hidden`. Respect `prefers-reduced-motion` by dropping the ring pulse and keeping the numeral.

## Failure handling

| Situation | Behaviour |
| --- | --- |
| Camera denied | silent switch to voice-led, one-line toast, setting stays off |
| Call / interruption | pause, keep count, resume prompt on return |
| App killed mid-set | on next launch, offer "You were 8 reps into a set — bank them?" |
| Sensor miscount | `±` always visible; the ledger stores `mode` so miscounts are auditable |
