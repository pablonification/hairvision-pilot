import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export function ScanProgress({ total = 4, current, className }: { total?: number; current: number; className?: string }) {
  const steps = ["Front", "Top", "Left", "Right"]
  
  return (
    <div className={cn("w-full max-w-md mx-auto py-2", className)}>
      <div className="flex justify-between items-center relative px-2">
        <div className="absolute left-2 right-2 top-1/2 -translate-y-1/2 h-0.5 bg-muted -z-10" />
        <div 
          className="absolute left-2 top-1/2 -translate-y-1/2 h-0.5 bg-accent -z-10 transition-all duration-300" 
          style={{ width: `${(current / (total - 1)) * 100}%` }}
        />
        
        {steps.map((label, index) => {
          const isCompleted = index < current
          const isCurrent = index === current
          
          return (
            <div key={label} className="relative group">
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10",
                  isCompleted ? "bg-accent border-accent text-accent-foreground" : 
                  isCurrent ? "border-accent bg-background text-accent shadow-[0_0_15px_rgba(201,162,39,0.5)] scale-110" : 
                  "border-muted bg-card text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{index + 1}</span>}
              </div>
              
              <div className={cn(
                "absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-300",
                isCurrent ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-1"
              )}>
                <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded">
                  {label} Angle
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
