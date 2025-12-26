'use client'

import { useEffect, useState, useRef } from 'react'
import { cn } from '@/lib/utils'

interface CountUpProps {
  value: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
  trigger?: boolean
}

export function CountUp({ value, duration = 1500, className, prefix = '', suffix = '%', trigger = true }: CountUpProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const animationRef = useRef<{ raf: number; startTime: number } | null>(null)

  useEffect(() => {
    if (!trigger) {
      setDisplayValue(0)
      return
    }

    const startTime = performance.now()
    const startValue = 0
    const endValue = value

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      const easeOutExpo = progress === 1 
        ? 1 
        : 1 - Math.pow(2, -10 * progress)
      
      const currentValue = Math.round(startValue + (endValue - startValue) * easeOutExpo)
      setDisplayValue(currentValue)

      if (progress < 1) {
        animationRef.current = { raf: requestAnimationFrame(animate), startTime }
      }
    }

    animationRef.current = { raf: requestAnimationFrame(animate), startTime }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current.raf)
      }
    }
  }, [trigger, value, duration])

  return (
    <span className={cn('tabular-nums', className)}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  )
}
