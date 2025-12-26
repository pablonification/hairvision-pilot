'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DUMMY_ANALYSIS_RESULT } from '@/lib/dummy-data'
import { CustomerDisplaySection } from '@/types'
import { Button } from '@/components/ui/button'
import { ChevronRight, ChevronLeft, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

import { ScanCompleteAnimation } from '@/components/customer-display/scan-complete-animation'
import { ProfileAnalysisSection } from '@/components/customer-display/profile-analysis-section'
import { CompatibilityMatrixSection } from '@/components/customer-display/compatibility-matrix-section'
import { RecommendationDetailCard } from '@/components/customer-display/recommendation-detail-card'
import { ProductRecommendationSection } from '@/components/customer-display/product-recommendation-section'

export default function CustomerDisplayPage() {
  const router = useRouter()

  const [currentSection, setCurrentSection] = useState<CustomerDisplaySection>('scan_complete')
  const [showAnimation, setShowAnimation] = useState(true)

  const sections: CustomerDisplaySection[] = [
    'profile_analysis',
    'compatibility_matrix',
    'recommendation_1',
    'recommendation_2',
    'products'
  ]

  const handleAnimationComplete = () => {
    setShowAnimation(false)
    setCurrentSection('profile_analysis')
  }

  const navigate = (direction: 'next' | 'prev') => {
    const currentIndex = sections.indexOf(currentSection)
    if (direction === 'next') {
      const nextSection = sections[currentIndex + 1]
      if (nextSection) setCurrentSection(nextSection)
    } else if (direction === 'prev') {
      const prevSection = sections[currentIndex - 1]
      if (prevSection) setCurrentSection(prevSection)
    }
  }

  const getProgress = () => {
    const currentIndex = sections.indexOf(currentSection)
    return ((currentIndex + 1) / sections.length) * 100
  }

  const primaryRec = DUMMY_ANALYSIS_RESULT.recommendations[0]
  const secondaryRec = DUMMY_ANALYSIS_RESULT.recommendations[1]
  const products = primaryRec.barberInstructions.styling.products
  const instructions = primaryRec.barberInstructions.styling

  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      {showAnimation && (
        <ScanCompleteAnimation onComplete={handleAnimationComplete} />
      )}

      <div className="relative z-10 container mx-auto px-6 py-8 h-screen flex flex-col">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/10 border border-accent/20 rounded-lg flex items-center justify-center">
              <span className="font-serif font-bold text-accent text-xl">H</span>
            </div>
            <span className="text-sm tracking-[0.2em] text-muted-foreground uppercase">HairVision AI</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-card/50 rounded-full border border-white/5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Live Session</span>
            </div>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center relative">
          {currentSection === 'profile_analysis' && (
            <ProfileAnalysisSection 
              analysis={DUMMY_ANALYSIS_RESULT.geometricAnalysis} 
              isActive={true} 
            />
          )}

          {currentSection === 'compatibility_matrix' && (
            <CompatibilityMatrixSection 
              styles={DUMMY_ANALYSIS_RESULT.compatibilityMatrix || []} 
              isActive={true}
            />
          )}

          {currentSection === 'recommendation_1' && (
            <RecommendationDetailCard 
              recommendation={primaryRec} 
              isActive={true}
              rank={1}
            />
          )}

          {currentSection === 'recommendation_2' && (
            <RecommendationDetailCard 
              recommendation={secondaryRec} 
              isActive={true}
              rank={2}
            />
          )}

          {currentSection === 'products' && (
            <ProductRecommendationSection 
              products={products}
              instructions={instructions}
              isActive={true}
            />
          )}
        </div>

        <footer className="mt-8 pt-6 border-t border-white/5">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => navigate('prev')}
              disabled={currentSection === sections[0]}
              className={cn(
                "text-muted-foreground hover:text-foreground transition-opacity",
                currentSection === sections[0] ? "opacity-0 pointer-events-none" : "opacity-100"
              )}
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Kembali
            </Button>

            <div className="flex gap-2">
              {sections.map((section, idx) => (
                <div 
                  key={section}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-500",
                    sections.indexOf(currentSection) === idx 
                      ? "w-8 bg-accent gold-glow" 
                      : sections.indexOf(currentSection) > idx 
                        ? "bg-accent/50" 
                        : "bg-accent/10"
                  )}
                />
              ))}
            </div>

            <div className="flex gap-4">
              {currentSection === sections[sections.length - 1] ? (
                <Button 
                  size="lg" 
                  className="bg-accent text-accent-foreground hover:bg-accent/90 min-w-[140px]"
                  onClick={() => router.push('/')}
                >
                  <Home className="w-5 h-5 mr-2" />
                  Selesai
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  className="bg-accent text-accent-foreground hover:bg-accent/90 min-w-[140px] group"
                  onClick={() => navigate('next')}
                >
                  Lanjut
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 h-0.5 bg-accent/20 w-full">
            <div 
              className="h-full bg-accent transition-all duration-500 ease-out"
              style={{ width: `${getProgress()}%` }}
            />
          </div>
        </footer>
      </div>
    </main>
  )
}
