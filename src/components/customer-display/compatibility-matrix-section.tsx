'use client'

import { StyleCompatibility } from '@/types'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { CountUp } from '@/components/ui/count-up'
import { useEffect, useState } from 'react'
import { Check, AlertCircle } from 'lucide-react'

interface CompatibilityMatrixSectionProps {
  styles: StyleCompatibility[]
  isActive: boolean
}

export function CompatibilityMatrixSection({ styles, isActive }: CompatibilityMatrixSectionProps) {
  const [showContent, setShowContent] = useState(false)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const sortedStyles = [...styles].sort((a, b) => b.matchScorePercent - a.matchScorePercent)

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setShowContent(true), 300)
      return () => clearTimeout(timer)
    } else {
      setShowContent(false)
    }
    return undefined
  }, [isActive])

  const toggleExpand = (idx: number) => {
    setExpandedId(expandedId === idx ? null : idx)
  }

  return (
    <div className={cn(
      "w-full max-w-4xl mx-auto space-y-8 transition-all duration-700",
      isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    )}>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-serif mb-3 text-gold-gradient inline-block">
          Matriks Kecocokan
        </h2>
        <p className="text-muted-foreground text-lg">
          Peringkat gaya berdasarkan analisis biometrik
        </p>
      </div>

      <div className="space-y-4">
        {sortedStyles.map((style, idx) => {
          const isHighMatch = style.matchScorePercent >= 80
          const isMediumMatch = style.matchScorePercent >= 70 && style.matchScorePercent < 80
          
          return (
            <Card
              key={idx}
              className={cn(
                "overflow-hidden transition-all duration-500 border-accent/10 cursor-pointer hover:bg-accent/5",
                showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                expandedId === idx ? "bg-accent/5 ring-1 ring-accent/30" : "bg-card/40"
              )}
              style={{ transitionDelay: `${idx * 100}ms` }}
              onClick={() => toggleExpand(idx)}
            >
              <div className="p-5 flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className={cn(
                      "text-xl font-medium font-serif",
                      isHighMatch ? "text-accent" : "text-foreground"
                    )}>
                      {style.styleName}
                    </h3>
                    <span className={cn(
                      "text-2xl font-bold tabular-nums",
                      isHighMatch ? "text-accent" : isMediumMatch ? "text-foreground" : "text-muted-foreground"
                    )}>
                      <CountUp value={style.matchScorePercent} trigger={showContent} />
                    </span>
                  </div>
                  
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-1000 ease-out",
                        isHighMatch ? "bg-accent" : isMediumMatch ? "bg-foreground/70" : "bg-muted-foreground"
                      )}
                      style={{ 
                        width: showContent ? `${style.matchScorePercent}%` : '0%',
                        transitionDelay: `${(idx * 100) + 300}ms`
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className={cn(
                "grid transition-[grid-template-rows] duration-500 ease-in-out",
                expandedId === idx ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}>
                <div className="overflow-hidden">
                  <div className="p-5 pt-0 grid md:grid-cols-2 gap-6 border-t border-accent/10 mt-2">
                    <div>
                      <h4 className="text-sm uppercase tracking-wider text-accent mb-3 flex items-center gap-2">
                        <Check className="w-4 h-4" /> Mengapa Cocok
                      </h4>
                      <ul className="space-y-2">
                        {style.keyReasons.map((reason, i) => (
                          <li key={i} className="text-sm text-muted-foreground pl-4 border-l border-accent/20">
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {style.concerns.length > 0 && (
                      <div>
                        <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" /> Pertimbangan
                        </h4>
                        <ul className="space-y-2">
                          {style.concerns.map((concern, i) => (
                            <li key={i} className="text-sm text-muted-foreground pl-4 border-l border-white/10">
                              {concern}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
