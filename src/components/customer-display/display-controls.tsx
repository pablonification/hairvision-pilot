'use client'

import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  Monitor, 
  Smartphone, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Settings
} from 'lucide-react'

export type DisplayMode = 'landscape' | 'portrait'

interface DisplayControlsProps {
  displayMode: DisplayMode
  onDisplayModeChange: (mode: DisplayMode) => void
  autoAdvance: boolean
  onAutoAdvanceChange: (enabled: boolean) => void
  autoAdvanceInterval: number
  onAutoAdvanceIntervalChange: (interval: number) => void
  soundEnabled: boolean
  onSoundEnabledChange: (enabled: boolean) => void
  currentProgress?: number
  className?: string
}

const INTERVAL_OPTIONS = [
  { value: 5000, label: '5 detik' },
  { value: 10000, label: '10 detik' },
  { value: 15000, label: '15 detik' },
  { value: 20000, label: '20 detik' },
]

export function DisplayControls({
  displayMode,
  onDisplayModeChange,
  autoAdvance,
  onAutoAdvanceChange,
  autoAdvanceInterval,
  onAutoAdvanceIntervalChange,
  soundEnabled,
  onSoundEnabledChange,
  currentProgress = 0,
  className,
}: DisplayControlsProps) {
  const [showSettings, setShowSettings] = useState(false)

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-card/50 rounded-full border border-white/10 p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDisplayModeChange('landscape')}
            className={cn(
              "rounded-full h-8 px-3 gap-1.5",
              displayMode === 'landscape' 
                ? "bg-accent text-accent-foreground" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Monitor className="w-4 h-4" />
            <span className="text-xs hidden md:inline">TV</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDisplayModeChange('portrait')}
            className={cn(
              "rounded-full h-8 px-3 gap-1.5",
              displayMode === 'portrait' 
                ? "bg-accent text-accent-foreground" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Smartphone className="w-4 h-4" />
            <span className="text-xs hidden md:inline">Tablet</span>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAutoAdvanceChange(!autoAdvance)}
          className={cn(
            "rounded-full h-8 px-3 gap-1.5 border",
            autoAdvance 
              ? "bg-green-500/20 border-green-500/30 text-green-400" 
              : "bg-card/50 border-white/10 text-muted-foreground"
          )}
        >
          {autoAdvance ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span className="text-xs hidden md:inline">
            {autoAdvance ? 'Auto ON' : 'Auto OFF'}
          </span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSoundEnabledChange(!soundEnabled)}
          className={cn(
            "rounded-full h-8 w-8 p-0 border",
            soundEnabled 
              ? "bg-accent/20 border-accent/30 text-accent" 
              : "bg-card/50 border-white/10 text-muted-foreground"
          )}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
          className="rounded-full h-8 w-8 p-0 bg-card/50 border border-white/10 text-muted-foreground"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {autoAdvance && (
        <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent transition-all ease-linear"
            style={{ 
              width: `${currentProgress}%`,
              transitionDuration: currentProgress === 0 ? '0ms' : `${autoAdvanceInterval}ms`
            }}
          />
        </div>
      )}

      {showSettings && (
        <div className="absolute top-full right-0 mt-2 bg-card border border-white/10 rounded-lg shadow-xl p-4 min-w-[240px] z-50 animate-fadeIn">
          <h4 className="text-sm font-medium text-foreground mb-3">Display Settings</h4>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">
                Auto-advance Interval
              </label>
              <div className="grid grid-cols-2 gap-2">
                {INTERVAL_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    onClick={() => onAutoAdvanceIntervalChange(option.value)}
                    className={cn(
                      "text-xs py-2 px-3 rounded-lg border transition-all",
                      autoAdvanceInterval === option.value
                        ? "bg-accent text-accent-foreground border-accent"
                        : "bg-white/5 text-muted-foreground border-white/10 hover:border-white/20"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10">
              <p className="text-xs text-muted-foreground">
                Mode: <span className="text-foreground capitalize">{displayMode}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Sound: <span className="text-foreground">{soundEnabled ? 'On' : 'Off'}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function useAutoAdvance(
  enabled: boolean,
  interval: number,
  onAdvance: () => void,
  totalSections: number,
  currentIndex: number
) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!enabled || currentIndex >= totalSections - 1) {
      setProgress(0)
      return
    }

    setProgress(0)
    
    const startTime = Date.now()
    
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min((elapsed / interval) * 100, 100)
      setProgress(newProgress)
    }, 50)

    const advanceTimeout = setTimeout(() => {
      onAdvance()
      setProgress(0)
    }, interval)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(advanceTimeout)
    }
  }, [enabled, interval, onAdvance, currentIndex, totalSections])

  return progress
}

export function useSoundEffects(enabled: boolean) {
  const playSound = useCallback((type: 'transition' | 'complete' | 'click') => {
    if (!enabled || typeof window === 'undefined') return

    const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    const sounds = {
      transition: { freq: 800, duration: 0.1, type: 'sine' as OscillatorType },
      complete: { freq: 1200, duration: 0.2, type: 'sine' as OscillatorType },
      click: { freq: 600, duration: 0.05, type: 'square' as OscillatorType },
    }

    const sound = sounds[type]
    oscillator.frequency.value = sound.freq
    oscillator.type = sound.type
    gainNode.gain.value = 0.1

    oscillator.start()
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + sound.duration)
    oscillator.stop(audioContext.currentTime + sound.duration)
  }, [enabled])

  return { playSound }
}
