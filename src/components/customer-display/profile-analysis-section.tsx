'use client'

import { GeometricAnalysis } from '@/types'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { CountUp } from '@/components/ui/count-up'
import { useEffect, useState } from 'react'
import { User, Ruler, Scissors, Activity } from 'lucide-react'

interface ProfileAnalysisSectionProps {
  analysis: GeometricAnalysis
  isActive: boolean
}

export function ProfileAnalysisSection({ analysis, isActive }: ProfileAnalysisSectionProps) {
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

  if (!analysis) return null

  const stats = [
    {
      label: 'Bentuk Wajah',
      value: analysis.faceShape.charAt(0).toUpperCase() + analysis.faceShape.slice(1),
      score: analysis.faceShapeConfidencePercent,
      icon: User,
      delay: 0
    },
    {
      label: 'Tekstur Rambut',
      value: analysis.hairAnalysis?.texture || 'Unknown',
      score: analysis.hairAnalysis?.textureConfidencePercent,
      icon: Scissors,
      delay: 150
    },
    {
      label: 'Simetri',
      value: 'Balanced',
      score: analysis.faceProportions?.symmetryScorePercent,
      icon: Ruler,
      delay: 300
    },
    {
      label: 'Densitas',
      value: analysis.hairAnalysis?.density || 'Medium',
      score: analysis.hairAnalysis?.densityConfidencePercent,
      icon: Activity,
      delay: 450
    }
  ]

  return (
    <div className={cn(
      "w-full max-w-5xl mx-auto space-y-8 transition-all duration-700",
      isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    )}>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-serif mb-3 text-gold-gradient inline-block">
          Analisis Profil
        </h2>
        <p className="text-muted-foreground text-lg">
          Data biometrik dan karakteristik rambut Anda
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, idx) => (
          <Card 
            key={idx}
            className={cn(
              "p-6 bg-card/50 border-accent/10 backdrop-blur-sm transition-all duration-700 hover:border-accent/30 hover:bg-card/80",
              showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
            style={{ transitionDelay: `${stat.delay}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20">
                  <stat.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <h3 className="text-2xl font-serif text-foreground mt-1">
                    {stat.value}
                  </h3>
                </div>
              </div>
              
              {stat.score && (
                <div className="flex flex-col items-end">
                  <span className="text-3xl font-bold text-accent">
                    <CountUp value={stat.score} trigger={showContent} />
                  </span>
                  <span className="text-xs text-muted-foreground">Confidence</span>
                </div>
              )}
            </div>

            <div className="mt-6 w-full bg-accent/10 h-1.5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-1000 ease-out"
                style={{ 
                  width: showContent ? `${stat.score || 0}%` : '0%',
                  transitionDelay: `${stat.delay + 300}ms`
                }}
              />
            </div>
          </Card>
        ))}
      </div>

      <div className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 transition-all duration-700 delay-700",
        showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        <div className="p-4 rounded-lg bg-accent/5 border border-accent/10">
          <p className="text-xs text-accent uppercase tracking-wider mb-2">Jawline</p>
          <p className="text-lg text-foreground font-medium">{analysis.jawlineWidth}</p>
        </div>
        <div className="p-4 rounded-lg bg-accent/5 border border-accent/10">
          <p className="text-xs text-accent uppercase tracking-wider mb-2">Cheekbones</p>
          <p className="text-lg text-foreground font-medium">{analysis.cheekboneHeight}</p>
        </div>
        <div className="p-4 rounded-lg bg-accent/5 border border-accent/10">
          <p className="text-xs text-accent uppercase tracking-wider mb-2">Forehead</p>
          <p className="text-lg text-foreground font-medium">{analysis.foreheadWidth}</p>
        </div>
      </div>
    </div>
  )
}
