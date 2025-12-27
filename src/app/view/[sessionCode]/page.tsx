'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { DUMMY_ANALYSIS_RESULT } from '@/lib/dummy-data'
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'
import type { Session } from '@/lib/supabase/types'
import { CustomerDisplaySection, AnalysisResult } from '@/types'
import { Button } from '@/components/ui/button'
import { ChevronRight, ChevronLeft, Home, Loader2, WifiOff } from 'lucide-react'
import { cn } from '@/lib/utils'

import { ScanCompleteAnimation } from '@/components/customer-display/scan-complete-animation'
import { ProfileAnalysisSection } from '@/components/customer-display/profile-analysis-section'
import { RecommendationDetailCard } from '@/components/customer-display/recommendation-detail-card'
import { ProductRecommendationSection } from '@/components/customer-display/product-recommendation-section'
import { OverviewSection } from '@/components/customer-display/overview-section'
import { StyleComparisonView } from '@/components/customer-display/style-comparison-view'

interface PageProps {
  params: Promise<{ sessionCode: string }>
}

export default function CustomerDisplayPage({ params }: PageProps) {
  const { sessionCode } = use(params)
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [currentSection, setCurrentSection] = useState<CustomerDisplaySection>('loading')
  const [showAnimation, setShowAnimation] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isDemoMode = sessionCode.toLowerCase() === 'demo'

  useEffect(() => {
    if (isDemoMode) {
      setAnalysisResult(DUMMY_ANALYSIS_RESULT)
      setIsLoading(false)
      setShowAnimation(true)
      setCurrentSection('scan_complete')
      return
    }

    if (!isSupabaseConfigured()) {
      setError('Database tidak dikonfigurasi. Gunakan /view/demo untuk preview.')
      setIsLoading(false)
      return
    }

    const fetchSession = async () => {
      const { data, error: fetchError } = await supabase
        .from('sessions')
        .select('*')
        .eq('session_code', sessionCode.toUpperCase())
        .single()

      if (fetchError || !data) {
        setError('Session tidak ditemukan atau sudah kadaluarsa.')
        setIsLoading(false)
        return
      }

      const session = data as Session
      setAnalysisResult(session.analysis_result)
      setCurrentSection(session.current_section)
      setIsConnected(true)
      setIsLoading(false)

      if (session.current_section === 'scan_complete') {
        setShowAnimation(true)
      }
    }

    fetchSession()

    const channel = supabase
      .channel(`session:${sessionCode}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sessions',
          filter: `session_code=eq.${sessionCode.toUpperCase()}`,
        },
        (payload) => {
          const updated = payload.new as Session
          // Only update analysisResult if it's present in the payload
          // (PATCH might only update current_section, not the full record)
          if (updated.analysis_result) {
            setAnalysisResult(updated.analysis_result)
          }
          setCurrentSection(updated.current_section)
          
          if (updated.current_section === 'scan_complete') {
            setShowAnimation(true)
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED')
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [sessionCode, isDemoMode])

  const sections: CustomerDisplaySection[] = [
    'overview',
    'profile_analysis',
    'recommendation_1',
    'recommendation_2',
    'style_comparison',
    'products'
  ]

  const handleAnimationComplete = () => {
    setShowAnimation(false)
    setCurrentSection('overview')
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

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-accent animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Menghubungkan ke sesi...</p>
          <p className="text-sm text-muted-foreground/60 mt-2">Kode: {sessionCode.toUpperCase()}</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <WifiOff className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-xl font-semibold mb-2">Koneksi Gagal</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button variant="outline" onClick={() => router.push('/')}>
            Kembali ke Beranda
          </Button>
        </div>
      </main>
    )
  }

  if (!analysisResult) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-accent animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Menunggu hasil analisis...</p>
        </div>
      </main>
    )
  }

  const primaryRec = analysisResult.recommendations[0]
  const secondaryRec = analysisResult.recommendations[1]
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

      <div className="relative z-10 container mx-auto px-6 py-4 h-screen flex flex-col">
        <header className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/10 border border-accent/20 rounded-lg flex items-center justify-center">
              <span className="font-serif font-bold text-accent text-xl">H</span>
            </div>
            <span className="text-sm tracking-[0.2em] text-muted-foreground uppercase">HairVision AI</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-card/50 rounded-full border border-white/5">
              <div className={cn(
                "w-2 h-2 rounded-full",
                isConnected || isDemoMode ? "bg-green-500 animate-pulse" : "bg-yellow-500"
              )} />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                {isDemoMode ? 'Demo Mode' : isConnected ? 'Live Session' : 'Connecting...'}
              </span>
            </div>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center relative">
          {currentSection === 'overview' && (
            <OverviewSection
              analysis={analysisResult.geometricAnalysis}
              compatibilityMatrix={analysisResult.compatibilityMatrix || []}
              isActive={true}
            />
          )}

          {currentSection === 'profile_analysis' && (
            <ProfileAnalysisSection 
              analysis={analysisResult.geometricAnalysis} 
              isActive={true} 
            />
          )}

          {currentSection === 'recommendation_1' && (
            <RecommendationDetailCard 
              recommendation={primaryRec} 
              isActive={true}
              rank={1}
              visualizationUrl={analysisResult.visualizations?.[primaryRec.id]}
            />
          )}

          {currentSection === 'recommendation_2' && secondaryRec && (
            <RecommendationDetailCard 
              recommendation={secondaryRec} 
              isActive={true}
              rank={2}
              visualizationUrl={analysisResult.visualizations?.[secondaryRec.id]}
            />
          )}

          {currentSection === 'style_comparison' && (
            <StyleComparisonView
              recommendations={analysisResult.recommendations}
              {...(analysisResult.visualizations && { visualizations: analysisResult.visualizations })}
              isActive={true}
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

        <footer className="mt-4 pt-4 border-t border-white/5">
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
