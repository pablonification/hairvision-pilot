"use client"

import { useRef, useCallback, useState } from "react"
import Webcam from "react-webcam"
import type { PhotoAngle, CapturedPhoto } from "@/types"

const VIDEO_CONSTRAINTS: MediaTrackConstraints = {
  width: { ideal: 1280 },
  height: { ideal: 720 },
  facingMode: "user",
}

interface UseCameraReturn {
  webcamRef: React.RefObject<Webcam | null>
  capture: () => CapturedPhoto | null
  error: string | null
  switchCamera: () => void
  facingMode: "user" | "environment"
}

export function useCamera(currentAngle: PhotoAngle): UseCameraReturn {
  const webcamRef = useRef<Webcam | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user")

  const capture = useCallback((): CapturedPhoto | null => {
    if (!webcamRef.current) {
      setError("Camera not initialized")
      return null
    }

    const imageSrc = webcamRef.current.getScreenshot()
    if (!imageSrc) {
      setError("Failed to capture image")
      return null
    }

    return {
      angle: currentAngle,
      dataUrl: imageSrc,
      capturedAt: new Date(),
    }
  }, [currentAngle])

  const switchCamera = useCallback(() => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"))
  }, [])

  return {
    webcamRef,
    capture,
    error,
    switchCamera,
    facingMode,
  }
}

interface CameraViewfinderProps {
  currentAngle: PhotoAngle
  webcamRef: React.RefObject<Webcam | null>
  facingMode: "user" | "environment"
  onSwitchCamera: () => void
  onCameraError: (error: string) => void
}

export function CameraViewfinder({
  currentAngle,
  webcamRef,
  facingMode,
  onSwitchCamera,
  onCameraError,
}: CameraViewfinderProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)

  const handleUserMedia = useCallback(() => {
    setHasPermission(true)
  }, [])

  const handleUserMediaError = useCallback(() => {
    setHasPermission(false)
    onCameraError("Camera access denied")
  }, [onCameraError])

  if (hasPermission === false) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        <div className="text-center p-6">
          <p className="text-white mb-2">Camera access required</p>
          <p className="text-muted-foreground text-sm">
            Please enable camera permissions in your browser settings
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute inset-0">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        screenshotQuality={0.9}
        videoConstraints={{
          ...VIDEO_CONSTRAINTS,
          facingMode,
        }}
        onUserMedia={handleUserMedia}
        onUserMediaError={handleUserMediaError}
        className={`absolute inset-0 w-full h-full object-cover ${
          facingMode === "user" ? "scale-x-[-1]" : ""
        }`}
      />
      
      <CameraOverlay currentAngle={currentAngle} />
      
      <button
        onClick={onSwitchCamera}
        className="absolute top-4 left-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        aria-label="Switch camera"
        type="button"
      >
        <SwitchCameraIcon />
      </button>
    </div>
  )
}

function CameraOverlay({ currentAngle }: { currentAngle: PhotoAngle }) {
  const angleGuide: Record<PhotoAngle, string> = {
    front: "Look directly at the camera",
    top: "Tilt head down slightly",
    left: "Turn head to show left side",
    right: "Turn head to show right side",
  }

  return (
    <>
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
      </div>

      <div className="absolute inset-8 z-10 border border-white/20 rounded-lg pointer-events-none">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-accent rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-accent rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-accent rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-accent rounded-br-lg" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/50" />
          <div className="absolute left-1/2 top-0 h-full w-[1px] bg-white/50" />
        </div>
      </div>

      <div className="absolute bottom-8 left-0 w-full text-center z-20 pointer-events-none">
        <p className="text-white font-medium text-lg drop-shadow-md capitalize">
          {currentAngle} View
        </p>
        <p className="text-white/60 text-sm mt-1">{angleGuide[currentAngle]}</p>
      </div>

      <div className="absolute inset-0 z-10 animate-scan pointer-events-none">
        <div className="w-full h-0.5 bg-accent shadow-[0_0_20px_rgba(201,162,39,1)]" />
      </div>
    </>
  )
}

function SwitchCameraIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" />
      <path d="M13 5h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5" />
      <circle cx="12" cy="12" r="3" />
      <path d="m18 22-3-3 3-3" />
      <path d="m6 2 3 3-3 3" />
    </svg>
  )
}

export { VIDEO_CONSTRAINTS }
