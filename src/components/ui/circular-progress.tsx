'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface CircularProgressProps {
  value: number
  size?: 'sm' | 'md' | 'lg'
  strokeWidth?: number
  showValue?: boolean
  label?: string
  trigger?: boolean
  colorScheme?: 'accent' | 'gradient' | 'dynamic'
  className?: string
}

const SIZE_CONFIG = {
  sm: { size: 60, fontSize: 14, labelSize: 8 },
  md: { size: 100, fontSize: 24, labelSize: 10 },
  lg: { size: 140, fontSize: 32, labelSize: 12 },
}

function getColorByValue(value: number): string {
  if (value >= 85) return 'rgb(34, 197, 94)'
  if (value >= 70) return 'rgb(201, 162, 39)'
  if (value >= 50) return 'rgb(249, 115, 22)'
  return 'rgb(239, 68, 68)'
}

export function CircularProgress({
  value,
  size = 'md',
  strokeWidth = 8,
  showValue = true,
  label,
  trigger = true,
  colorScheme = 'dynamic',
  className,
}: CircularProgressProps) {
  const [animatedValue, setAnimatedValue] = useState(0)
  const config = SIZE_CONFIG[size]
  
  const radius = (config.size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (animatedValue / 100) * circumference

  useEffect(() => {
    if (!trigger) {
      setAnimatedValue(0)
      return
    }

    const duration = 1500
    const steps = 60
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      const easeOut = 1 - Math.pow(1 - currentStep / steps, 3)
      setAnimatedValue(Math.min(value * easeOut, value))
      
      if (currentStep >= steps) {
        clearInterval(timer)
        setAnimatedValue(value)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [trigger, value])

  const strokeColor = colorScheme === 'dynamic' 
    ? getColorByValue(value) 
    : colorScheme === 'accent' 
      ? 'rgb(201, 162, 39)' 
      : 'url(#progressGradient)'

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={config.size}
        height={config.size}
        className="transform -rotate-90"
      >
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(201, 162, 39)" />
            <stop offset="100%" stopColor="rgb(234, 179, 8)" />
          </linearGradient>
          <filter id="progressGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx={config.size / 2}
          cy={config.size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-white/10"
        />

        <circle
          cx={config.size / 2}
          cy={config.size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          filter="url(#progressGlow)"
          className="transition-all duration-100"
        />
      </svg>

      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span 
            className="font-bold tabular-nums"
            style={{ 
              fontSize: config.fontSize,
              color: strokeColor === 'url(#progressGradient)' ? 'rgb(201, 162, 39)' : strokeColor 
            }}
          >
            {Math.round(animatedValue)}
          </span>
          {label && (
            <span 
              className="text-muted-foreground uppercase tracking-wider"
              style={{ fontSize: config.labelSize }}
            >
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
