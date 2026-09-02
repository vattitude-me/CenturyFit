# Component inventory & tokens

All values come from Nocturne (`_ds/nocturne-.../styles.css`). Never hard-code a hex that a token already carries.

## Tokens in use

| Token | Value | Used for |
| --- | --- | --- |
| `--color-bg` | `#161826` | every screen ground |
| `--color-surface` | `#232532` | cards, list rows, inputs |
| `--color-text` | `#e9e9ed` | body + headings |
| `--color-accent` | `#9184d9` | outlines, rings, active cues, push-up series |
| `--color-accent-900/800` | `#2b2741` / `#423a6a` | tinted panels, icon chips, monogram tiles |
| `--color-accent-200/300` | `#e7e5fe` / `#d2cefd` | text on accent tints, active tab/rail labels |
| `--color-accent-400` | `#b5abfc` | pull-up series, link hover |
| `--color-accent-700` | `#5d5294` | squat series, calendar mid-fill |
| `--color-neutral-400/500/600` | `#b2b6ca` / `#9397ab` / `#75798c` | support copy, captions, inactive |
| `--color-divider` | text @16% | hairlines, rails, unfilled tracks |
| `--shadow-sm` | `0 0 0 1px #3f424d` | every card — elevation on dark is an edge, not a drop |
| `--radius-md` / `--radius-lg` | 8 / 14px | buttons, inputs / cards, panels |
| `--font-heading` / `--font-body` | Inter 500 / Inter 400 | — |

Gradient panels (Up Next, streak card, hero, session ground) use `linear-gradient(150deg,#20233a,#181a28)` plus a radial accent bloom at 18–30% — the accent as glow, never as a flood.

## Type scale (app-level)

| Role | Size / weight | Notes |
| --- | --- | --- |
| Screen title | 22px / 500, -.02em | dashboard, progress, squad |
| Onboarding headline | 27px / 500, -.02em | 38px on Welcome only |
| Card title | 21px / 500 | Up Next |
| Row title | 13.5–15px / 500 | list rows |
| Body / support | 13–14px / 400, 1.5 | neutral-400 |
| Caption | 11–12px / 400 | neutral-500/600 |
| Overline | 10–11px / 500, .10–.14em, caps | accent or neutral-500 |
| Counter numeral | 132 / 82 / 70px / 500, -.04em | `tabular-nums`, per variant |

All numeric values that change use `font-variant-numeric: tabular-nums`.

## Components

| Component | Spec | Nocturne base |
| --- | --- | --- |
| **PrimaryButton** | 48px (44 secondary), accent 1px outline, transparent fill, hover accent @12%, active @22% | `.btn.btn-primary` |
| **SecondaryButton** | divider outline, text-white label | `.btn.btn-secondary` |
| **GhostButton** | accent label, no border — `End set`, skip links | `.btn.btn-ghost` |
| **RoundControl** | 52px (±) / 78px (play-pause), circular, same outline rules | `.btn` + radius 50% |
| **IconChip** | 30–38px, radius 9–11, exercise ramp tint, glyph in accent-100 | — |
| **StatCard** | `--color-surface`, radius 15, `--shadow-sm`, overline + 34px value + caption | `.card` |
| **LitCard** | gradient + bloom; **max one per screen** | `.card.elev-sm` |
| **ListRow** | 13–14px padding, hairline separator (none on first), optional toggle or `›` | — |
| **Toggle** | 44×26 (42×25 in lists), 20px knob, accent track on / divider off, 180ms | — |
| **Radio** | 16px dot, accent fill + 4px bg inner ring, 1px accent inset ring on the row | `.radio` |
| **ModeChip** | equal-flex, radius 10, accent @14% + 1px inset ring when active | `.seg` idea, restyled |
| **Tag** | 11px, radius 6, neutral-800 or accent outline | `.tag` |
| **ProgressRing** | SVG, rotate -90°, round cap; 74px r34 stroke7 (dash 213.6) · 250px r112 stroke10 (dash 703.7) | — |
| **FillBar** | 5–9px, radius half, exercise color on text @9% track | — |
| **Timeline** | time gutter 42px · 2px rail + 11px dot (+5px halo when now) · card | — |
| **TabBar** | 84px, 4 items, gradient scrim + blur, accent-300 active | `.nav` idea, mobile form |
| **TempoSlider** | native range, `accent-color: #9184d9`, 1–4 step .25, 3 tick labels | `.input` |

## Exercise color mapping

| Exercise | Series color | Chip tint | Glyph |
| --- | --- | --- | --- |
| Push-ups | `#9184d9` (accent) | `#423a6a` | `⌃` |
| Pull-ups | `#b5abfc` (accent-400) | `#3f424d` | `⌄` |
| Squats | `#5d5294` (accent-700) | `#2b2741` | `◍` |

Glyphs above are prototype placeholders. **Ship with Phosphor icons** (the system's icon set) or commissioned exercise pictograms — do not ship the placeholder glyphs.

## Rules

1. **One accent-outlined button per screen.** If two actions compete, the second is secondary or ghost.
2. **One lit surface per screen.** Up Next on the dashboard, the streak card on Progress.
3. Never state status by color alone — dots also change fill weight and halo, calendar cells also change text color.
4. Elevation is `--shadow-sm` (a hairline). Do not stack shadows.
5. Headings stay at weight 500. Hierarchy is size and space.
6. `:focus-visible` = `2px solid var(--color-accent)`, offset 2. Required on web/PWA.
7. Minimum hit target 44×44 — including timeline `Start` buttons (30px visually, 44px touch area).
