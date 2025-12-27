'use client'

import { useEffect, useState } from 'react'
import { StyleCompatibility } from '@/types'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { CircularProgress } from '@/components/ui/circular-progress'

interface AIRecommendationGridProps {
  styles: StyleCompatibility[]
  isActive?: boolean
  onSelectStyle?: (styleName: string) => void
  maxItems?: number
}

export function AIRecommendationGrid({
  styles,
  isActive = true,
  onSelectStyle,
  maxItems = 4,
}: AIRecommendationGridProps) {
  const [showContent, setShowContent] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const topStyles = [...styles]
    .sort((a, b) => b.matchScorePercent - a.matchScorePercent)
    .slice(0, maxItems)

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setShowContent(true), 300)
      return () => clearTimeout(timer)
    } else {
      setShowContent(false)
    }
    return undefined
  }, [isActive])

  const handleSelect = (idx: number, styleName: string) => {
    setSelectedIndex(idx)
    onSelectStyle?.(styleName)
  }

  return (
    <div className={cn(
      "w-full transition-all duration-700",
      isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    )}>
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-xs font-medium text-accent uppercase tracking-[0.2em]">
            AI Recommendation
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-serif text-foreground">
          Gaya Rambut Terbaik untuk Anda
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-4xl mx-auto">
        {topStyles.map((style, idx) => {
          const isTopPick = idx === 0
          const isSelected = selectedIndex === idx
          
          return (
            <Card
              key={idx}
              className={cn(
                "relative overflow-hidden cursor-pointer transition-all duration-500 group",
                "bg-card/40 hover:bg-card/60 border-accent/10",
                showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
                isSelected && "ring-2 ring-accent border-accent/50",
                isTopPick && "md:col-span-1"
              )}
              style={{ transitionDelay: `${idx * 150}ms` }}
              onClick={() => handleSelect(idx, style.styleName)}
            >
              {isTopPick && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-accent text-accent-foreground text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    Best Match
                  </span>
                </div>
              )}

              <div className="aspect-[4/3] md:aspect-[16/10] bg-gradient-to-br from-accent/5 to-transparent relative flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity" />
                
                <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-500">
                  <CircularProgress
                    value={style.matchScorePercent}
                    size="lg"
                    trigger={showContent}
                    colorScheme="dynamic"
                    label="%"
                  />
                </div>
              </div>

              <div className="p-3 md:p-4">
                <h3 className="text-lg md:text-xl font-serif text-foreground mb-1.5 group-hover:text-accent transition-colors">
                  {style.styleName}
                </h3>
                
                <div className="space-y-1">
                  {style.keyReasons.slice(0, 2).map((reason, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <p className="text-xs text-muted-foreground">{reason}</p>
                    </div>
                  ))}
                </div>

                {style.concerns.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-white/5">
                    <p className="text-[10px] text-muted-foreground/60">
                      Note: {style.concerns[0]}
                    </p>
                  </div>
                )}
              </div>

              <div className={cn(
                "absolute inset-0 border-2 rounded-xl transition-all duration-300 pointer-events-none",
                isSelected ? "border-accent opacity-100" : "border-transparent opacity-0"
              )} />
            </Card>
          )
        })}
      </div>

      <div className={cn(
        "mt-4 text-center transition-all duration-500 delay-700",
        showContent ? "opacity-100" : "opacity-0"
      )}>
        <p className="text-xs text-muted-foreground">
          Tap kartu untuk melihat detail rekomendasi
        </p>
      </div>
    </div>
  )
}
