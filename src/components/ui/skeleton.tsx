import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-white/5",
        className
      )}
    />
  )
}

export function CardSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("rounded-xl border border-white/10 bg-card/50 p-6", className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="h-14 w-14 rounded-lg" />
      </div>
      <Skeleton className="h-10 w-full mt-4" />
    </div>
  )
}

export function ImageSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("rounded-lg bg-card/50 border border-white/10 overflow-hidden", className)}>
      <div className="aspect-[4/5] relative">
        <Skeleton className="absolute inset-0" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
        </div>
      </div>
    </div>
  )
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {[1, 2].map((i) => (
        <div key={i} className="bg-card border border-border rounded p-4">
          <Skeleton className="h-3 w-16 mb-2" />
          <Skeleton className="h-6 w-24" />
        </div>
      ))}
    </div>
  )
}

export function SessionSkeleton() {
  return (
    <div className="bg-card border border-accent/20 rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex items-center justify-between gap-6">
        <div className="flex-1 space-y-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
        <Skeleton className="h-20 w-20 rounded-lg" />
      </div>
    </div>
  )
}

export function ResultPageSkeleton() {
  return (
    <div className="min-h-screen bg-background pb-48 relative">
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
      
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-9 w-9 rounded" />
      </header>

      <main className="px-6 py-8 space-y-8 max-w-lg mx-auto">
        <SessionSkeleton />
        <StatsSkeleton />
        <ImageSkeleton />
        
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </main>
    </div>
  )
}
