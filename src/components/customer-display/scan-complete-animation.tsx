'use client'

import { useEffect, useState } from 'react'
import { Check, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ScanCompleteAnimationProps {
  onComplete: () => void
}

export function ScanCompleteAnimation({ onComplete }: ScanCompleteAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const enterTimer = setTimeout(() => setIsVisible(true), 100)
    
    const exitTimer = setTimeout(() => setIsExiting(true), 2500)
    
    const completeTimer = setTimeout(() => onComplete(), 3000)

    return () => {
      clearTimeout(enterTimer)
      clearTimeout(exitTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-700",
      isExiting ? "opacity-0" : "opacity-100"
    )}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] transition-all duration-1000",
          isVisible ? "scale-100 opacity-100" : "scale-50 opacity-0"
        )} />
      </div>

      <div className="relative flex flex-col items-center">
        <div className={cn(
          "relative mb-8 transition-all duration-1000 ease-out",
          isVisible ? "scale-100 opacity-100 translate-y-0" : "scale-75 opacity-0 translate-y-10"
        )}>
          <div className="absolute inset-0 rounded-full border border-accent/30 animate-[spin_3s_linear_infinite]" />
          <div className="absolute inset-[-4px] rounded-full border border-accent/20 border-t-transparent animate-[spin_2s_linear_infinite_reverse]" />
          
          <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center border border-accent/50 gold-glow relative z-10">
            <Check className="w-12 h-12 text-accent" strokeWidth={3} />
          </div>

          <Sparkles className="absolute -top-4 -right-4 w-8 h-8 text-accent animate-pulse" />
          <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-accent/70 animate-pulse delay-300" />
        </div>

        <div className={cn(
          "text-center space-y-2 transition-all duration-1000 delay-300 ease-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        )}>
          <h2 className="text-4xl md:text-5xl font-serif font-medium text-foreground tracking-wide">
            Analisis Selesai
          </h2>
          <p className="text-xl text-muted-foreground font-sans">
            Menyiapkan profil gaya Anda...
          </p>
        </div>

        <div className={cn(
          "mt-12 w-64 h-1 bg-accent/20 rounded-full overflow-hidden transition-opacity duration-500 delay-500",
          isVisible ? "opacity-100" : "opacity-0"
        )}>
          <div className="h-full bg-accent animate-[shimmer_1.5s_infinite] w-full origin-left scale-x-0 animate-[grow_2s_ease-out_forwards]" />
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes grow {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
      `}</style>
    </div>
  )
}
