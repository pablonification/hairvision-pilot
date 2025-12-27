'use client'

import { useEffect, useState } from 'react'
import { FaceShape } from '@/types'
import { cn } from '@/lib/utils'

interface FaceShapeDiagramProps {
  faceShape: FaceShape
  isActive?: boolean
  size?: 'sm' | 'md' | 'lg'
  showLabels?: boolean
  showLandmarks?: boolean
}

// Face shape outline paths - stylized SVG paths for each face shape
const FACE_PATHS: Record<FaceShape, string> = {
  oval: 'M150,30 C200,30 240,60 250,100 C260,150 260,200 250,250 C240,300 210,340 150,350 C90,340 60,300 50,250 C40,200 40,150 50,100 C60,60 100,30 150,30 Z',
  round: 'M150,40 C220,40 260,90 260,160 C260,230 220,290 150,300 C80,290 40,230 40,160 C40,90 80,40 150,40 Z',
  square: 'M60,50 L240,50 C250,50 260,60 260,70 L260,280 C260,300 240,320 220,330 L150,340 L80,330 C60,320 40,300 40,280 L40,70 C40,60 50,50 60,50 Z',
  heart: 'M150,340 C100,300 50,240 50,160 C50,100 70,60 100,45 C130,30 150,35 150,35 C150,35 170,30 200,45 C230,60 250,100 250,160 C250,240 200,300 150,340 Z',
  diamond: 'M150,30 L250,170 L150,340 L50,170 Z',
  triangle: 'M150,40 C180,40 200,50 200,70 L220,280 C220,310 190,340 150,340 C110,340 80,310 80,280 L100,70 C100,50 120,40 150,40 Z',
  oblong: 'M150,20 C200,20 230,50 240,90 C250,140 250,200 250,260 C250,310 220,360 150,370 C80,360 50,310 50,260 C50,200 50,140 60,90 C70,50 100,20 150,20 Z',
}

// Landmark points for face mapping visualization
const LANDMARK_POINTS = [
  // Forehead
  { x: 150, y: 60, label: 'Forehead Center' },
  { x: 100, y: 70, label: 'Left Temple' },
  { x: 200, y: 70, label: 'Right Temple' },
  // Eyes
  { x: 110, y: 120, label: 'Left Eye' },
  { x: 190, y: 120, label: 'Right Eye' },
  // Cheekbones
  { x: 70, y: 160, label: 'Left Cheekbone' },
  { x: 230, y: 160, label: 'Right Cheekbone' },
  // Nose
  { x: 150, y: 180, label: 'Nose Tip' },
  // Jawline
  { x: 80, y: 240, label: 'Left Jaw' },
  { x: 220, y: 240, label: 'Right Jaw' },
  // Chin
  { x: 150, y: 310, label: 'Chin' },
]

// Measurement lines for proportions
const MEASUREMENT_LINES = [
  { x1: 70, y1: 160, x2: 230, y2: 160, label: 'Cheekbone Width' },
  { x1: 80, y1: 240, x2: 220, y2: 240, label: 'Jawline Width' },
  { x1: 150, y1: 60, x2: 150, y2: 310, label: 'Face Length' },
]

const SIZE_CONFIG = {
  sm: { width: 150, height: 180, scale: 0.5 },
  md: { width: 250, height: 300, scale: 0.83 },
  lg: { width: 300, height: 360, scale: 1 },
}

