'use client'

import React from 'react'

interface ExerciseProgressProps {
  completed: number
  target: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function ExerciseProgress({
  completed,
  target,
  size = 'md',
  showLabel = true,
}: ExerciseProgressProps) {
  const progress = Math.min(completed / target, 1)

  // Size configurations
  const sizes = {
    sm: { radius: 24, strokeWidth: 4, text: 'text-sm', label: 'text-xs' },
    md: { radius: 40, strokeWidth: 6, text: 'text-lg', label: 'text-xs' },
    lg: { radius: 60, strokeWidth: 8, text: 'text-2xl', label: 'text-sm' },
  }

  const { radius, strokeWidth, text, label } = sizes[size]
  const normalizedRadius = radius - strokeWidth / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - progress * circumference

  // Color based on progress
  const getColor = () => {
    if (progress >= 1) return 'hsl(var(--color-primary))'
    if (progress >= 0.66) return 'hsl(var(--color-primary))'
    if (progress >= 0.33) return 'hsl(38 92% 50%)' // Amber
    return 'hsl(0 84% 60%)' // Red
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={radius * 2 + strokeWidth}
        height={radius * 2 + strokeWidth}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          stroke="hsl(var(--color-border))"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius + strokeWidth / 2}
          cy={radius + strokeWidth / 2}
        />
        {/* Progress circle */}
        <circle
          stroke={getColor()}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius + strokeWidth / 2}
          cy={radius + strokeWidth / 2}
          className="transition-all duration-500 ease-out"
        />
      </svg>

      {/* Center text */}
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${text} font-bold text-foreground tabular-nums`}>
            {completed}
          </span>
          <span className={`${label} text-muted-foreground`}>/ {target}</span>
        </div>
      )}
    </div>
  )
}