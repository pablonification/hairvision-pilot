'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Info } from 'lucide-react'

interface ConfidenceBadgeProps {
  value: number
  label?: string
  size?: 'sm' | 'md' | 'lg'
  showTooltip?: boolean
  className?: string
}

const SIZE_CONFIG = {
  sm: { text: 'text-sm', padding: 'px-2 py-0.5', iconSize: 'w-3 h-3' },
  md: { text: 'text-base', padding: 'px-3 py-1', iconSize: 'w-4 h-4' },
  lg: { text: 'text-lg', padding: 'px-4 py-1.5', iconSize: 'w-5 h-5' },
}

const CONFIDENCE_LEVELS = [
  { min: 90, label: 'Sangat Tinggi', color: 'bg-green-500/20 text-green-400 border-green-500/30', description: 'AI sangat yakin dengan hasil analisis ini' },
  { min: 80, label: 'Tinggi', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', description: 'Hasil analisis sangat dapat diandalkan' },
  { min: 70, label: 'Baik', color: 'bg-accent/20 text-accent border-accent/30', description: 'Hasil analisis cukup akurat' },
  { min: 60, label: 'Cukup', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', description: 'Hasil mungkin memerlukan verifikasi barber' },
  { min: 0, label: 'Rendah', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', description: 'Disarankan konsultasi dengan barber' },
]

function getConfidenceLevel(value: number) {
  return CONFIDENCE_LEVELS.find(level => value >= level.min) || CONFIDENCE_LEVELS[CONFIDENCE_LEVELS.length - 1]
}

export function ConfidenceBadge({
  value,
  label = 'Confidence',
  size = 'md',
  showTooltip = true,
  className,
}: ConfidenceBadgeProps) {
  const [showInfo, setShowInfo] = useState(false)
  const config = SIZE_CONFIG[size]
  const level = getConfidenceLevel(value)

  return (
    <div className="relative inline-block">
      <div 
        className={cn(
          "inline-flex items-center gap-2 rounded-full border transition-all",
          config.padding,
          level?.color,
          className
        )}
        onMouseEnter={() => setShowInfo(true)}
        onMouseLeave={() => setShowInfo(false)}
      >
        <span className={cn("font-bold tabular-nums", config.text)}>
          {value}%
        </span>
        <span className={cn("text-current/70", config.text)}>
          {label}
        </span>
        {showTooltip && (
          <Info className={cn(config.iconSize, "opacity-60 cursor-help")} />
        )}
      </div>

      {showTooltip && showInfo && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 animate-fadeIn">
          <div className="bg-card border border-white/10 rounded-lg shadow-xl p-3 min-w-[200px] max-w-[280px]">
            <div className="flex items-center gap-2 mb-2">
              <div className={cn("w-2 h-2 rounded-full", level?.color.split(' ')[0]?.replace('/20', ''))} />
              <span className="text-sm font-medium text-foreground">{level?.label}</span>
            </div>
            <p className="text-xs text-muted-foreground">{level?.description}</p>
            
            <div className="mt-3 pt-2 border-t border-white/10">
              <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                <span>0%</span>
                <span>100%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full rounded-full", level?.color.split(' ')[0]?.replace('/20', ''))}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-card" />
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(4px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

interface ConfidenceIndicatorProps {
  value: number
  label: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
}

export function ConfidenceIndicator({ 
  value, 
  label, 
  description,
  size = 'md' 
}: ConfidenceIndicatorProps) {
  const level = getConfidenceLevel(value)
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-foreground">{label}</span>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <ConfidenceBadge value={value} label="" size={size} />
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-1000", level?.color.split(' ')[0]?.replace('/20', ''))}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}
