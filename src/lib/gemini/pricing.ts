export const GEMINI_PRICING = {
  'gemini-3-flash-preview': {
    inputPerMillionTokens: 0.50,
    outputPerMillionTokens: 3.00,
  },
  'gemini-3-pro-image-preview': {
    inputPerMillionTokens: 2.00,
    outputTextPerMillionTokens: 12.00,
    outputImagePer1k2k: 0.134,
    outputImagePer4k: 0.24,
  },
} as const

export type GeminiModel = keyof typeof GEMINI_PRICING

export type ImageResolution = '1k' | '2k' | '4k'

export interface TokenUsage {
  promptTokens: number
  candidatesTokens: number
  totalTokens: number
  cachedTokens?: number
}

export interface ImageGenerationUsage {
  inputTokens: number
  outputTextTokens: number
  imagesGenerated: number
  imageResolution: ImageResolution
}

export interface CostBreakdown {
  model: GeminiModel
  inputTokens: number
  outputTokens: number
  inputCostUsd: number
  outputCostUsd: number
  totalCostUsd: number
  totalCostIdr: number
  imagesGenerated?: number
  imageCostUsd?: number
}

const USD_TO_IDR = 16000

export function calculateAnalysisCost(
  usage: TokenUsage
): CostBreakdown {
  const pricing = GEMINI_PRICING['gemini-3-flash-preview']

  const inputCostUsd = (usage.promptTokens / 1_000_000) * pricing.inputPerMillionTokens
  const outputCostUsd = (usage.candidatesTokens / 1_000_000) * pricing.outputPerMillionTokens
  const totalCostUsd = inputCostUsd + outputCostUsd

  return {
    model: 'gemini-3-flash-preview',
    inputTokens: usage.promptTokens,
    outputTokens: usage.candidatesTokens,
    inputCostUsd: roundToMicro(inputCostUsd),
    outputCostUsd: roundToMicro(outputCostUsd),
    totalCostUsd: roundToMicro(totalCostUsd),
    totalCostIdr: Math.round(totalCostUsd * USD_TO_IDR),
  }
}

export function calculateImageGenCost(
  usage: ImageGenerationUsage
): CostBreakdown {
  const pricing = GEMINI_PRICING['gemini-3-pro-image-preview']

  const inputCostUsd = (usage.inputTokens / 1_000_000) * pricing.inputPerMillionTokens
  const textOutputCostUsd = (usage.outputTextTokens / 1_000_000) * pricing.outputTextPerMillionTokens
  
  const imageUnitCost = usage.imageResolution === '4k' 
    ? pricing.outputImagePer4k 
    : pricing.outputImagePer1k2k
  const imageCostUsd = usage.imagesGenerated * imageUnitCost
  
  const totalCostUsd = inputCostUsd + textOutputCostUsd + imageCostUsd

  return {
    model: 'gemini-3-pro-image-preview',
    inputTokens: usage.inputTokens,
    outputTokens: usage.outputTextTokens,
    inputCostUsd: roundToMicro(inputCostUsd),
    outputCostUsd: roundToMicro(textOutputCostUsd),
    totalCostUsd: roundToMicro(totalCostUsd),
    totalCostIdr: Math.round(totalCostUsd * USD_TO_IDR),
    imagesGenerated: usage.imagesGenerated,
    imageCostUsd: roundToMicro(imageCostUsd),
  }
}

function roundToMicro(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000
}

export function formatCostIdr(costIdr: number): string {
  return `Rp ${costIdr.toLocaleString('id-ID')}`
}

export function formatCostUsd(costUsd: number): string {
  return `$${costUsd.toFixed(6)}`
}
