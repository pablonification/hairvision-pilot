'use client'

import { useEffect, useState } from 'react'
import { GeometricAnalysis, StyleCompatibility } from '@/types'
import { cn } from '@/lib/utils'
import { FaceShapeDiagram } from './face-shape-diagram'
import { AIRecommendationGrid } from './ai-recommendation-grid'

interface OverviewSectionProps {
  analysis: GeometricAnalysis
  compatibilityMatrix: StyleCompatibility[]
  isActive: boolean
  onSelectStyle?: (styleName: string) => void
}

export function OverviewSection({ 
  analysis, 
  compatibilityMatrix, 
  isActive,
  onSelectStyle 
}: OverviewSectionProps) {
  const [showContent, setShowContent] = useState(false)
  const [showRecommendations, setShowRecommendations] = useState(false)

  useEffect(() => {
    if (isActive) {
      const timer1 = setTimeout(() => setShowContent(true), 300)
      const timer2 = setTimeout(() => setShowRecommendations(true), 1500)
      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
      }
    } else {
      setShowContent(false)
      setShowRecommendations(false)
    }
    return undefined
  }, [isActive])

  if (!analysis) return null

  return (
    <div className={cn(
      "w-full h-full transition-all duration-700",
      isActive ? "opacity-100" : "opacity-0"
    )}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 h-full max-w-7xl mx-auto">
        <div className={cn(
          "lg:col-span-5 flex flex-col items-center justify-center transition-all duration-700",
          showContent ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
        )}>
          <div className="relative">
            <div className="absolute -inset-8 bg-accent/5 rounded-full blur-2xl" />
            
            <FaceShapeDiagram
              faceShape={analysis.faceShape}
              isActive={showContent}
              size="lg"
              showLabels={true}
              showLandmarks={true}
            />
          </div>

          <div className={cn(
            "mt-4 text-center transition-all duration-500 delay-1000",
            showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] mb-1">
              Bentuk Wajah Terdeteksi
            </p>
            <h3 className="text-3xl md:text-4xl font-serif text-accent capitalize">
              {analysis.faceShape}
            </h3>
          </div>

          <div className={cn(
            "grid grid-cols-3 gap-2 mt-4 w-full max-w-sm transition-all duration-500 delay-1200",
            showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <div className="p-2 rounded-lg bg-card/30 border border-accent/10 text-center">
              <p className="text-[10px] text-accent uppercase tracking-wider mb-0.5">Tekstur</p>
              <p className="text-sm text-foreground font-medium capitalize">
                {analysis.hairTexture}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-card/30 border border-accent/10 text-center">
              <p className="text-[10px] text-accent uppercase tracking-wider mb-0.5">Densitas</p>
              <p className="text-sm text-foreground font-medium capitalize">
                {analysis.hairDensity}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-card/30 border border-accent/10 text-center">
              <p className="text-[10px] text-accent uppercase tracking-wider mb-0.5">Simetri</p>
              <p className="text-sm text-foreground font-medium">
                {analysis.faceProportions?.symmetryScorePercent 
                  ? `${analysis.faceProportions.symmetryScorePercent}%` 
                  : 'Good'}
              </p>
            </div>
          </div>
        </div>

        <div className={cn(
          "lg:col-span-7 flex flex-col justify-center transition-all duration-700 delay-500",
          showRecommendations ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
        )}>
          <AIRecommendationGrid
            styles={compatibilityMatrix}
            isActive={showRecommendations}
            {...(onSelectStyle && { onSelectStyle })}
            maxItems={4}
          />
        </div>
      </div>
    </div>
  )
}