export function FaceShapeDiagram({
  faceShape,
  isActive = true,
  size = 'lg',
  showLabels = true,
  showLandmarks = true,
}: FaceShapeDiagramProps) {
  const [animationPhase, setAnimationPhase] = useState(0)
  const [visibleLandmarks, setVisibleLandmarks] = useState<number[]>([])

  const config = SIZE_CONFIG[size]
  const path = FACE_PATHS[faceShape]

  useEffect(() => {
    if (!isActive) {
      setAnimationPhase(0)
      setVisibleLandmarks([])
      return
    }

    // Phase 1: Draw outline
    const phase1 = setTimeout(() => setAnimationPhase(1), 100)
    
    // Phase 2: Show landmarks one by one
    const landmarkTimers: NodeJS.Timeout[] = []
    LANDMARK_POINTS.forEach((_, idx) => {
      const timer = setTimeout(() => {
        setVisibleLandmarks(prev => [...prev, idx])
      }, 500 + idx * 100)
      landmarkTimers.push(timer)
    })

    // Phase 3: Show measurements
    const phase3 = setTimeout(() => setAnimationPhase(3), 1800)

    return () => {
      clearTimeout(phase1)
      clearTimeout(phase3)
      landmarkTimers.forEach(clearTimeout)
    }
  }, [isActive])

  return (
    <div className={cn(
      "relative transition-all duration-700",
      isActive ? "opacity-100 scale-100" : "opacity-0 scale-95"
    )}>
      <svg
        width={config.width}
        height={config.height}
        viewBox="0 0 300 360"
        className="overflow-visible"
      >
        {/* Glow filter */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="faceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(201, 162, 39)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="rgb(201, 162, 39)" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Face outline with animated stroke */}
        <path
          d={path}
          fill="url(#faceGradient)"
          stroke="rgb(201, 162, 39)"
          strokeWidth="2"
          className={cn(
            "transition-all duration-1000",
            animationPhase >= 1 ? "opacity-100" : "opacity-0"
          )}
          style={{
            strokeDasharray: 1000,
            strokeDashoffset: animationPhase >= 1 ? 0 : 1000,
            transition: 'stroke-dashoffset 1.5s ease-out, opacity 0.5s',
          }}
          filter="url(#glow)"
        />

        {/* Scanning line animation */}
        {animationPhase >= 1 && animationPhase < 3 && (
          <line
            x1="40"
            y1="0"
            x2="260"
            y2="0"
            stroke="rgb(34, 211, 238)"
            strokeWidth="2"
            opacity="0.6"
            className="animate-[scanLine_2s_ease-in-out_infinite]"
          />
        )}

        {/* Measurement lines */}
        {animationPhase >= 3 && MEASUREMENT_LINES.map((line, idx) => (
          <g key={idx} className="animate-fadeIn" style={{ animationDelay: `${idx * 200}ms` }}>
            <line
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="rgb(201, 162, 39)"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.4"
            />
            {/* Endpoint markers */}
            <circle cx={line.x1} cy={line.y1} r="3" fill="rgb(201, 162, 39)" opacity="0.6" />
            <circle cx={line.x2} cy={line.y2} r="3" fill="rgb(201, 162, 39)" opacity="0.6" />
          </g>
        ))}

        {/* Landmark points */}
        {showLandmarks && LANDMARK_POINTS.map((point, idx) => (
          <g
            key={idx}
            className={cn(
              "transition-all duration-500",
              visibleLandmarks.includes(idx) ? "opacity-100 scale-100" : "opacity-0 scale-0"
            )}
            style={{ transformOrigin: `${point.x}px ${point.y}px` }}
          >
            {/* Outer pulse ring */}
            <circle
              cx={point.x}
              cy={point.y}
              r="8"
              fill="none"
              stroke="rgb(34, 211, 238)"
              strokeWidth="1"
              opacity="0.3"
              className="animate-ping"
            />
            {/* Inner point */}
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill="rgb(34, 211, 238)"
              filter="url(#glow)"
            />
            {/* Center dot */}
            <circle
              cx={point.x}
              cy={point.y}
              r="2"
              fill="white"
            />
          </g>
        ))}

        {/* Face shape label */}
        {showLabels && animationPhase >= 1 && (
          <g className="animate-fadeIn">
            <rect
              x="75"
              y="155"
              width="150"
              height="30"
              rx="15"
              fill="rgba(0,0,0,0.7)"
              stroke="rgb(201, 162, 39)"
              strokeWidth="1"
            />
            <text
              x="150"
              y="175"
              textAnchor="middle"
              fill="rgb(201, 162, 39)"
              fontSize="14"
              fontWeight="bold"
              className="uppercase tracking-widest"
            >
              {faceShape}
            </text>
          </g>
        )}
      </svg>



      <style jsx global>{`
        @keyframes scanLine {
          0%, 100% { transform: translateY(20px); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          50% { transform: translateY(340px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
