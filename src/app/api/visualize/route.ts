import { NextRequest, NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"
import type { PhotoAngle, VisualizationPrompt, VisualizationResult } from "@/types"
import { VISUALIZATION_PROMPT_TEMPLATE } from "@/lib/gemini/prompts"

interface VisualizeRequest {
  recommendationId: string
  originalPhotoDataUrl: string
  originalPhotoAngle: PhotoAngle
  prompt: VisualizationPrompt
}

function extractBase64Data(dataUrl: string): string {
  const match = dataUrl.match(/^data:image\/(\w+);base64,(.+)$/)
  if (!match?.[2]) throw new Error("Invalid data URL format")
  return match[2]
}

function extractMimeType(dataUrl: string): string {
  const match = dataUrl.match(/^data:(image\/\w+);base64,/)
  return match?.[1] ?? "image/jpeg"
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: "GEMINI_API_KEY not configured" },
      { status: 500 }
    )
  }

  let body: VisualizeRequest
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    )
  }

  const { recommendationId, originalPhotoDataUrl, originalPhotoAngle, prompt } = body

  if (!recommendationId || !originalPhotoDataUrl || !originalPhotoAngle || !prompt) {
    return NextResponse.json(
      { success: false, error: "Missing required fields" },
      { status: 400 }
    )
  }

  try {
    const ai = new GoogleGenAI({ apiKey })

    const textPrompt = VISUALIZATION_PROMPT_TEMPLATE(
      prompt.targetModification.hairStyle,
      prompt.targetModification.keyElements,
      prompt.task.strength
    )

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: [
        { text: textPrompt },
        {
          inlineData: {
            mimeType: extractMimeType(originalPhotoDataUrl),
            data: extractBase64Data(originalPhotoDataUrl),
          },
        },
      ],
      config: {
        responseModalities: ["IMAGE"],
        imageConfig: {
          aspectRatio: "3:4",
          imageSize: "1K",
        },
      },
    })

    let generatedImageUrl = originalPhotoDataUrl

    const candidate = response.candidates?.[0]
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData?.data) {
          const mimeType = part.inlineData.mimeType ?? "image/png"
          generatedImageUrl = `data:${mimeType};base64,${part.inlineData.data}`
          break
        }
      }
    }

    const result: VisualizationResult = {
      recommendationId,
      originalPhotoAngle,
      generatedImageUrl,
      prompt,
      createdAt: new Date(),
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Visualization error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Visualization failed",
      },
      { status: 500 }
    )
  }
}
