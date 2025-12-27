'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { HairstyleRecommendation } from '@/types'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { CircularProgress } from '@/components/ui/circular-progress'
import { Check, X, Clock, Scissors, Droplets } from 'lucide-react'

interface StyleComparisonViewProps {
  recommendations: [HairstyleRecommendation, HairstyleRecommendation]
  visualizations?: Record<string, string>
  isActive?: boolean
}

interface ComparisonRowProps {
  label: string
  value1: string | number
  value2: string | number
  icon?: React.ReactNode
  highlight?: 'first' | 'second' | 'none'
}

function ComparisonRow({ label, value1, value2, icon, highlight = 'none' }: ComparisonRowProps) {
  return (
    <div className="grid grid-cols-3 gap-4 py-1.5 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <div className={cn(
        "text-center text-xs font-medium",
        highlight === 'first' ? "text-accent" : "text-foreground"
      )}>
        {value1}
      </div>
      <div className={cn(
        "text-center text-xs font-medium",
        highlight === 'second' ? "text-accent" : "text-foreground"
      )}>
        {value2}
      </div>
    </div>
  )
}

function ProConItem({ text, isPro }: { text: string; isPro: boolean }) {
  return (
    <div className="flex items-start gap-2 py-1">
      {isPro ? (
        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
      ) : (
        <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
      )}
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  )
}

export function StyleComparisonView({ 
  recommendations, 
  visualizations,
  isActive = true 
}: StyleComparisonViewProps) {
  const [showContent, setShowContent] = useState(false)
  const [rec1, rec2] = recommendations

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setShowContent(true), 300)
      return () => clearTimeout(timer)
    } else {
      setShowContent(false)
    }
    return undefined
  }, [isActive])

  const getMaintenanceTime = (rec: HairstyleRecommendation): string => {
    const tips = rec.barberInstructions.styling.maintenanceTips
    const timeTip = tips.find(t => t.toLowerCase().includes('menit') || t.toLowerCase().includes('min'))
    if (timeTip) {
      const match = timeTip.match(/(\d+[-–]?\d*)\s*(menit|min)/i)
      if (match) return `${match[1]} min`
    }
    return '3-5 min'
  }

  const getTrimInterval = (rec: HairstyleRecommendation): string => {
    const tips = rec.barberInstructions.styling.maintenanceTips
    const trimTip = tips.find(t => t.toLowerCase().includes('trim') || t.toLowerCase().includes('minggu'))
    if (trimTip) {
      const match = trimTip.match(/(\d+[-–]?\d*)\s*(minggu|weeks?)/i)
      if (match) return `${match[1]} minggu`
    }
    return '3-4 minggu'
  }

  const higherScore = rec1.suitabilityScore >= rec2.suitabilityScore ? 'first' : 'second'

  return (
    <div className={cn(
      "w-full max-w-5xl mx-auto transition-all duration-700",
      isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    )}>
      <div className="text-center mb-4">
        <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-1">
          Perbandingan Gaya
        </h2>
        <p className="text-sm text-muted-foreground">
          Lihat perbedaan antara dua rekomendasi terbaik
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {[rec1, rec2].map((rec, idx) => {
          const isWinner = (idx === 0 && higherScore === 'first') || (idx === 1 && higherScore === 'second')
          const vizUrl = visualizations?.[rec.id]
          
          return (
            <Card 
              key={rec.id}
              className={cn(
                "relative overflow-hidden transition-all duration-500 bg-card/40 border-accent/10",
                showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
                isWinner && "ring-2 ring-accent"
              )}
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              {isWinner && (
                <div className="absolute top-2 left-2 z-10">
                  <span className="bg-accent text-accent-foreground text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                    Best Match
                  </span>
                </div>
              )}

              <div className="aspect-[16/10] relative bg-gradient-to-br from-accent/5 to-transparent">
                {vizUrl ? (
                  <Image
                    src={vizUrl}
                    alt={rec.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CircularProgress
                      value={rec.suitabilityScore}
                      size="lg"
                      trigger={showContent}
                      colorScheme="dynamic"
                      label="%"
                    />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              </div>

              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-serif text-foreground">{rec.name}</h3>
                  <span className="text-xl font-bold text-accent">{rec.suitabilityScore}%</span>
                </div>

                <p className="text-xs text-muted-foreground mb-2">
                  {rec.description || rec.geometricReasoning}
                </p>

                <div className="space-y-0.5">
                  {rec.whyItWorks?.slice(0, 2).map((reason, i) => (
                    <ProConItem key={i} text={reason} isPro={true} />
                  ))}
                  {rec.barberInstructions.styling.maintenanceTips
                    .filter(t => t.toLowerCase().includes('perlu') || t.toLowerCase().includes('butuh'))
                    .slice(0, 1)
                    .map((concern, i) => (
                      <ProConItem key={`con-${i}`} text={concern} isPro={false} />
                    ))
                  }
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Card className={cn(
        "p-4 bg-card/30 border-accent/10 transition-all duration-500 delay-500",
        showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        <h4 className="text-base font-serif text-foreground mb-3 text-center">
          Detail Perbandingan
        </h4>

        <div className="grid grid-cols-3 gap-4 pb-2 border-b border-white/10 mb-1">
          <div className="text-xs text-muted-foreground">Aspek</div>
          <div className="text-xs font-medium text-center text-accent">{rec1.name}</div>
          <div className="text-xs font-medium text-center text-accent">{rec2.name}</div>
        </div>

        <ComparisonRow 
          label="Match Score" 
          value1={`${rec1.suitabilityScore}%`}
          value2={`${rec2.suitabilityScore}%`}
          highlight={higherScore}
        />
        <ComparisonRow 
          label="Styling Time" 
          value1={getMaintenanceTime(rec1)}
          value2={getMaintenanceTime(rec2)}
          icon={<Clock className="w-4 h-4" />}
          highlight={getMaintenanceTime(rec1) < getMaintenanceTime(rec2) ? 'first' : 'second'}
        />
        <ComparisonRow 
          label="Trim Interval" 
          value1={getTrimInterval(rec1)}
          value2={getTrimInterval(rec2)}
          icon={<Scissors className="w-4 h-4" />}
        />
        <ComparisonRow 
          label="Products" 
          value1={`${rec1.barberInstructions.styling.products.length} items`}
          value2={`${rec2.barberInstructions.styling.products.length} items`}
          icon={<Droplets className="w-4 h-4" />}
        />
        <ComparisonRow 
          label="Top Length" 
          value1={`${rec1.barberInstructions.top.lengthCm} cm`}
          value2={`${rec2.barberInstructions.top.lengthCm} cm`}
        />
        <ComparisonRow 
          label="Fade Type" 
          value1={rec1.barberInstructions.sides.fadeType?.replace('_', ' ') || 'None'}
          value2={rec2.barberInstructions.sides.fadeType?.replace('_', ' ') || 'None'}
        />
      </Card>
    </div>
  )
}
