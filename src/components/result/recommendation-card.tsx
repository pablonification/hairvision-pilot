"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, Star, Scissors } from "lucide-react"
import { cn } from "@/lib/utils"
import { BarberScript } from "./barber-script"

interface RecommendationCardProps {
  title: string
  score: number
  description: string
  script: string
  isPrimary?: boolean
}

export function RecommendationCard({ title, score, description, script, isPrimary }: RecommendationCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className={cn(
      "border-2 transition-all duration-300 overflow-visible bg-card",
      isPrimary ? "border-accent shadow-[0_0_20px_rgba(201,162,39,0.1)]" : "border-border"
    )}>
      {isPrimary && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-sm text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1 z-10">
          <Star className="w-3 h-3 fill-current" /> Best Match
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
           <div className="flex-1 pr-4">
             <h3 className="font-serif text-2xl font-bold text-white mb-2">{title}</h3>
             <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
           </div>
           <div className="flex flex-col items-center justify-center bg-white/5 rounded p-2 min-w-[60px]">
             <div className={cn(
               "text-xl font-bold",
               isPrimary ? "text-accent" : "text-white"
             )}>
               {score}%
             </div>
             <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Match</span>
           </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/5">
           <Button 
             variant="ghost" 
             className="w-full justify-between hover:bg-white/5 group h-auto py-2"
             onClick={() => setExpanded(!expanded)}
           >
             <span className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground group-hover:text-accent transition-colors font-bold">
               <Scissors className="w-3 h-3" /> Barber Script
             </span>
             <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform duration-300", expanded ? "rotate-180" : "")} />
           </Button>
           
           <div className={cn(
             "grid transition-[grid-template-rows] duration-300 ease-out",
             expanded ? "grid-rows-[1fr] mt-4" : "grid-rows-[0fr] mt-0"
           )}>
             <div className="overflow-hidden">
               <BarberScript content={script} />
             </div>
           </div>
        </div>
      </div>
    </Card>
  )
}
