'use client'

import { GeometricAnalysis } from '@/types'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { CountUp } from '@/components/ui/count-up'
import { FaceShapeDiagram } from './face-shape-diagram'
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
      label: 'Tekstur Rambut',
      value: analysis.hairAnalysis?.texture || analysis.hairTexture || 'Unknown',
      score: analysis.hairAnalysis?.textureConfidencePercent,
      icon: Scissors,
      delay: 0
    },
    {
      label: 'Simetri Wajah',
      value: analysis.faceProportions?.symmetryScorePercent 
        ? `${analysis.faceProportions.symmetryScorePercent}%` 
        : 'Balanced',
      score: analysis.faceProportions?.symmetryScorePercent,
      icon: Ruler,
      delay: 150
    },
    {
      label: 'Densitas Rambut',
      value: analysis.hairAnalysis?.density || analysis.hairDensity || 'Medium',
      score: analysis.hairAnalysis?.densityConfidencePercent,
      icon: Activity,
      delay: 300
    }
  ]

  return (
    <div className={cn(
      "w-full max-w-6xl mx-auto transition-all duration-700",
      isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    )}>
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-2">
          <User className="w-4 h-4 text-accent" />
          <span className="text-xs font-medium text-accent uppercase tracking-[0.2em]">
            Face Scan Complete
          </span>
        </div>
        <h2 className="text-2xl md:text-4xl font-serif text-foreground">
          Analisis Profil Anda
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-center">
        <div className={cn(
          "flex flex-col items-center justify-center transition-all duration-700 delay-200",
          showContent ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
        )}>
          <FaceShapeDiagram
            faceShape={analysis.faceShape}
            isActive={showContent}
            size="lg"
            showLabels={true}
            showLandmarks={true}
          />
          
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Bentuk Wajah Terdeteksi
            </p>
            <h3 className="text-3xl font-serif text-accent capitalize">
              {analysis.faceShape}
            </h3>
          </div>
        </div>

        <div className={cn(
          "space-y-4 transition-all duration-700 delay-400",
          showContent ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
        )}>
          {stats.map((stat, idx) => (
            <Card 
              key={idx}
              className={cn(
                "p-4 bg-card/50 border-accent/10 backdrop-blur-sm transition-all duration-500 hover:border-accent/30 hover:bg-card/80",
                showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{ transitionDelay: `${stat.delay + 400}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20">
                    <stat.icon className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      {stat.label}
                    </p>
                    <h4 className="text-lg font-serif text-foreground mt-0.5 capitalize">
                      {stat.value}
                    </h4>
                  </div>
                </div>
                
                {stat.score && (
                  <div className="flex flex-col items-end">
                    <span className="text-xl font-bold text-accent tabular-nums">
                      <CountUp value={stat.score} trigger={showContent} />
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      Score
                    </span>
                  </div>
                )}
              </div>

              {stat.score && (
                <div className="mt-3 w-full bg-accent/10 h-1 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent transition-all duration-1000 ease-out"
                    style={{ 
                      width: showContent ? `${stat.score}%` : '0%',
                      transitionDelay: `${stat.delay + 600}ms`
                    }}
                  />
                </div>
              )}
            </Card>
          ))}

          <div className={cn(
            "grid grid-cols-3 gap-2 mt-4 transition-all duration-700",
            showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: '800ms' }}
          >
            <div className="p-2 rounded-lg bg-accent/5 border border-accent/10 text-center">
              <p className="text-[10px] text-accent uppercase tracking-wider mb-0.5">Jawline</p>
              <p className="text-sm text-foreground font-medium">{analysis.jawlineWidth}</p>
            </div>
            <div className="p-2 rounded-lg bg-accent/5 border border-accent/10 text-center">
              <p className="text-[10px] text-accent uppercase tracking-wider mb-0.5">Cheekbones</p>
              <p className="text-sm text-foreground font-medium">{analysis.cheekboneHeight}</p>
            </div>
            <div className="p-2 rounded-lg bg-accent/5 border border-accent/10 text-center">
              <p className="text-[10px] text-accent uppercase tracking-wider mb-0.5">Forehead</p>
              <p className="text-sm text-foreground font-medium">{analysis.foreheadWidth}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
