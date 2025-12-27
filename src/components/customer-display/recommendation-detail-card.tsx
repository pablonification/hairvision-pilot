'use client'

import Image from 'next/image'
import { HairstyleRecommendation } from '@/types'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { CountUp } from '@/components/ui/count-up'
import { useEffect, useState } from 'react'
import { Check, Info, Star, Sparkles } from 'lucide-react'

interface RecommendationDetailCardProps {
  recommendation: HairstyleRecommendation
  isActive: boolean
  rank: number
  visualizationUrl?: string | undefined
}

export function RecommendationDetailCard({ recommendation, isActive, rank, visualizationUrl }: RecommendationDetailCardProps) {
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
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-2">
          <Star className="w-4 h-4 text-accent fill-accent" />
          <span className="text-xs font-medium text-accent uppercase tracking-widest">
            Rekomendasi #{rank}
          </span>
        </div>
        <h2 className="text-3xl md:text-5xl font-serif text-gold-gradient mb-2">
          {recommendation.name}
        </h2>
        <div className="flex items-center justify-center gap-2">
          <span className="text-4xl font-bold text-foreground">
            <CountUp value={recommendation.suitabilityScore} trigger={showContent} />
          </span>
          <span className="text-base text-muted-foreground self-end mb-1">Match</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full max-w-6xl flex-1">
        <div className={cn(
          "space-y-4 transition-all duration-700 delay-200",
          showContent ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
        )}>
          <div className="aspect-[4/5] max-h-[50vh] rounded-2xl bg-gradient-to-br from-card to-background border border-accent/10 relative overflow-hidden group">
            {visualizationUrl ? (
              <>
                <Image
                  src={visualizationUrl}
                  alt={`${recommendation.name} visualization`}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute top-4 left-4 z-20">
                  <div className="bg-accent text-accent-foreground text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Generated
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-[url('https://placehold.co/600x800/1a1a1a/333333?text=Generating...')] bg-cover bg-center opacity-50 mix-blend-overlay transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
                  <div className="w-20 h-20 rounded-full border border-accent/30 flex items-center justify-center animate-[pulse_3s_infinite]">
                    <div className="w-16 h-16 rounded-full border border-accent/60 flex items-center justify-center">
                      <Star className="w-8 h-8 text-accent" />
                    </div>
                  </div>
                  <p className="mt-4 text-lg font-serif text-foreground/90">Visualisasi AI</p>
                </div>
              </>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
            
            <div className="absolute bottom-6 left-6 right-6 z-10">
              <p className="text-lg text-foreground/90 font-light leading-relaxed">
                "{recommendation.description}"
              </p>
            </div>
          </div>
        </div>

        <div className={cn(
          "space-y-3 flex flex-col justify-center transition-all duration-700 delay-400",
          showContent ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
        )}>
          <Card className="p-5 bg-card/40 border-accent/10 backdrop-blur-sm">
            <h3 className="text-lg font-serif text-accent mb-3 flex items-center gap-2">
              <Check className="w-5 h-5" />
              Mengapa cocok untuk Anda
            </h3>
            
            <div className="space-y-2">
              {recommendation.whyItWorks?.map((reason, idx) => (
                <div 
                  key={idx} 
                  className="flex gap-3 items-start group"
                  style={{ transitionDelay: `${idx * 150}ms` }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0 group-hover:scale-150 transition-transform" />
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {reason}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 bg-card/20 border-white/5">
            <h3 className="text-lg font-serif text-foreground mb-2 flex items-center gap-2">
              <Info className="w-4 h-4 text-muted-foreground" />
              Geometric Reasoning
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-accent/20 pl-3">
              {recommendation.geometricReasoning}
            </p>
          </Card>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-accent/5 border border-accent/10 text-center">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Styling</div>
              <div className="text-lg font-serif text-accent">3-5 min</div>
            </div>
            <div className="p-3 rounded-xl bg-accent/5 border border-accent/10 text-center">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Hold</div>
              <div className="text-lg font-serif text-accent">Medium</div>
            </div>
            <div className="p-3 rounded-xl bg-accent/5 border border-accent/10 text-center">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Visit</div>
              <div className="text-lg font-serif text-accent">3 wks</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
