"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { RecommendationCard } from "@/components/result/recommendation-card"
import { Share2, Home, Download, User, Sparkles, Loader2, Monitor, ChevronLeft, ChevronRight, Copy, Check, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PhotoSession, AnalysisResult, VisualizeResponse, CustomerDisplaySection } from "@/types"
import type { CostBreakdown } from "@/lib/gemini/pricing"

type LoadingState = "loading" | "analyzing" | "visualizing" | "done" | "error"

interface StreamEvent {
  type: "status" | "chunk" | "complete" | "error"
  message?: string
  chunkNum?: number
  totalChars?: number
  preview?: string
  data?: AnalysisResult
  sessionCode?: string
  cost?: CostBreakdown
  error?: string
}

const SECTIONS: { id: CustomerDisplaySection; label: string }[] = [
  { id: "profile_analysis", label: "Profil" },
  { id: "compatibility_matrix", label: "Matrix" },
  { id: "recommendation_1", label: "Rekomendasi 1" },
  { id: "recommendation_2", label: "Rekomendasi 2" },
  { id: "products", label: "Produk" },
]

export default function ResultPage() {
  const router = useRouter()
  const [loadingState, setLoadingState] = useState<LoadingState>("loading")
  const [statusMessage, setStatusMessage] = useState<string>("Loading...")
  const [debugInfo, setDebugInfo] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [visualizedImage, setVisualizedImage] = useState<string | null>(null)
  const [frontPhoto, setFrontPhoto] = useState<string | null>(null)
  const [sessionCode, setSessionCode] = useState<string | null>(null)
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdown | null>(null)
  const [currentSection, setCurrentSection] = useState<CustomerDisplaySection>("profile_analysis")
  const [copied, setCopied] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const updateRemoteSection = useCallback(async (section: CustomerDisplaySection) => {
    if (!sessionCode) return

    setIsUpdating(true)
    try {
      await fetch(`/api/session/${sessionCode}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current_section: section }),
      })
    } catch (err) {
      console.error("Failed to update remote section:", err)
    } finally {
      setIsUpdating(false)
    }
  }, [sessionCode])

  const navigate = useCallback((direction: "prev" | "next") => {
    const currentIndex = SECTIONS.findIndex((s) => s.id === currentSection)
    let newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1
    newIndex = Math.max(0, Math.min(SECTIONS.length - 1, newIndex))
    const newSection = SECTIONS[newIndex]?.id
    if (newSection && newSection !== currentSection) {
      setCurrentSection(newSection)
      updateRemoteSection(newSection)
    }
  }, [currentSection, updateRemoteSection])

  const goToSection = useCallback((section: CustomerDisplaySection) => {
    setCurrentSection(section)
    updateRemoteSection(section)
  }, [updateRemoteSection])

  const copySessionCode = () => {
    if (!sessionCode) return
    navigator.clipboard.writeText(sessionCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getViewUrl = () => {
    if (typeof window === "undefined" || !sessionCode) return ""
    return `${window.location.origin}/view/${sessionCode}`
  }

  useEffect(() => {
    const sessionData = sessionStorage.getItem("hairvision_session")
    if (!sessionData) {
      router.push("/scan")
      return
    }

    let session: PhotoSession
    try {
      session = JSON.parse(sessionData)
    } catch {
      router.push("/scan")
      return
    }

    const photos: Record<string, string> = {}
    const angles = ["front", "top", "left", "right"] as const
    for (const angle of angles) {
      const photo = session.photos[angle]
      if (photo?.dataUrl) {
        photos[angle] = photo.dataUrl
      }
    }

    if (Object.keys(photos).length < 4) {
      router.push("/scan")
      return
    }

    setFrontPhoto(photos.front ?? null)
    setLoadingState("analyzing")
    setStatusMessage("Connecting to AI...")

    const analyzeWithStream = async () => {
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: session.id, photos }),
        })

        const reader = response.body?.getReader()
        if (!reader) {
          throw new Error("No response stream")
        }

        const decoder = new TextDecoder()
        let buffer = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })

          const lines = buffer.split("\n\n")
          buffer = lines.pop() ?? ""

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const event: StreamEvent = JSON.parse(line.slice(6))

                if (event.type === "status") {
                  setStatusMessage(event.message ?? "Processing...")
                } else if (event.type === "chunk") {
                  setDebugInfo(`Chunk #${event.chunkNum} | ${event.totalChars} chars`)
                  setStatusMessage(`Receiving data... (${event.totalChars} chars)`)
                } else if (event.type === "complete" && event.data) {
                  setAnalysis(event.data)
                  if (event.sessionCode) {
                    setSessionCode(event.sessionCode)
                  }
                  if (event.cost) {
                    setCostBreakdown(event.cost)
                  }
                  if (photos.front) {
                    await generateVisualization(event.data, photos.front)
                  } else {
                    setLoadingState("done")
                  }
                } else if (event.type === "error") {
                  setError(event.error ?? "Unknown error")
                  setLoadingState("error")
                  return
                }
              } catch {
                console.error("Failed to parse SSE:", line)
              }
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Network error")
        setLoadingState("error")
      }
    }

    const generateVisualization = async (analysisData: AnalysisResult, frontPhotoUrl: string) => {
      setLoadingState("visualizing")
      setStatusMessage("Generating hairstyle preview...")

      const primaryRec = analysisData.recommendations[0]

      try {
        const vizResponse = await fetch("/api/visualize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recommendationId: primaryRec.id,
            originalPhotoDataUrl: frontPhotoUrl,
            originalPhotoAngle: "front",
            prompt: {
              task: {
                type: "image_to_image",
                strength: 0.7,
                focusArea: "Hair and head region",
                preserveOriginalFeatures: ["Face identity", "Skin tone", "Background"],
              },
              globalContext: {
                sceneDescription: "Professional portrait",
                lighting: { source: "Natural", direction: "Front" },
              },
              targetModification: {
                hairStyle: primaryRec.name,
                keyElements: [
                  primaryRec.barberInstructions.sides.fadeType ?? "clean sides",
                  `${primaryRec.barberInstructions.top.lengthCm}cm on top`,
                  primaryRec.barberInstructions.back.necklineShape + " neckline",
                ],
              },
              microDetails: primaryRec.barberInstructions.styling.products,
              negativePromptConstraints: [
                "No distortion of facial features",
                "No unnatural hair colors",
              ],
            },
          }),
        })

        const vizData: VisualizeResponse = await vizResponse.json()
        if (vizData.success && vizData.data) {
          setVisualizedImage(vizData.data.generatedImageUrl)
        }
      } catch (vizError) {
        console.error("Visualization error:", vizError)
      }

      setLoadingState("done")
    }

    analyzeWithStream()
  }, [router])

  if (loadingState === "loading" || loadingState === "analyzing" || loadingState === "visualizing") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <Loader2 className="w-12 h-12 text-accent animate-spin mb-4" />
        <p className="text-accent font-bold tracking-widest animate-pulse text-center">
          {loadingState === "loading" && "LOADING SESSION..."}
          {loadingState === "analyzing" && "ANALYZING GEOMETRY..."}
          {loadingState === "visualizing" && "GENERATING HAIRSTYLE..."}
        </p>
        <p className="text-white/60 text-sm mt-2 text-center">{statusMessage}</p>
        {debugInfo && (
          <p className="text-white/40 text-xs mt-1 font-mono">{debugInfo}</p>
        )}
      </div>
    )
  }

  if (loadingState === "error" || !analysis) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <p className="text-red-400 text-center mb-4">{error ?? "Something went wrong"}</p>
        <Link href="/scan">
          <Button>Try Again</Button>
        </Link>
      </div>
    )
  }

  const { geometricAnalysis, recommendations } = analysis
  const primaryRec = recommendations[0]
  const displayImage = visualizedImage ?? frontPhoto

  const formatBarberScript = (rec: typeof recommendations[0]) => {
    const { barberInstructions: bi } = rec
    return `SIDES: Guard ${bi.sides.clipperGuard}${bi.sides.fadeType ? `, ${bi.sides.fadeType.replace("_", " ")}` : ""}
${bi.sides.blendingNotes}

TOP: ${bi.top.lengthCm}cm (${bi.top.lengthInches}in)
${bi.top.technique}
${bi.top.layeringNotes}

BACK: ${bi.back.necklineShape} neckline, guard ${bi.back.clipperGuard}
${bi.back.blendingNotes}

TEXTURE: ${bi.texture.techniques.join(", ")}
${bi.texture.notes}

STYLING: ${bi.styling.products.join(", ")}
${bi.styling.applicationSteps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`
  }

  const currentIndex = SECTIONS.findIndex((s) => s.id === currentSection)
  const canGoPrev = currentIndex > 0
  const canGoNext = currentIndex < SECTIONS.length - 1

  return (
    <div className="min-h-screen bg-background pb-48 font-sans relative">
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />

      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <h1 className="font-serif text-xl font-bold tracking-tight text-white">
          Hair<span className="text-accent">Vision</span>
        </h1>
        <Link href="/">
          <Button variant="ghost" size="icon" className="hover:bg-white/5">
            <Home className="w-5 h-5 text-muted-foreground" />
          </Button>
        </Link>
      </header>

      <main className="px-6 py-8 space-y-8 max-w-lg mx-auto">
        {sessionCode && (
          <div className="bg-card border border-accent/20 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-accent">
              <Monitor className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Customer Display</span>
            </div>

            <div className="flex items-center justify-between gap-6">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-background px-4 py-2 rounded-lg border border-white/10 font-mono text-2xl font-bold tracking-[0.3em] text-white">
                    {sessionCode}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={copySessionCode}
                    className="text-muted-foreground hover:text-white"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Buka di tablet customer atau scan QR
                </p>
                <a
                  href={getViewUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  Buka di tab baru
                </a>
              </div>

              <div className="bg-white p-2 rounded-lg">
                <QRCodeSVG
                  value={getViewUrl()}
                  size={80}
                  level="M"
                  bgColor="#ffffff"
                  fgColor="#0d0d0d"
                />
              </div>
            </div>

            {costBreakdown && (
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Biaya Analisis:</span>
                <span className="text-accent font-medium">
                  Rp {costBreakdown.totalCostIdr.toLocaleString("id-ID")} 
                  <span className="text-muted-foreground ml-1">(${costBreakdown.totalCostUsd.toFixed(4)})</span>
                </span>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded p-4 flex flex-col items-center justify-center text-center space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Face Shape</span>
            <span className="font-serif text-xl text-white font-bold capitalize">{geometricAnalysis.faceShape}</span>
          </div>
          <div className="bg-card border border-border rounded p-4 flex flex-col items-center justify-center text-center space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Hair Texture</span>
            <span className="font-serif text-xl text-white font-bold capitalize">
              {geometricAnalysis.hairTexture} / {geometricAnalysis.hairDensity}
            </span>
          </div>
        </div>

        <div className="relative aspect-[4/5] w-full rounded-lg overflow-hidden border border-white/10 group shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
          {displayImage ? (
            <Image
              src={displayImage}
              alt="Hairstyle visualization"
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
          )}
          <div className="absolute bottom-6 left-6 right-6 z-20">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-accent text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> {visualizedImage ? "AI Generated" : "Original Photo"}
              </div>
            </div>
            <p className="text-white text-sm font-medium leading-snug opacity-90">
              {visualizedImage ? `${primaryRec.name} visualization` : `Visualizing ${primaryRec.name}...`}
            </p>
          </div>
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
            <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-black/50 backdrop-blur text-white border border-white/10 hover:bg-accent hover:text-black hover:border-accent">
              <Download className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-black/50 backdrop-blur text-white border border-white/10 hover:bg-accent hover:text-black hover:border-accent">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            Recommendations <span className="text-sm font-sans font-normal text-muted-foreground self-end mb-1">({recommendations.length})</span>
          </h2>
          <div className="space-y-6">
            {recommendations.map((rec, i) => (
              <RecommendationCard
                key={rec.id}
                title={rec.name}
                score={rec.suitabilityScore}
                description={rec.geometricReasoning}
                script={formatBarberScript(rec)}
                isPrimary={i === 0}
              />
            ))}
          </div>
        </div>
      </main>

      {sessionCode && (
        <div className="fixed bottom-20 left-0 w-full bg-background/95 backdrop-blur border-t border-white/10 px-4 py-4 z-40">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <Monitor className="w-4 h-4 text-accent" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Kontrol Display Customer</span>
              {isUpdating && <Loader2 className="w-3 h-3 text-accent animate-spin ml-auto" />}
            </div>
            
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
              {SECTIONS.map((section, idx) => (
                <button
                  key={section.id}
                  onClick={() => goToSection(section.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                    currentSection === section.id
                      ? "bg-accent text-accent-foreground"
                      : "bg-card border border-white/10 text-muted-foreground hover:text-white hover:border-white/20"
                  )}
                >
                  {idx + 1}. {section.label}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                disabled={!canGoPrev || isUpdating}
                onClick={() => navigate("prev")}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Sebelumnya
              </Button>
              <Button
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={!canGoNext || isUpdating}
                onClick={() => navigate("next")}
              >
                Selanjutnya
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 w-full bg-background/90 backdrop-blur border-t border-white/10 p-4 z-40">
        <Button className="w-full shadow-[0_0_20px_rgba(201,162,39,0.2)]" size="lg">
          <User className="w-4 h-4 mr-2" /> Save to Client Profile
        </Button>
      </div>
    </div>
  )
}
