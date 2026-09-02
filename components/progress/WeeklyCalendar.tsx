'use client'

interface CalendarDay {
  date: Date
  completed: boolean
  partial: boolean
}

function generateCalendar(): CalendarDay[] {
  const days: CalendarDay[] = []
  const today = new Date()

  // Generate last 28 days
  for (let i = 27; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)

    // Mock completion status
    const isCompleted = Math.random() > 0.2 // 80% completed
    const isPartial = !isCompleted && Math.random() > 0.5 // Some partial

    days.push({
      date: d,
      completed: isCompleted,
      partial: isPartial,
    })
  }

  return days
}

export function WeeklyCalendar() {
  const days = generateCalendar()
  const weeks: CalendarDay[][] = []

  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  const getDayColor = (day: CalendarDay) => {
    if (day.completed) return 'bg-primary'
    if (day.partial) return 'bg-amber-500'
    return 'bg-border'
  }

  const getDayLabel = (day: CalendarDay) => {
    if (day.completed) return '✓'
    if (day.partial) return '◐'
    return '·'
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="space-y-2">
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1">
        {dayNames.map((name) => (
          <div key={name} className="text-xs font-medium text-muted-foreground text-center">
            {name}
          </div>
        ))}
      </div>

      {/* Calendar weeks */}
      {weeks.map((week, weekIdx) => (
        <div key={weekIdx} className="grid grid-cols-7 gap-1">
          {week.map((day, dayIdx) => (
            <div
              key={dayIdx}
              className="relative aspect-square"
              title={day.date.toLocaleDateString()}
            >
              <div
                className={`
                  w-full h-full rounded-md flex items-center justify-center text-xs font-medium
                  text-foreground transition-all hover:scale-110
                  ${getDayColor(day)}
                `}
              >
                {getDayLabel(day)}
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Legend */}
      <div className="flex justify-center gap-4 text-xs text-muted-foreground mt-3 pt-2 border-t">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-primary"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-amber-500"></div>
          <span>Partial</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-border"></div>
          <span>Missed</span>
        </div>
      </div>
    </div>
  )
}