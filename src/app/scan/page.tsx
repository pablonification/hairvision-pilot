"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScanProgress } from "@/components/camera/scan-progress"
import { CameraViewfinder, useCamera } from "@/components/camera/camera-viewfinder"
import { ChevronRight, X, Smartphone } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { PhotoAngle, CapturedPhoto, PhotoSession } from "@/types"

const ANGLES: PhotoAngle[] = ["front", "top", "left", "right"]

const ANGLE_GUIDES: Record<PhotoAngle, string> = {
  front: "Look directly at the camera",
  top: "Tilt head down slightly",
  left: "Turn head to show left side",
  right: "Turn head to show right side",
}

export default function ScanPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [capturedPhotos, setCapturedPhotos] = useState<Record<PhotoAngle, CapturedPhoto | null>>({
    front: null,
    top: null,
    left: null,
    right: null,
  })
  const router = useRouter()

  const currentAngle: PhotoAngle = ANGLES[currentStep]!
  const camera = useCamera(currentAngle)

  const handleCapture = () => {
    const photo = camera.capture()
    if (!photo) return

  const updatedPhotos = { ...capturedPhotos, [currentAngle!]: photo }
  setCapturedPhotos(updatedPhotos)

    if (currentStep < ANGLES.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      setIsAnalyzing(true)

      const newSession: PhotoSession = {
        id: crypto.randomUUID(),
        photos: updatedPhotos,
        createdAt: new Date(),
      }

      sessionStorage.setItem("hairvision_session", JSON.stringify(newSession))

      setTimeout(() => {
        router.push("/result")
      }, 2000)
    }
  }

  const handleRetake = () => {
    if (capturedPhotos[currentAngle!]) {
      setCapturedPhotos({ ...capturedPhotos, [currentAngle!]: null })
    }
  }

  const handleCameraError = (error: string) => {
    console.error("Camera error:", error)
    setIsAnalyzing(false)
  }

  return (
    <div className="flex flex-col h-screen bg-black relative overflow-hidden">
      <div className="pt-6 pb-2 px-4 z-20 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
        <div className="flex justify-between items-center mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <X className="w-6 h-6" />
            </Button>
          </Link>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30">
            <Smartphone className="w-3 h-3 text-accent animate-pulse" />
            <span className="text-xs font-bold text-accent tracking-wider">LIVE CAM</span>
          </div>
          <div className="w-10" />
        </div>
        <ScanProgress current={currentStep} total={ANGLES.length} />
      </div>

      <div className="flex-1 relative overflow-hidden">
        <CameraViewfinder
          currentAngle={currentAngle!}
          webcamRef={camera.webcamRef}
          facingMode={camera.facingMode}
          onSwitchCamera={camera.switchCamera}
          onCameraError={handleCameraError}
        />
      </div>

      <div className="bg-black/90 px-6 py-8 pb-12 rounded-t-3xl border-t border-white/10 relative z-30">
        <div className="flex justify-between items-center max-w-sm mx-auto">
          <div className="w-12 flex justify-start">
            {capturedPhotos[currentAngle] && !isAnalyzing && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRetake}
                className="text-white hover:bg-white/10"
              >
                <ChevronRight className="w-6 h-6 rotate-180" />
              </Button>
            )}
            {!capturedPhotos[currentAngle!] && <div className="w-12" />}
          </div>

          <Button
            onClick={handleCapture}
            disabled={isAnalyzing || camera.error !== null}
            className={cn(
              "w-20 h-20 rounded-full border-4 border-white/20 p-1 bg-transparent hover:bg-transparent shadow-none transition-all duration-200 active:scale-95 group",
              isAnalyzing || camera.error !== null ? "opacity-50 cursor-not-allowed" : ""
            )}
          >
            <div className="w-full h-full rounded-full bg-white group-hover:bg-accent transition-colors duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)]" />
          </Button>

          <div className="w-12 flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentStep((prev) => Math.min(prev + 1, ANGLES.length - 1))}
              className="text-white hover:bg-white/10"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {!isAnalyzing && (
          <div className="text-center mt-6">
            <p className="text-white font-bold text-xl capitalize drop-shadow-md">
              {currentAngle!}
            </p>
            <p className="text-accent/80 text-sm mt-1 tracking-wide">
              {ANGLE_GUIDES[currentAngle!]}
            </p>
            {camera.error && (
              <p className="text-red-400 text-xs mt-2">{camera.error}</p>
            )}
          </div>
        )}

        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-t-3xl backdrop-blur-sm">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-accent font-bold tracking-widest animate-pulse">ANALYZING GEOMETRY...</p>
            <p className="text-white/60 text-sm mt-2">
              Processing {Object.values(capturedPhotos).filter((p): p is CapturedPhoto => p !== null).length} images
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
