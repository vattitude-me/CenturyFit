'use client'

import { useState } from 'react'

interface CadenceSliderProps {
  bpm: number
  onBpmChange: (bpm: number) => void
  guidedMode: boolean
  onGuidedModeChange: (enabled: boolean) => void
}

export function CadenceSlider({
  bpm,
  onBpmChange,
  guidedMode,
  onGuidedModeChange,
}: CadenceSliderProps) {
  const [isDragging, setIsDragging] = useState(false)

  const minBpm = 20
  const maxBpm = 120

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onBpmChange(parseInt(e.target.value, 10))
  }

  const formatTime = (bpm: number) => {
    const secondsPerRep = 60 / bpm
    if (secondsPerRep >= 2) {
      return `${secondsPerRep.toFixed(1)}s per rep`
    }
    return `${secondsPerRep.toFixed(1)}s per rep`
  }

  return (
    <div className="w-full max-w-md space-y-4">
      {/* Guided mode toggle */}
      <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
        <div>
          <h3 className="font-semibold text-foreground">Guided Mode</h3>
          <p className="text-sm text-muted-foreground">
            Auto-count at your tempo
          </p>
        </div>
        <button
          onClick={() => onGuidedModeChange(!guidedMode)}
          className={`relative w-14 h-8 rounded-full transition-colors ${
            guidedMode ? 'bg-primary' : 'bg-border'
          }`}
        >
          <div
            className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
              guidedMode ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* BPM slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Cadence</label>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary tabular-nums">{bpm}</span>
            <span className="text-sm text-muted-foreground">BPM</span>
          </div>
        </div>

        <input
          type="range"
          min={minBpm}
          max={maxBpm}
          value={bpm}
          onChange={handleSliderChange}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
          style={{
            background: `linear-gradient(to right, hsl(var(--color-primary)) 0%, hsl(var(--color-primary)) ${
              ((bpm - minBpm) / (maxBpm - minBpm)) * 100
            }%, hsl(var(--color-border)) ${
              ((bpm - minBpm) / (maxBpm - minBpm)) * 100
            }%, hsl(var(--color-border)) 100%)`,
          }}
        />

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Slow ({minBpm})</span>
          <span className="text-center">{formatTime(bpm)}</span>
          <span>Fast ({maxBpm})</span>
        </div>
      </div>

      {/* Preset buttons */}
      <div className="grid grid-cols-4 gap-2">
        {[30, 40, 60, 80].map((presetBpm) => (
          <button
            key={presetBpm}
            onClick={() => onBpmChange(presetBpm)}
            className={`py-2 px-3 rounded text-sm font-medium transition-colors ${
              bpm === presetBpm
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground hover:bg-muted'
            }`}
          >
            {presetBpm}
          </button>
        ))}
      </div>

      {guidedMode && (
        <p className="text-xs text-muted-foreground text-center">
          The counter will automatically advance at your selected tempo
        </p>
      )}
    </div>
  )
}