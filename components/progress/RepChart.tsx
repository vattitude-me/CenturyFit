'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface DayData {
  date: string
  pushup: number
  pullup: number
  squat: number
}

// Generate mock last 28 days data if no live data
function generateMockData(): DayData[] {
  const data: DayData[] = []
  const today = new Date()
  for (let i = 27; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    // Slight upward ramp simulation
    const baseReps = Math.floor(40 + (28 - i) * 2)
    data.push({
      date: dateStr,
      pushup: Math.min(100, Math.floor(baseReps * (0.8 + Math.random() * 0.4))),
      pullup: Math.min(100, Math.floor(baseReps * 0.7 * (0.8 + Math.random() * 0.4))),
      squat: Math.min(100, Math.floor(baseReps * 1.1 * (0.8 + Math.random() * 0.4))),
    })
  }
  return data
}

export function RepChart({ data = generateMockData() }: { data?: DayData[] }) {
  return (
    <div className="w-full h-64 pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorPushup" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPullup" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorSquat" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            stroke="#71717a"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            interval={6}
          />
          <YAxis
            stroke="#71717a"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#18181b',
              border: '1px solid #27272a',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Area
            type="monotone"
            dataKey="pushup"
            name="Push-ups"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#colorPushup)"
          />
          <Area
            type="monotone"
            dataKey="pullup"
            name="Pull-ups"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorPullup)"
          />
          <Area
            type="monotone"
            dataKey="squat"
            name="Squats"
            stroke="#f59e0b"
            fillOpacity={1}
            fill="url(#colorSquat)"
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex justify-center space-x-6 text-xs text-muted-foreground mt-2">
        <span className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
          <span>Push-ups</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
          <span>Pull-ups</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
          <span>Squats</span>
        </span>
      </div>
    </div>
  )
}