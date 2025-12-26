import { NextRequest } from "next/server"
import { GoogleGenAI } from "@google/genai"
import { HAIRVISION_SYSTEM_PROMPT } from "@/lib/gemini/prompts"
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client"
import type { SessionInsert } from "@/lib/supabase/types"
import type {
  PhotoAngle,
  AnalysisResult,
  GeometricAnalysis,
  HairstyleRecommendation,
  StyleCompatibility,
  FaceProportions,
  HairAnalysis,
} from "@/types"

interface AnalyzeRequest {
  sessionId: string
  photos: Record<PhotoAngle, string>
}

interface GeminiAnalysisResponse {
  geometricAnalysis: GeometricAnalysis & {
    faceShapeConfidencePercent?: number
    faceProportions?: FaceProportions
    hairAnalysis?: HairAnalysis
  }
  compatibilityMatrix?: StyleCompatibility[]
  recommendations: (HairstyleRecommendation & {
    description?: string
    whyItWorks?: string[]
  })[]
  visualizationPrompts: unknown[]
}

function extractBase64Data(dataUrl: string): string {
  const match = dataUrl.match(/^data:image\/\w+;base64,(.+)$/)
  if (!match?.[1]) throw new Error("Invalid data URL format")
  return match[1]
}

function generateSessionCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return new Response(
      `data: ${JSON.stringify({ type: "error", error: "GEMINI_API_KEY not configured" })}\n\n`,
      { status: 500, headers: { "Content-Type": "text/event-stream" } }
    )
  }

  let body: AnalyzeRequest
  try {
    body = await request.json()
  } catch {
    return new Response(
      `data: ${JSON.stringify({ type: "error", error: "Invalid JSON body" })}\n\n`,
      { status: 400, headers: { "Content-Type": "text/event-stream" } }
    )
  }

  const { sessionId, photos } = body
  if (!sessionId || !photos) {
    return new Response(
      `data: ${JSON.stringify({ type: "error", error: "Missing sessionId or photos" })}\n\n`,
      { status: 400, headers: { "Content-Type": "text/event-stream" } }
    )
  }

  const angles: PhotoAngle[] = ["front", "top", "left", "right"]
  for (const angle of angles) {
    if (!photos[angle]) {
      return new Response(
        `data: ${JSON.stringify({ type: "error", error: `Missing photo for angle: ${angle}` })}\n\n`,
        { status: 400, headers: { "Content-Type": "text/event-stream" } }
      )
    }
  }

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      try {
        send({ type: "status", message: "Initializing Gemini..." })

        const ai = new GoogleGenAI({ apiKey })

        send({ type: "status", message: "Preparing 4 photos..." })

        const contents = [
          { text: HAIRVISION_SYSTEM_PROMPT },
          { text: `Analyze these 4 photos of the client's head from different angles:
1. Front view
2. Top view  
3. Left side view
4. Right side view` },
          ...angles.map((angle) => ({
            inlineData: {
              mimeType: "image/jpeg",
              data: extractBase64Data(photos[angle]),
            },
          })),
        ]

        send({ type: "status", message: "Starting analysis with Gemini 3 Flash..." })

        const response = await ai.models.generateContentStream({
          model: "gemini-3-flash-preview",
          contents,
        })

        let fullText = ""
        let chunkCount = 0

        for await (const chunk of response) {
          const text = chunk.text ?? ""
          fullText += text
          chunkCount++

          const preview = fullText.length > 80 ? fullText.slice(-80) : fullText
          send({
            type: "chunk",
            chunkNum: chunkCount,
            totalChars: fullText.length,
            preview: preview.replace(/\n/g, " "),
          })
        }

        send({ type: "status", message: "Parsing JSON response..." })

        const jsonMatch = fullText.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
          send({ type: "error", error: "Failed to parse AI response as JSON", raw: fullText.slice(0, 500) })
          controller.close()
          return
        }

        const parsed: GeminiAnalysisResponse = JSON.parse(jsonMatch[0])

        const rec1 = parsed.recommendations[0]
        const rec2 = parsed.recommendations[1]

        if (!rec1 || !rec2) {
          send({ type: "error", error: "AI did not return 2 recommendations" })
          controller.close()
          return
        }

        const enrichedGeometricAnalysis: GeometricAnalysis = {
          ...parsed.geometricAnalysis,
          ...(parsed.geometricAnalysis.faceShapeConfidencePercent !== undefined && {
            faceShapeConfidencePercent: parsed.geometricAnalysis.faceShapeConfidencePercent,
          }),
          ...(parsed.geometricAnalysis.faceProportions && {
            faceProportions: parsed.geometricAnalysis.faceProportions,
          }),
          ...(parsed.geometricAnalysis.hairAnalysis && {
            hairAnalysis: parsed.geometricAnalysis.hairAnalysis,
          }),
        }

        const enrichedRec1: HairstyleRecommendation = {
          ...rec1,
          ...(rec1.description && { description: rec1.description }),
          ...(rec1.whyItWorks && { whyItWorks: rec1.whyItWorks }),
        }
        const enrichedRec2: HairstyleRecommendation = {
          ...rec2,
          ...(rec2.description && { description: rec2.description }),
          ...(rec2.whyItWorks && { whyItWorks: rec2.whyItWorks }),
        }

        const analysisResult: AnalysisResult = {
          id: crypto.randomUUID(),
          sessionId,
          geometricAnalysis: enrichedGeometricAnalysis,
          ...(parsed.compatibilityMatrix && { compatibilityMatrix: parsed.compatibilityMatrix }),
          recommendations: [enrichedRec1, enrichedRec2],
          createdAt: new Date(),
        }

        const sessionCode = generateSessionCode()

        if (isSupabaseConfigured()) {
          send({ type: "status", message: "Saving to database..." })

          const insertData: SessionInsert = {
            session_code: sessionCode,
            analysis_result: JSON.parse(JSON.stringify(analysisResult)),
            current_section: 'scan_complete',
          }

          const { error: dbError } = await supabase.from('sessions').insert(insertData)

          if (dbError) {
            console.error("Supabase insert error:", dbError)
          }
        }

        send({ type: "complete", data: analysisResult, sessionCode })
        controller.close()
      } catch (error) {
        console.error("Analysis error:", error)
        send({
          type: "error",
          error: error instanceof Error ? error.message : "Analysis failed",
        })
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
