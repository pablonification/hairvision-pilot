'use client'

import { Button } from "@/components/ui/button"
import { usePWA } from "@/components/pwa/pwa-provider"
import Link from "next/link"
import { Scissors, Camera, Download } from "lucide-react"

export default function Home() {
  const { isInstallable, isInstalled, installApp } = usePWA()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none transform translate-x-1/2 translate-y-1/2" />
      
      <div className="z-10 max-w-md w-full space-y-16 animate-in fade-in zoom-in duration-700">
        <div className="space-y-6">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-accent/10 mb-2 border border-accent/20 gold-glow">
             <Scissors className="w-10 h-10 text-accent" />
          </div>
          <div className="space-y-2">
            <h1 className="font-serif text-6xl font-bold tracking-tighter text-white">
              Hair<span className="text-gold-gradient">Vision</span>
            </h1>
            <p className="text-muted-foreground text-lg font-sans font-medium tracking-wide">
              PILOT EDITION
            </p>
          </div>
          <p className="text-muted-foreground/80 text-base font-sans max-w-[280px] mx-auto leading-relaxed border-t border-border pt-6 mt-6">
            Precision AI analysis. <br/>
            Personalized style recommendations.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/scan" className="block w-full">
            <Button size="xl" className="w-full text-lg shadow-[0_0_30px_rgba(201,162,39,0.15)] group relative overflow-hidden">
              <span className="relative z-10 flex items-center justify-center">
                Start Client Scan <Camera className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
              </span>
            </Button>
          </Link>
          
          {isInstallable && !isInstalled && (
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full border-accent/30 hover:bg-accent/10"
              onClick={installApp}
            >
              <Download className="w-4 h-4 mr-2" />
              Install App
            </Button>
          )}
          
          <div className="flex justify-center space-x-8 text-xs text-muted-foreground uppercase tracking-widest font-semibold pt-4">
            <span>Face Shape</span>
            <span className="text-accent">•</span>
            <span>Hair Type</span>
            <span className="text-accent">•</span>
            <span>Style</span>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 w-full text-center opacity-30">
        <p className="text-[10px] uppercase tracking-[0.3em] font-sans">
          {isInstalled ? "Installed App" : "Designed for Barbers"}
        </p>
      </div>
    </main>
  )
}
