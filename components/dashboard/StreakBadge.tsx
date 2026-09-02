'use client'

interface StreakBadgeProps {
  currentStreak: number
  longestStreak: number
}

export function StreakBadge({ currentStreak, longestStreak }: StreakBadgeProps) {
  const isActiveStreak = currentStreak > 0

  return (
    <div className="flex items-center space-x-4 bg-secondary rounded-xl p-4">
      {/* Fire emoji with glow */}
      <div
        className={`text-4xl transition-all ${
          isActiveStreak
            ? 'animate-pulse drop-shadow-lg'
            : 'opacity-40 grayscale'
        }`}
      >
        🔥
      </div>

      <div className="flex-1">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-foreground">{currentStreak}</span>
          <span className="text-sm text-muted-foreground">day streak</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Best: {longestStreak} days
        </p>
      </div>

      {currentStreak >= 7 && (
        <div className="px-3 py-1 bg-primary/20 rounded-full">
          <span className="text-xs font-medium text-primary">On fire!</span>
        </div>
      )}
    </div>
  )
}