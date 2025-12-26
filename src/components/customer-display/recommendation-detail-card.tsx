'use client'

import { HairstyleRecommendation } from '@/types'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { CountUp } from '@/components/ui/count-up'
import { useEffect, useState } from 'react'
import { Check, Info, Star } from 'lucide-react'

interface RecommendationDetailCardProps {
  recommendation: HairstyleRecommendation
  isActive: boolean
  rank: number
}

export function RecommendationDetailCard({ recommendation, isActive, rank }: RecommendationDetailCardProps) {
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

  return (
    <div className={cn(
      "w-full h-full flex flex-col items-center transition-all duration-700",
      isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    )}>
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-4">
          <Star className="w-4 h-4 text-accent fill-accent" />
          <span className="text-sm font-medium text-accent uppercase tracking-widest">
            Rekomendasi #{rank}
          </span>
        </div>
        <h2 className="text-4xl md:text-6xl font-serif text-gold-gradient mb-4">
          {recommendation.name}
        </h2>
        <div className="flex items-center justify-center gap-3">
          <span className="text-5xl font-bold text-foreground">
            <CountUp value={recommendation.suitabilityScore} trigger={showContent} />
          </span>
          <span className="text-lg text-muted-foreground self-end mb-2">Match</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl flex-1">
        <div className={cn(
          "space-y-6 transition-all duration-700 delay-200",
          showContent ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
        )}>
          <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-card to-background border border-accent/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://placehold.co/600x800/1a1a1a/333333?text=Generating...')] bg-cover bg-center opacity-50 mix-blend-overlay transition-transform duration-1000 group-hover:scale-105" />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
              <div className="w-20 h-20 rounded-full border border-accent/30 flex items-center justify-center animate-[pulse_3s_infinite]">
                <div className="w-16 h-16 rounded-full border border-accent/60 flex items-center justify-center">
                  <Star className="w-8 h-8 text-accent" />
                </div>
              </div>
              <p className="mt-4 text-lg font-serif text-foreground/90">Visualisasi AI</p>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
            
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-lg text-foreground/90 font-light leading-relaxed">
                "{recommendation.description}"
              </p>
            </div>
          </div>
        </div>

        <div className={cn(
          "space-y-6 flex flex-col justify-center transition-all duration-700 delay-400",
          showContent ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
        )}>
          <Card className="p-8 bg-card/40 border-accent/10 backdrop-blur-sm">
            <h3 className="text-xl font-serif text-accent mb-6 flex items-center gap-3">
              <Check className="w-6 h-6" />
              Mengapa cocok untuk Anda
            </h3>
            
            <div className="space-y-4">
              {recommendation.whyItWorks?.map((reason, idx) => (
                <div 
                  key={idx} 
                  className="flex gap-4 items-start group"
                  style={{ transitionDelay: `${idx * 150}ms` }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5 flex-shrink-0 group-hover:scale-150 transition-transform" />
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {reason}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-8 bg-card/20 border-white/5">
            <h3 className="text-xl font-serif text-foreground mb-4 flex items-center gap-3">
              <Info className="w-5 h-5 text-muted-foreground" />
              Geometric Reasoning
            </h3>
            <p className="text-muted-foreground leading-relaxed italic border-l-2 border-accent/20 pl-4">
              {recommendation.geometricReasoning}
            </p>
          </Card>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 text-center">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Styling</div>
              <div className="text-xl font-serif text-accent">3-5 min</div>
            </div>
            <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 text-center">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Hold</div>
              <div className="text-xl font-serif text-accent">Medium</div>
            </div>
            <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 text-center">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Visit</div>
              <div className="text-xl font-serif text-accent">3 wks</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
