'use client'

import { useEffect, useState } from 'react'
import { FaceProportions, HairAnalysis } from '@/types'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Ruler, Sparkles } from 'lucide-react'

interface FaceProportionsCardProps {
  proportions: FaceProportions
  hairAnalysis?: HairAnalysis
  isActive?: boolean
}

interface ProportionBarProps {
  label: string
  value: number
  maxValue?: number
  unit?: string
  showAsRatio?: boolean
  trigger?: boolean
  delay?: number
  description?: string
}

function ProportionBar({ 
  label, 
  value, 
  maxValue = 100, 
  unit = '%',
  showAsRatio = false,
  trigger = true,
  delay = 0,
  description
}: ProportionBarProps) {
  const [animatedValue, setAnimatedValue] = useState(0)
  const percentage = (value / maxValue) * 100

  useEffect(() => {
    if (!trigger) {
      setAnimatedValue(0)
      return
    }

    const timer = setTimeout(() => {
      const duration = 1200
      const steps = 40
      let currentStep = 0

      const interval = setInterval(() => {
        currentStep++
        const easeOut = 1 - Math.pow(1 - currentStep / steps, 3)
        setAnimatedValue(Math.min(value * easeOut, value))
        
        if (currentStep >= steps) {
          clearInterval(interval)
          setAnimatedValue(value)
        }
      }, duration / steps)
    }, delay)

    return () => clearTimeout(timer)
  }, [trigger, value, delay])

  const getBarColor = (pct: number) => {
    if (pct >= 80) return 'bg-green-500'
    if (pct >= 60) return 'bg-accent'
    if (pct >= 40) return 'bg-yellow-500'
    return 'bg-orange-500'
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-foreground">{label}</span>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        <span className="text-lg font-bold text-accent tabular-nums">
          {showAsRatio 
            ? `${animatedValue.toFixed(1)}:1`
            : `${Math.round(animatedValue)}${unit}`
          }
        </span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out",
            getBarColor(percentage)
          )}
          style={{ 
            width: trigger ? `${percentage}%` : '0%',
            transitionDelay: `${delay}ms`
          }}
        />
      </div>
    </div>
  )
}

function QualityBadge({ 
  label, 
  value
}: { 
  label: string
  value: string
}) {
  const getValueColor = (val: string) => {
    const lower = val.toLowerCase()
    if (lower.includes('excellent') || lower.includes('pronounced') || lower.includes('prominent')) 
      return 'text-green-400'
    if (lower.includes('balanced') || lower.includes('moderate') || lower.includes('good')) 
      return 'text-accent'
    return 'text-muted-foreground'
  }

  return (
    <div className="flex flex-col items-center p-3 rounded-lg bg-white/5 border border-white/10">
      <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
        {label}
      </span>
      <span className={cn("text-sm font-semibold capitalize", getValueColor(value))}>
        {value}
      </span>
    </div>
  )
}

export function FaceProportionsCard({ 
  proportions, 
  hairAnalysis,
  isActive = true 
}: FaceProportionsCardProps) {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setShowContent(true), 300)
      return () => clearTimeout(timer)
    } else {
      setShowContent(false)
    }
    return undefined
  }, [isActive])

  if (!proportions) return null

  return (
    <Card className={cn(
      "p-6 bg-card/50 border-accent/10 backdrop-blur-sm transition-all duration-700",
      isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    )}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20">
          <Ruler className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-serif text-foreground">Analisis Proporsi Wajah</h3>
          <p className="text-xs text-muted-foreground">Data biometrik detail dari scan AI</p>
        </div>
      </div>

      <div className="space-y-5">
        <ProportionBar
          label="Rasio Dahi : Wajah"
          value={proportions.foreheadToFaceRatioPercent}
          trigger={showContent}
          delay={0}
          description="Proporsi lebar dahi terhadap total wajah"
        />

        <ProportionBar
          label="Rasio Rahang : Dahi"
          value={proportions.jawToForeheadRatioPercent}
          trigger={showContent}
          delay={150}
          description="Perbandingan lebar rahang dengan dahi"
        />

        <ProportionBar
          label="Rasio Panjang : Lebar"
          value={proportions.faceLengthToWidthRatio}
          maxValue={2}
          showAsRatio={true}
          trigger={showContent}
          delay={300}
          description="Proporsi vertikal vs horizontal wajah"
        />

        <ProportionBar
          label="Skor Simetri"
          value={proportions.symmetryScorePercent}
          trigger={showContent}
          delay={450}
          description="Tingkat keseimbangan kiri-kanan wajah"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-white/10">
        <QualityBadge 
          label="Dagu" 
          value={proportions.chinProminence} 
        />
        <QualityBadge 
          label="Tulang Pipi" 
          value={proportions.cheekboneDefinition} 
        />
      </div>

      {hairAnalysis && (
        <div className={cn(
          "mt-6 pt-6 border-t border-white/10 transition-all duration-500 delay-700",
          showContent ? "opacity-100" : "opacity-0"
        )}>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-foreground">Analisis Rambut</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <QualityBadge label="Tekstur" value={hairAnalysis.texture} />
            <QualityBadge label="Densitas" value={hairAnalysis.density} />
            <QualityBadge label="Hairline" value={hairAnalysis.hairlineType.replace('_', ' ')} />
            <QualityBadge label="Natural Part" value={hairAnalysis.naturalPartSide} />
          </div>

          {hairAnalysis.growthPattern && (
            <p className="text-xs text-muted-foreground mt-4 italic">
              "{hairAnalysis.growthPattern}"
            </p>
          )}
        </div>
      )}
    </Card>
  )
}
